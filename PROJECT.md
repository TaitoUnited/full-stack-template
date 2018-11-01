# Title

Short description: purpose, company, etc.

Table of contents:

* [Contacts](#contacts)
* [Responsibilities](#responsibilities)
* [Recurring issues and solutions](#recurring-issues-and-solutions)
* [Conventions](#conventions)
* [Architecture Overview](#architecture-overview)
* [Security](#security)
* [Additional Resources](#additional-resources)

## Contacts

* Project Manager: John Doe, Company co.
* Designer: Jane Doe, Company co.

> NOTE: It is recommended to use a shared address book or CRM for keeping the contact details like email and phone number up-to-date.

## Responsibilities

> How billing and control is distributed between us and the customer.

* ...
* ...

## Recurring issues and solutions

See trouble.txt or run `taito --trouble`.

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

> NOTE: Only non-trivial processes need to be described here (e.g. scheduled batch processing), though it might be a good idea to describe one or two basic scenarios also.

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

Done:
* [ ] Security checklist
* [ ] Data protection checklist
* [ ] Security review

## Additional Resources

> NOTE: Links to additional resources.
