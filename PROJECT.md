# TODO name

TODO Short description...

## Conventions

### Directory hierarchy

The app is divided in loosely coupled features that communicate through a directory named `common`. The `common` directory provides a common contract and state for them, and also some shared utils. In the following example the user, search and report features communicate through common. And root directory binds all features together to a full blown app.

    /common             # common logic shared by all the features of the app
    /user               # user features
    /search             # search features
    /report             # report features
    ...bind app together...

Similarly a large feature set may be split into multiple subfeatures. In the following example the search directory contains multiple subfeatures (search/basic, search/advanced and search/results) that communicate with each other through search/common. The root of the search directory binds the subfeatures together to a full blown search.

    /search
      /common           # common logic shared by basic, advanced and results
      /basic            # basic search subfeature
      /advanced         # advanced search subfeature
      /results          # search results subfeature
      ...bind search together...

Tips:
* The root directory of an app or a feature initializes it by binding all features or subfeatures together. Thus root directory may refer to any subdirectories, but subdirectories should not refer back to root, because that would be an ugly circular dependency.
* Keep all `common` directories as small as possible. Each feature or subfeature contains its own private set of actions, state, services and utils. A `common` directory contains only such logic that is actually being used in multiple features.
* Especially in GUI implementation it's often best to try to avoid direct dependencies between parallel features by communicating through a `common` directory by using events. This way contracts remain clear and you avoid running into a tightly coupled circular dependency mess. The `always communicate through common` approach might not work that well in the backend, because backend implementation usually consist of direct method calls instead of indirect events.

See [General Software Design](https://github.com/TaitoUnited/taito/wiki/General-Software-Design) article for more information on how to structure your app.

## Environments

Production:

* Site: https://server-template-prod.gopen1.taitodev.com
* TODO Request an user account from...

Staging:

* Site: https://server-template-staging.gopen1.taitodev.com
* TODO Request an user account from...

Development:

* Site: https://server-template-dev.gopen1.taitodev.com
* User accounts: TODO

Basic authentication is enabled on non-production environments by default. The username is #username and the password is #password.

It's common that idle applications are run down to save resources on non-production environments . If your application seems to be down, you can (re)start it by running `taito restart:ENV`, or by pushing some changes to git.

# Contacts

> NOTE: Contacts are used in package.json. Do not modify the headers of the development and maintenance chapters, and do not add any extra content in the chapters either.

## Development

* Project Manager: John Doe, john.doe@domain.com, 050 1234 567
* Designer: Jane Doe, jane.doe@domain.com, 050 1234 567

## Maintenance

* Project Manager: John Doe, john.doe@domain.com, 050 1234 567

## Recurring Issues and Solutions

See trouble.txt.

## Architecture Overview

> TIP: You can use [Gravizo](www.gravizo.com) for making a architecture diagram if the diagram does not contain any confidential information. Note that architecture diagram is not mandatory if the architecture is very simple.

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
