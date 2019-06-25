> This page contains a short summary of the project itself. See [DEVELOPMENT.md](DEVELOPMENT.md) for development instructions.

[//]: # (TEMPLATE NOTE START)

# server-template

Template for applications and APIs running on Kubernetes. The example implementation is based on React, Node.js, Postgres and S3, but you can choose your own custom stack by selecting stack components from [alternatives](https://github.com/TaitoUnited/server-template/tree/master/alternatives). Support for [Knative](https://pivotal.io/knative), [Istio](https://istio.io/) and [Telepresence](https://www.telepresence.io/) will likely be added later, once they have matured enough.

You can create a new project from this template by running `taito project create: server-template`. Later you can upgrade your project to the latest version of the template by running `taito project upgrade`. To ensure flawless upgrade, do not modify files that have a **do-not-modify** note in them as they are designed to be reusable and easily configurable for various needs. In such case, improve the original files of the template instead, and then upgrade.

You can also migrate an existing project that does not currently use Taito CLI by running `taito project migrate: server-template` in your project root folder.

[//]: # (TEMPLATE NOTE END)
# Project title

Short description of the project: vision, purpose, company, etc.

Table of contents:

* [Links](#links)
* [Usage](#usage)
* [Contacts](#contacts)
* [Responsibilities](#responsibilities)
* [Intellectual property rights](#intellectual-property-rights)
* [Manually configured settings](#manually-configured-settings)
* [Recurring issues and solutions](#recurring-issues-and-solutions)
* [Miscellaneous notes](#miscellaneous-notes)
* [Conventions](#conventions)
* [Architecture Overview](#architecture-overview)
* [Security](#security)
* [GDPR](#gdpr)

## Links

Non-production basic auth credentials: CREDENTIALS

[//]: # (GENERATED LINKS START)

LINKS WILL BE GENERATED HERE

[//]: # (GENERATED LINKS END)

> You can update this section by configuring links in `taito-config.sh` and running `taito project docs`.

## Usage

> Some notes about testing and usage either here or in a separate document.

## Contacts

* Project Manager: John Doe, Company co.
* Designer: Jane Doe, Company co.

> NOTE: It is recommended to use a shared address book or CRM for keeping the contact details like email and phone number up-to-date.

## Responsibilities

Hosting, billing and control of 3rd party services, SSL/TLS certificates, etc.

## Intellectual property rights

> IPR ownership. Also update the LICENSE file. TODO license examples

## Manually configured settings

> Try to keep all configurations in version control. However, if you have configured something manually, describe manually configured settings here.

## Recurring issues and solutions

See trouble.txt or run `taito trouble`.

## Miscellaneous notes

Misc notes.

## Conventions

Project specific conventions.

## Architecture Overview

DIAGRAM: You can use [Gravizo](https://www.gravizo.com) for making a architecture diagram if the diagram does not contain any confidential information. Note that architecture diagram is not mandatory if the architecture is very simple.

### Integrations

* Client uses Google Maps
* Server uses system X for authorization (OAUTH)
* Server fetches products from system Y (REST/json)
* Server sends email using Sendgrid (REST/json)

### Processes

Only non-trivial processes need to be described here (e.g. scheduled batch processing), though it might be a good idea to describe one or two basic scenarios also. Architecture is the main focus here. User stories should be documented elsewhere (e.g. wiki).

#### Basic Scenario

1. User performs action on UI
2. Server authorizes action by system X
3. Server reads/updates database
4. Server returns value

#### Product Snapshots

1. User performs action on UI
2. Server adds message to queue
5. ...
6. ...
7. Server sends email

#### Scheduled Jobs

* ...
* ...

## Security

> Add security details either here or in a separate document. See the [security](https://taitounited.github.io/taito-cli/tutorial/d-security/) appendix of the [Taito CLI tutorial](https://taitounited.github.io/taito-cli/tutorial).

## GDPR

> Add GDPR details either here or in a separate document. See the [data protection and privacy](https://taitounited.github.io/taito-cli/tutorial/e-data-protection-and-privacy) appendix of the [Taito CLI tutorial](https://taitounited.github.io/taito-cli/tutorial).
