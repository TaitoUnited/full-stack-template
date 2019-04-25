# NOTE: This is a quick example that has not yet been tested at all.
# Here we run the same CI/CD steps that are defined also in
# bitbucket-pipelines.yml, cloudbuild.yaml, and build.sh.

workflow "Build, deploy, test, publish" {
  on = "push"
  resolves = ["artifact-publish"]
}

# Install libraries

action "install" {
  uses = "docker://$template_default_taito_image"
  runs = ["bash", "-c", "taito install:${GITHUB_REF#refs/heads/}"]
  env = {
    taito_mode = "ci"
  }
}

# Do preparations, code scans, and documentation generation in parallel

action "artifact-prepare" {
  needs = "install"
  uses = "docker://$template_default_taito_image"
  runs = ["bash", "-c", "taito artifact-prepare:${GITHUB_REF#refs/heads/}"]
  env = {
    taito_mode = "ci"
  }
}
action "scan" {
  needs = "install"
  uses = "docker://$template_default_taito_image"
  runs = ["bash", "-c", "taito scan:${GITHUB_REF#refs/heads/}"]
  env = {
    taito_mode = "ci"
  }
}
action "docs" {
  needs = "install"
  uses = "docker://$template_default_taito_image"
  runs = ["bash", "-c", "taito docs:${GITHUB_REF#refs/heads/}"]
  env = {
    taito_mode = "ci"
  }
}

# Build and push container images in parallel

action "artifact:admin" {
  needs = "artifact-prepare"
  uses = "docker://$template_default_taito_image"
  runs = [
    "bash", "-c",
    "taito artifact-build:admin:${GITHUB_REF#refs/heads/} $GITHUB_SHA",
    "taito artifact-push:admin:${GITHUB_REF#refs/heads/} $GITHUB_SHA"
  ]
  env = {
    taito_mode = "ci"
  }
}
action "artifact:client" {
  needs = "artifact-prepare"
  uses = "docker://$template_default_taito_image"
  runs = [
    "bash", "-c",
    "taito artifact-build:client:${GITHUB_REF#refs/heads/} $GITHUB_SHA",
    "taito artifact-push:client:${GITHUB_REF#refs/heads/} $GITHUB_SHA"
  ]
  env = {
    taito_mode = "ci"
  }
}
action "artifact:graphql" {
  needs = "artifact-prepare"
  uses = "docker://$template_default_taito_image"
  runs = [
    "bash", "-c",
    "taito artifact-build:graphql:${GITHUB_REF#refs/heads/} $GITHUB_SHA",
    "taito artifact-push:graphql:${GITHUB_REF#refs/heads/} $GITHUB_SHA"
  ]
  env = {
    taito_mode = "ci"
  }
}
action "artifact:server" {
  needs = "artifact-prepare"
  uses = "docker://$template_default_taito_image"
  runs = [
    "bash", "-c",
    "taito artifact-build:server:${GITHUB_REF#refs/heads/} $GITHUB_SHA",
    "taito artifact-push:server:${GITHUB_REF#refs/heads/} $GITHUB_SHA"
  ]
  env = {
    taito_mode = "ci"
  }
}
action "artifact:www" {
  needs = "artifact-prepare"
  uses = "docker://$template_default_taito_image"
  runs = [
    "bash", "-c",
    "taito artifact-build:www:${GITHUB_REF#refs/heads/} $GITHUB_SHA",
    "taito artifact-push:www:${GITHUB_REF#refs/heads/} $GITHUB_SHA"
  ]
  env = {
    taito_mode = "ci"
  }
}

# Deploy

action "db-deploy" {
  needs = "TODO: how to wait for all previous steps?"
  uses = "docker://$template_default_taito_image"
  runs = ["bash", "-c", "taito db-deploy:${GITHUB_REF#refs/heads/}"]
  env = {
    taito_mode = "ci"
  }
}
action "deployment-deploy" {
  needs = "db-deploy"
  uses = "docker://$template_default_taito_image"
  runs = ["bash", "-c", "taito deployment-deploy:${GITHUB_REF#refs/heads/} $GITHUB_SHA"]
  env = {
    taito_mode = "ci"
  }
}

# Test and verify deployment

action "deployment-wait" {
  needs = "deployment-deploy"
  uses = "docker://$template_default_taito_image"
  runs = ["bash", "-c", "taito deployment-wait:${GITHUB_REF#refs/heads/}"]
  env = {
    taito_mode = "ci"
  }
}
action "test" {
  needs = "deployment-wait"
  uses = "docker://$template_default_taito_image"
  runs = ["bash", "-c", "taito test:${GITHUB_REF#refs/heads/}"]
  env = {
    taito_mode = "ci"
  }
}
action "deployment-verify" {
  needs = "test"
  uses = "docker://$template_default_taito_image"
  runs = ["bash", "-c", "taito deployment-verify:${GITHUB_REF#refs/heads/}"]
  env = {
    taito_mode = "ci"
  }
}

# Publish artifacts and release

action "artifact-publish" {
  needs = "deployment-verify"
  uses = "docker://$template_default_taito_image"
  runs = [
    "bash", "-c",
    "taito artifact-publish:${GITHUB_REF#refs/heads/}",
    "taito artifact-release:${GITHUB_REF#refs/heads/}"
  ]
  env = {
    taito_mode = "ci"
  }
}
