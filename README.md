[//]: # (TEMPLATE NOTE START)
# server-template

Server-template is a project template for applications and APIs running on server. The server-template is based on running containers on docker-compose or Kubernetes, but in the future it will also provide support for running functions on top of popular FaaS platforms. Thus, you can deploy the same implementation almost anywhere, and you can operate it with the same *taito-cli* commands regardless of the underlying platform.

The template comes with an example implementation that is based on React, Node.js, Postgres and S3, but you can easily replace them with other technologies (see [server-template-alt](https://github.com/TaitoUnited/server-template-alt)).

You can create a new project from this template by running `taito project create: server-template`. Later you can upgrade your project to the latest version of the template by running `taito project upgrade`. To ensure flawless upgrade, do not modify files that have a **do-not-modify** note in them as they are designed to be reusable and easily configurable for various needs. In such case, improve the original files of the template instead, and then upgrade.

You can also migrate an existing non-taito-cli project by running `taito project migrate: server-template` in your project root folder. If, however, you are not going to use docker containers or functions on your production environment, see the [legacy-server-template](https://github.com/TaitoUnited/legacy-server-template) instead.

[//]: # (TEMPLATE NOTE END)

> See the [DEVELOPMENT.md](DEVELOPMENT.md) for development instructions.

# Title

Short description: purpose, company, etc.

Table of contents:

* [Links](#links)
* [Contacts](#contacts)
* [Responsibilities](#responsibilities)
* [Recurring issues and solutions](#recurring-issues-and-solutions)
* [Notes](#notes)
* [Conventions](#conventions)
* [Architecture Overview](#architecture-overview)
* [Security](#security)

## Links

Non-production basic auth credentials: TODO

[//]: # (GENERATED LINKS START)

LINKS WILL BE GENERATED HERE

[//]: # (GENERATED LINKS END)

> You can update this section by configuring links in `taito-config.sh` and running `taito project docs`.

## Contacts

* Project Manager: John Doe, Company co.
* Designer: Jane Doe, Company co.

> NOTE: It is recommended to use a shared address book or CRM for keeping the contact details like email and phone number up-to-date.

## Responsibilities

> Billing and control of 3rd party services, etc.

## Recurring issues and solutions

See trouble.txt or run `taito --trouble`.

## Notes

> Misc notes

## Conventions

> Project specific conventions.

## Architecture Overview

> TIP: You can use [Gravizo](www.gravizo.com) for making a architecture diagram if the diagram does not contain any confidential information. Note that architecture diagram is not mandatory if the architecture is very simple.

TODO

### Integrations

* Client uses Google Maps
* Server uses system X for authorization (OAUTH)
* Server fetches products from system Y (REST/json)
* Server sends email using Sendgrid (REST/json)

### Processes

> NOTE: Only non-trivial processes need to be described here (e.g. scheduled batch processing), though it might be a good idea to describe one or two basic scenarios also. Architecture is the main focus here. User stories should be documented elsewhere (e.g. wiki).

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

> Document security and GDPR related things here (See [template wiki](https://github.com/TaitoUnited/SERVER-TEMPLATE/wiki/Security)). Remember to review these also later in case some newly developed features handle sensitive data.
