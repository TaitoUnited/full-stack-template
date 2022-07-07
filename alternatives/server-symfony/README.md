# full-stack-template | server

This template is work in progress. At least the following need to be configured manually:

1. Add nginx as sidecar:

On docker-nginx.conf:

```
  location /api {
      client_max_body_size 1m;
      proxy_pass http://full-stack-template-nginx:8080;
      ...
      ...
  }
```

On docker-compose.yaml:

```
  full-stack-template-nginx:
    container_name: full-stack-template-nginx
    build:
      context: ./server
      dockerfile: ${dockerfile}
      target: nginx
    restart: unless-stopped
    volumes:
      - php_socket:/var/run/php
    networks:
      - default
    ports:
      - "8080"
```

On helm.yaml:

```
  server:
    ... no path here ...
    livenessCommand:
      - docker-healthcheck
    sidecar:
        name: nginx
        image: ${taito_container_registry}/nginx:${taito_build_image_tag}
        paths:
        - path: /api
        cpuRequest: 2m
        memoryRequest: 2Mi
        sharedVolume:
        mountPath: /var/run/php
        sidecarMountPath: /var/run/php
```

2. Build both nginx and server image on CI/CD. Example for cloudbuild.yaml:

On project.sh:

```
  taito_containers=" ... nginx server ... "
```

On cloudbuild.yaml:

```
  - id: artifact-prepare-nginx
    waitFor: ["build-prepare"]
    name: "ghcr.io/taitounited/taito-cli:ci-gcp-dev"
    args:
      [
        "artifact-prepare:nginx:$BRANCH_NAME",
        "$COMMIT_SHA",
        "nginx",
        "false",
        "./server",
        "./server",
        "Dockerfile",
      ]
    env:
      - taito_mode=ci
      - taito_ci_phases=${_TAITO_CI_PHASES}

  - id: artifact-prepare-server
    waitFor: ["build-prepare"]
    name: "ghcr.io/taitounited/taito-cli:ci-gcp-dev"
    args: ["artifact-prepare:server:$BRANCH_NAME", "$COMMIT_SHA", "php"]
    env:
      - taito_mode=ci
      - taito_ci_phases=${_TAITO_CI_PHASES}

  ...
  ...

  - id: artifact-release-nginx
    waitFor: ["deployment-verify"]
    name: "ghcr.io/taitounited/taito-cli:ci-gcp-dev"
    args: ["artifact-release:nginx:$BRANCH_NAME", "$COMMIT_SHA"]
    env:
      - taito_mode=ci
      - taito_ci_phases=${_TAITO_CI_PHASES}

  - id: artifact-release-server
    waitFor: ["deployment-verify"]
    name: "ghcr.io/taitounited/taito-cli:ci-gcp-dev"
    args: ["artifact-release:server:$BRANCH_NAME", "$COMMIT_SHA"]
    env:
      - taito_mode=ci
      - taito_ci_phases=${_TAITO_CI_PHASES}

```

3. Configure database migrations for Taito CLI:

On root package.json:

```
    "taito-host-init": "taito -z ${taito_options} init:${taito_env} && npm run taito-host-db-deploy && npm-run-all import-db-data generate",
    "taito-host-init:clean": "taito -z ${taito_options} init:${taito_env} --clean && npm run taito-host-db-deploy && npm-run-all import-db-data clean:storage generate",
    "taito-host-db-deploy": "if [ ${taito_env} = 'local' ]; then docker exec ${taito_project}-server bin/console doctrine:migrations:migrate --no-interaction; else docker-compose -f docker-compose-cicd.yaml run --rm ${taito_project}-server-cicd sh -c 'echo Sleeping... && sleep 30 && echo Done sleeping && bin/console doctrine:migrations:migrate --no-interaction'; fi",
```
