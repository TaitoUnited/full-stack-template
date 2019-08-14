# NOTE: This is a quick example that has not yet been tested at all.
# Here we run the same CI/CD steps that are defined also in
# bitbucket-pipelines.yml, cloudbuild.yaml, and local-ci.sh.

# NOTE: HCL format is deprecated. Use YAML instead:
# https://help.github.com/en/articles/migrating-github-actions-from-hcl-syntax-to-yaml-syntax

workflow "Build, deploy, test, publish" {
  on = "push"
  resolves = ["build-release"]
}

# Prepare build

action "build-prepare" {
  uses = "docker://$template_default_taito_image"
  runs = ["bash", "-c", "taito build prepare:${GITHUB_REF#refs/heads/}"]
  env = {
    taito_mode = "ci"
  }
}

# Prepare artifacts in parallel

action "artifact-prepare:admin" {
  needs = "build-prepare"
  uses = "docker://$template_default_taito_image"
  runs = [
    "bash", "-c",
    "taito artifact prepare:admin:${GITHUB_REF#refs/heads/} $GITHUB_SHA"
  ]
  env = {
    taito_mode = "ci"
  }
}
action "artifact-prepare:client" {
  needs = "build-prepare"
  uses = "docker://$template_default_taito_image"
  runs = [
    "bash", "-c",
    "taito artifact prepare:client:${GITHUB_REF#refs/heads/} $GITHUB_SHA"
  ]
  env = {
    taito_mode = "ci"
  }
}
action "artifact-prepare:graphql" {
  needs = "build-prepare"
  uses = "docker://$template_default_taito_image"
  runs = [
    "bash", "-c",
    "taito artifact prepare:graphql:${GITHUB_REF#refs/heads/} $GITHUB_SHA"
  ]
  env = {
    taito_mode = "ci"
  }
}
action "artifact-prepare:server" {
  needs = "build-prepare"
  uses = "docker://$template_default_taito_image"
  runs = [
    "bash", "-c",
    "taito artifact prepare:server:${GITHUB_REF#refs/heads/} $GITHUB_SHA"
  ]
  env = {
    taito_mode = "ci"
  }
}
action "artifact-prepare:www" {
  needs = "build-prepare"
  uses = "docker://$template_default_taito_image"
  runs = [
    "bash", "-c",
    "taito artifact prepare:www:${GITHUB_REF#refs/heads/} $GITHUB_SHA"
  ]
  env = {
    taito_mode = "ci"
  }
}

# Deploy

action "db-deploy" {
  uses = "docker://$template_default_taito_image"
  runs = ["bash", "-c", "taito db deploy:${GITHUB_REF#refs/heads/}"]
  env = {
    taito_mode = "ci"
  }
}
action "deployment-deploy" {
  uses = "docker://$template_default_taito_image"
  runs = ["bash", "-c", "taito deployment deploy:${GITHUB_REF#refs/heads/} $GITHUB_SHA"]
  env = {
    taito_mode = "ci"
  }
}

# Test and verify deployment

action "deployment-wait" {
  uses = "docker://$template_default_taito_image"
  runs = ["bash", "-c", "taito deployment wait:${GITHUB_REF#refs/heads/}"]
  env = {
    taito_mode = "ci"
  }
}
action "test" {
  uses = "docker://$template_default_taito_image"
  runs = ["bash", "-c", "taito test:${GITHUB_REF#refs/heads/}"]
  env = {
    taito_mode = "ci"
  }
}
action "deployment-verify" {
  uses = "docker://$template_default_taito_image"
  runs = ["bash", "-c", "taito deployment verify:${GITHUB_REF#refs/heads/}"]
  env = {
    taito_mode = "ci"
  }
}

# Release artifacts

action "artifact-release:admin" {
  needs = "deployment-verify"
  uses = "docker://$template_default_taito_image"
  runs = [
    "bash", "-c",
    "taito artifact release:admin:${GITHUB_REF#refs/heads/} $GITHUB_SHA"
  ]
  env = {
    taito_mode = "ci"
  }
}
action "artifact-release:client" {
  needs = "deployment-verify"
  uses = "docker://$template_default_taito_image"
  runs = [
    "bash", "-c",
    "taito artifact release:client:${GITHUB_REF#refs/heads/} $GITHUB_SHA"
  ]
  env = {
    taito_mode = "ci"
  }
}
action "artifact-release:graphql" {
  needs = "deployment-verify"
  uses = "docker://$template_default_taito_image"
  runs = [
    "bash", "-c",
    "taito artifact release:graphql:${GITHUB_REF#refs/heads/} $GITHUB_SHA"
  ]
  env = {
    taito_mode = "ci"
  }
}
action "artifact-release:server" {
  needs = "deployment-verify"
  uses = "docker://$template_default_taito_image"
  runs = [
    "bash", "-c",
    "taito artifact release:server:${GITHUB_REF#refs/heads/} $GITHUB_SHA"
  ]
  env = {
    taito_mode = "ci"
  }
}
action "artifact-release:www" {
  needs = "deployment-verify"
  uses = "docker://$template_default_taito_image"
  runs = [
    "bash", "-c",
    "taito artifact release:www:${GITHUB_REF#refs/heads/} $GITHUB_SHA"
  ]
  env = {
    taito_mode = "ci"
  }
}

# Release build

action "build-release" {
  uses = "docker://$template_default_taito_image"
  runs = [
    "bash", "-c",
    "taito build release:${GITHUB_REF#refs/heads/}"
  ]
  env = {
    taito_mode = "ci"
  }
}
