# PR environment cleanup

This walkthrough configures the external Google Cloud and GitHub resources that invoke [`cloudbuild-pr-cleanup.yaml`](../../cloudbuild-pr-cleanup.yaml) when a pull request is merged or closed. See [environments](environments.md) for how `pr-N` targets reuse selected development resources while retaining an isolated application release and database.

> **AI execution boundary:** The Cloud Build trigger, API key, Secret Manager secret, and GitHub webhook are persistent remote resources. An AI agent may inspect metadata and prepare configuration, but the user must create, update, rotate, or delete them. Never expose a generated webhook URL, API key, or secret value in source control, chat, tickets, or logs.

## Runtime behavior

GitHub sends pull-request events to a Cloud Build webhook trigger. The trigger maps the GitHub payload into these substitutions:

| Substitution | Payload binding | Purpose |
| --- | --- | --- |
| `_PR_ACTION` | `$(body.action)` | Restricts teardown to GitHub's `closed` action. |
| `_PR_NUMBER` | `$(body.number)` | Identifies the isolated `pr-N` deployment and database. |
| `_REPOSITORY` | `$(body.repository.full_name)` | Lets the trigger filter events to this repository. |

The trigger's CEL filter must restrict builds to the `closed` action for the repository. The cleanup configuration repeats the action guard, requires a repository payload, and validates the PR number before forming an environment name. It cancels any ongoing deployment build for the PR and waits until no matching build remains. For a valid closed PR, the trusted CI cleanup then runs these commands in order:

```sh
taito stop:pr-N
taito db drop:pr-N
```

Stopping the application before dropping its database avoids leaving workloads connected to a removed database. Cleanup failures stay visible in Cloud Build; resolve a permission or teardown failure before treating cleanup as complete.

The trigger is a Cloud Build webhook trigger rather than a GitHub Actions workflow, so it runs with the existing CI execution identity and reads the trusted deployment branch. It must not create a competing PR deployment workflow.

## Prerequisites

- [`cloudbuild-pr-cleanup.yaml`](../../cloudbuild-pr-cleanup.yaml) is merged into the trusted deployment branch, normally `dev`.
- You can manage Cloud Build triggers, API keys, and Secret Manager secrets in the Google Cloud project.
- You can manage webhooks for the GitHub repository.
- Reuse the service account already used by the normal CI deployment trigger. Do not create a second broadly privileged CI service account for cleanup.

## Create webhook credentials

1. Create a high-entropy Secret Manager secret named `<project>-pr-cleanup-webhook`. Use an enabled version as the webhook trigger secret. Never commit or print its value.
2. Create a dedicated API key in **APIs & Services → Credentials**. Keep **Application restrictions** as **None**, because GitHub sends the request, and restrict **API restrictions** to **Cloud Build API**. Do not reuse an application API key with unrelated restrictions.

Cloud Build may create or retrieve the API key while the trigger is configured, but do not rely on that. The generated webhook URL needs both the API key and Secret Manager value.

## Create the Cloud Build trigger

Open **Cloud Build → Triggers**, select **Create trigger**, and configure the following values. Replace angle-bracket placeholders with this project's values.

| Console field | Value |
| --- | --- |
| Name | `<project>-pr-cleanup` |
| Region | The same region as the normal deployment trigger |
| Event | **Webhook event** |
| Webhook secret | `<project>-pr-cleanup-webhook` and its enabled version |
| Repository generation | Match the existing GitHub connection |
| Repository | `<owner>/<repository>` |
| Branch | Trusted deployment branch, normally `dev` |
| Configuration type | **Cloud Build configuration file (YAML or JSON)** |
| Configuration location | **Repository** |
| Cloud Build configuration file location | `cloudbuild-pr-cleanup.yaml` |
| Service account | The existing CI deployment execution service account |

Under **Substitution variables**, enter these values exactly, without surrounding quotes or trailing whitespace:

| Variable | Value |
| --- | --- |
| `_PR_ACTION` | `$(body.action)` |
| `_PR_NUMBER` | `$(body.number)` |
| `_REPOSITORY` | `$(body.repository.full_name)` |

Under **Filters**, add this CEL expression, replacing the placeholder:

```text
_PR_ACTION == "closed" && _REPOSITORY == "<owner>/<repository>"
```

After selecting the secret version, verify that the webhook URL preview contains both `key=` and `secret=` query parameters. If it does not, create the dedicated API key, then reselect the secret version. Create the trigger and copy the complete generated URL for GitHub. Treat the URL as a credential.

### `gcloud` alternative

For a first-generation GitHub connection, the equivalent user-run command is:

```sh
gcloud builds triggers create webhook \
  --name=<project>-pr-cleanup \
  --region=<region> \
  --service-account=projects/<project-id>/serviceAccounts/<ci-service-account> \
  --secret=projects/<project-id>/secrets/<project>-pr-cleanup-webhook/versions/1 \
  --repo=https://www.github.com/<owner>/<repository> \
  --repo-type=GITHUB \
  --branch=dev \
  --build-config=cloudbuild-pr-cleanup.yaml \
  --substitutions='_PR_ACTION=$(body.action),_PR_NUMBER=$(body.number),_REPOSITORY=$(body.repository.full_name)' \
  --subscription-filter='_PR_ACTION == "closed" && _REPOSITORY == "<owner>/<repository>"'
```

This creates the trigger but does not replace the API-key and GitHub-webhook setup. Review the command's project, region, branch, repository, and service account before running it.

## Create the GitHub webhook

In the GitHub repository settings, add a webhook with these values:

| GitHub field | Value |
| --- | --- |
| Payload URL | The complete URL generated by Cloud Build, including all query parameters |
| Content type | `application/json` |
| Secret | Leave empty; Cloud Build authenticates the generated query parameters |
| Events | Select only **Pull requests** |
| Active | Enabled |

Grant the Cloud Build service agent **Secret Manager Secret Accessor** only on the webhook secret. Keep the existing CI service account as the build execution identity.

## Verify manually

GitHub emits the `closed` action for merged and unmerged pull requests. Use a non-production PR to verify the setup:

1. Confirm that the PR environment exists.
2. Close or merge the PR.
3. Confirm that the cleanup build succeeds and that its release, workloads, and PR database are removed.
4. If reopen behavior matters, reopen the PR and confirm that the normal deployment process recreates the environment.

## Rotate an exposed webhook URL

If the generated webhook URL is exposed, disable or delete its API key, add a new Secret Manager version, and replace the GitHub webhook URL with a newly generated one. Disable the old secret version only after the replacement is active.
