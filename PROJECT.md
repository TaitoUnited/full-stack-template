# Title

Short description: purpose, company, etc.

## Contacts

* Project Manager: John Doe, Company co.
* Designer: Jane Doe, Company co.

> NOTE: Keep contact details somewhere else.

## Recurring issues and solutions

See trouble.txt or run `taito --trouble`.

## Conventions

Project specific conventions.

## Data protection and privacy

This section provides a checklist for data protection and privacy. Most of these concern personal data (GDPR), but many of them can be applied to any confidential data to keep the data safe. Go through the checklist while designing new features, and leave a comment for each.

* [ ] **Terms of service**: (Limitations for user).
* [ ] **Privacy policy:** A privacy policy must be in place (how user data may be is used).
* [ ] **User consent:** You must ask users to consent on the processing of their personal data in a clear and easily accessible form. Privacy consent needs to be given by means of a *clear affirmative act* which means that a pre-ticked checkbox doesn't suffice. You must also be able to show that the user has consented, and provide an easy way to withdraw consent at any time. (TODO user consent is not required if...?)
* [ ] **Children as users:** TODO
* [ ] **Limited data access:** Grant access to personal data for only those who really need it.
* [ ] **3rd parties:** If you hand over personal data to 3rd parties (e.g. by using 3rd party SaaS services), make sure that they are GDPR compliant, and you have user concent for doing so.
* [ ] **Rights for personal data:** Users have a right to access, correct, and erase all their personal data. A GUI implementation is not a requirement, but it's best that users can access, edit and delete their personal data themselves by using a GUI.
* [ ] **Data portability:** User has a right to receive the personal data concerning them in a structured, commonly used and machine-readable format. You don't need to implement a service for that, but keep this in mind.
* [ ] **Data minimization:** Personal data you collect must be limited to what is necessary, and must be kept only as long as needed.
* [ ] **Data anonymization:** Anonymize data whenever it is possible. For example, retaining user reference is usually unnecessary when collecting history data for analytics.
* [ ] **Data pseudonymization:** Pseudonymize data whenever it is possible. For example, keep all user identifying data in a separate system and reference the user with a generated user id.
* [ ] **Logging:** Keep all sensitive data out of the server logs. Pseudonymization may help you with this. Consider also log filtering either on the application or on the infrastructure level.
* [ ] **Backups:** Data minimization and the right-to-erase-all-personal-data applies also to backups. Do not keep backups of personal data longer than it is really necessary. If you are required to keep backups from a long period of time, consider pseudonymization and storing data to different databases based on requirements.
* [ ] **Data breach notification:** Users have a right to receive a notification about a data breach. Keep this in mind when choosing an user management system.
* [ ] **Audit logging:** Consider audit logging and other security mechanisms for detecting and investigating potential misuse and data breaches.

Specific cases:

* [ ] **HTTP access logs:** Paths and query parameters of HTTP requests end up in access logs. They should not contain any sensitive information.
* [ ] **Google Analytics:** You should not send any personally identifiable information to Google Analytics, see [Best practices to avoid sending Personally Identifiable Information](https://support.google.com/analytics/answer/6366371?hl=en).

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

> NOTE: Links to additional resources.
