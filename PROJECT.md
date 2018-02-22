# TODO name

TODO Short description: purpose, company, etc

## Recurring Issues and Solutions

See trouble.txt or run `taito --trouble`.

## Contacts

> NOTE: Contacts are used from package.json. Do not modify the headers of the development and maintenance chapters, and do not add any extra content in the chapters either.

### Development

* Project Manager: TODO John Doe, john.doe@domain.com, 050 1234 567
* Designer: TODO Jane Doe, jane.doe@domain.com, 050 1234 567

### Maintenance

* Project Manager: TODO John Doe, john.doe@domain.com, 050 1234 567

## Personal data and privacy (GDPR)

### Terms of use and user agreement

TODO ... user agreement on single sign on ...

### Pseudonymization and anonymization whenever possible

TODO ...

### Data deletion or anonymization on user request

TODO ...

## Conventions

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

## Additional Resources

> NOTE: Links to additional resources e.g. project documentation, specifications.
