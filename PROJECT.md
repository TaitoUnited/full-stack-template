# Title

Short description: purpose, company, etc.

> NOTE: If project consists of multiple repositories, you don't need to documents these matters in all of them.

## Contacts

* Project Manager: John Doe, Company co.
* Designer: Jane Doe, Company co.

> NOTE: Keep contact details somewhere else.

## Recurring issues and solutions

See trouble.txt or run `taito --trouble`.

## Conventions

Project specific conventions.

## 3rd party services: billing and control

> How billing and control of 3rd party services are distributed between us and the customer.

* ...
* ...

## Security

Done:
* [ ] Documentation of sensitive data
* [ ] Security checklist
* [ ] Data protection checklist
* [ ] Code review with DevOps personnel

> Remember to review these also later in case a newly developed feature handles sensitive data.

### Sensitive data

Sensitive data handled by the implementation:

* ...
* ...

### Security checklist

TODO This is short list of ... See OWASP.

Frontend:

* [ ] **Google Analytics:** You should not send any personally identifiable information to Google Analytics, see [Best practices to avoid sending Personally Identifiable Information](https://support.google.com/analytics/answer/6366371?hl=en).
* TODO...

Backend:

* [ ] **HTTP access logs:** Paths and query parameters of HTTP requests end up in access logs. They should not contain any sensitive information. Use request headers or body instead.
* [ ] **Excessive logging:** You should never log all request headers or body content in production environment, or full user details, as they might contain sensitive information like security tokens or personal details.
* [ ] **SQL injection**: TODO ... You should consider also javascript property names and query parameters names as user input because `{ "DELETE * FROM USERS": "true" }` is valid json.
* [ ] **Global URL path matching bypass**: Some router libraries (e.g. koa-router) do not use exact URL path matching by default. If you implement global URL path matching, there might be ways to call a route with an URL that bypasses that global logic if you are not careful. Even worse, router library path matching logic might change some way once library is upgraded to a newer version.
* [ ] **Global authorization bypass**: There should be authorization in place on route or service level in addition to the global token handling (see `Global URL path matching bypass`).
* [ ] **CORS disable**: TODO ...

### Data protection and privacy checklist

This section provides a checklist for data protection and privacy. Most of these concern personal data (GDPR), but many of them can be applied to any confidential data to keep the data safe. Go through the checklist while designing new features, and leave a comment for each.

* [ ] **Terms of service**: Limitations for user (not a requirement).
* [ ] **Privacy policy:** How user data may be used.
* [ ] **User consent:** You must ask users to consent on the processing of their personal data in a clear and easily accessible form. You must be able to show that the user has consented, provide an easy way to withdraw consent at any time, and also ask consent again if changes have been made to the terms of service or privacy policy. Privacy consent needs to be given by means of a *clear affirmative act* which means that a pre-ticked checkbox doesn't suffice.  (TODO user consent is not required if...?)
* [ ] **Children as users:** TODO
* [ ] **Limited data access:** Grant access to personal data for only those who really need it.
* [ ] **3rd parties:** If you hand over personal data to 3rd parties (e.g. by using 3rd party SaaS services), make sure that they are GDPR compliant, and you have user concent for doing so.
* [ ] **Rights for personal data:** Users have a right to access, correct, and erase all their personal data. A GUI implementation is not a requirement, but it's best that users can access, edit and delete their personal data themselves by using a GUI.
* [ ] **Data portability:** User has a right to receive the personal data concerning them in a structured, commonly used and machine-readable format. You don't need to implement a service for that, but keep this in mind.
* [ ] **Data minimization:** Personal data you collect must be limited to what is necessary, and must be kept only as long as needed.
* [ ] **Data anonymization:** Anonymize data whenever it is possible. For example, retaining user reference is usually unnecessary when collecting history data for analytics.
* [ ] **Data pseudonymization:** Pseudonymize data if it is easily applicable. For example, keep all user identifying data in a separate system and reference the user with a generated user id elsewhere.
* [ ] **Logging:** Keep all sensitive data out of the server logs, as logs often have a wider audience and different retention period than database data. Pseudonymization may help you with this. Review logs and, if it is necessary, consider log filtering either on the application or on the infrastructure level. There are also automatic log filtering tools that can filter some personal details automatically.
* [ ] **Backups:** Data minimization and the right-to-erase-all-personal-data applies also to backups. Do not keep backups of personal data longer than it is really necessary (data should be erased within 30 days of deletion request). If you are required to keep backups of some data for a long period of time, consider pseudonymization and storing data to different databases based on requirements. NOTE: Backups might still be a bit of an open issue. It is not clear if the 30 days limit applies to backups also.
* [ ] **Data breach notification:** Users have a right to receive a notification about a data breach without undue delay, if the data breach is likely to result in a high risk to his rights and freedoms. Keep this in mind when choosing an user management system. NOTE: Supervisory authority need to be informed not later than 72 hours after having become aware of the data breach.
* [ ] **Audit logging:** Consider audit logging and other security mechanisms for detecting and investigating potential misuse and data breaches.

Links:

* [gdpr-info.eu](https://gdpr-info.eu/)

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
