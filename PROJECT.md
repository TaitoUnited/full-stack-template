# TODO name

TODO Short description...

## Conventions

TODO

## Environments

Production:

* Site: https://server-template-prod.taitodev.com
* TODO Request an user account from...

Staging:

* Site: https://server-template-staging.taitodev.com
* TODO Request an user account from...

Development:

* Site: https://server-template-dev.taitodev.com
* User accounts: Run `taito users:dev`.

## Contacts

> NOTE: Contacts are used in package.json. Do not modify the headers of the development and maintenance chapters, and do not add any extra content in the chapters either.

### Development

* Project Manager: TODO John Doe, john.doe@domain.com, 050 1234 567
* Designer: TODO Jane Doe, jane.doe@domain.com, 050 1234 567

### Maintenance

* Project Manager: TODO John Doe, john.doe@domain.com, 050 1234 567

### Recurring Issues and Solutions

See trouble.txt.

## Architecture Overview

> TIP: You can use [Gravizo](www.gravizo.com) for making a architecture diagram if the diagram does not contain any confidential information. Note that architecture diagram is not mandatory if the architecture is very simple.

TODO

### Containers

* Client: UI logic implemented with React / Redux
* Server: API implemented with node.js
* Cache: Redis as in-memory cache shared between server instances
* Database: Postgres relational database
* Bucket: S3 compatible storage

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

The following jobs are triggered using systemd on server:
* ...

## Additional Resources

> NOTE: Links to additional resources e.g. project documentation, specifications.
