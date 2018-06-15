> NOTE: This article contains a short summary of the most important project details required for long-term maintenance. Provide other documentation like requirements analysis and meeting notes as additional resources (TIP: use [wiki](https://github.com/taitounited/server-template/wiki)).

> NOTE: If project consists of multiple git repositories, you don't have to document these matters in all of them. Choose one repository for documenting the project details and leave a reference here.

# Title

Short description: purpose, company, etc.

Table of contents:

* [Contacts](#contacts)
* [Recurring issues and solutions](#recurring-issues-and-solutions)
* [Conventions](#conventions)
* [3rd party services: billing and control](#3rd-party-services-billing-and-control)
* [Security](#security)
* [Architecture Overview](#architecture-overview)
* [Additional Resources](#additional-resources)

## Contacts

* Project Manager: John Doe, Company co.
* Designer: Jane Doe, Company co.

> NOTE: It is recommended to use a shared address book or CRM for keeping the contact details like email and phone number up-to-date.

## Recurring issues and solutions

See trouble.txt or run `taito --trouble`.

## Conventions

> Project specific conventions.

## 3rd party services: billing and control

> How billing and control of 3rd party services are distributed between us and the customer.

* ...
* ...

## Security

Done:
* [ ] Security checklist
* [ ] Data protection checklist
* [ ] Review with DevOps personnel

> Remember to review these also later in case a newly developed feature handles sensitive data.

### Security checklist

TODO This is short list of ... For more, see OWASP.

Frontend:

* [ ] **Google Analytics:** You should not send any personally identifiable information to Google Analytics, see [Best practices to avoid sending Personally Identifiable Information](https://support.google.com/analytics/answer/6366371?hl=en).
* TODO...

Backend:

* [ ] **HTTP access logs:** Paths and query parameters of HTTP requests end up in access logs. They should not contain any sensitive information. Use request headers or body instead.
* [ ] **Excessive logging:** You should never log all request headers or body content in production environment, or full user details, as they might contain sensitive information like security tokens or personal details.
* [ ] **SQL injection:** TODO ... You should consider also javascript property names and query parameters names as user input because `{ "DELETE * FROM USERS": "true" }` is valid json.
* [ ] **Global URL path matching bypass:** Some router libraries (e.g. koa-router) do not use exact URL path matching by default. If you implement global URL path matching, there might be ways to call a route with an URL that bypasses that global logic if you are not careful. Even worse, router library path matching logic might change some way once library is upgraded to a newer version.
* [ ] **Global authorization bypass:** There should be authorization in place on route or service level in addition to the global token handling (see `Global URL path matching bypass`).
* [ ] **CORS disable:** TODO ...

### Data protection and privacy

This section provides documentation and a checklist for data protection and privacy. Most of the checklist steps concern personal data (GDPR), but many of them can, and should, be applied to any confidential data to keep the data safe.

Glossary:

* **Personally identifiable information (PII):** Data that can be used to uniquely identify a person like name, home address, e-mail address, social-security number, or *anything directly connected to these identifiers such as purchase history*.
* **Special category data (extra-sensitive PII):** For example medical/health information, religion, sexual orientation, or any information on/collected from a minor.
* **Data controller:** The entity that determines the purposes, conditions and means of the processing of personal data. For example, the organization that owns the software system and its data.
* **Data processor:** The entity that processes data on behalf of the Data Controller. For example, the company that hosts the software system and provides tehcnical support.
* **[Data Protection Officer (DPO)](https://eugdprcompliant.com/what-is-a-data-protection-officer/):** Ensures that organisation processes personal data in compliance with data protection rules.

#### Documentation

> TODO: Add documentation here (see checklist)

#### Checklist

> Go through the checklist and leave a comment for each: `COMMENT: ...`.

Based on the following considerations you can determine how vigorously you should apply all the steps in the checklist:

* [ ] Does your system contain extra-sensitive information (special category data)?
* [ ] Does your system contain something that, while not sensitive for purposes of GDPR, would be embarrassing/dangerous to publish?
* [ ] If someone published your database content, how large risk would that be to your business?
* [ ] How large is your database of users?

Checklist:

* [ ] **Documentation:** You should document the following details at least for PII: the data in your system, lifecycles of collected data, all parties that process the data (or who can access it), your basis for collecting the data, data subjects rights and how they can exercise them. Dataflow diagram may be a good tool, if data is processed by multiple parties and systems. See [Documentation](#documentation).
* [ ] **Contracts:** The aforementioned documentation is taken into account in contracts between different parties (e.g. between data controller and data processors).
* [ ] **Privacy policy:** You should provide the aforementioned documentation also for users in the form of privacy policy to provide a necessary level of transparency. Note that the privacy policy must be written in such language that a common joe undestands.
* [ ] **User consent:** You must ask users to consent on the processing of their personal data in a clear and easily accessible form. You must be able to show that the user has consented, provide an easy way to withdraw consent at any time, and also ask consent again if changes have been made to the terms of service or privacy policy. Privacy consent needs to be given by means of a *clear affirmative act* which means that a pre-ticked checkbox doesn't suffice.  (TODO user consent is not required if: The basis for processing of personal data may be a contract, agreement, or transaction.)
* [ ] **User consent and children:** If the user is below the age of 16 years, the consent must given or authorised by the holder of parental responsibility over the child. NOTE: The age limit is 13 years in some countries (e.g Finland, UK and Ireland).
* [ ] **Terms of service:** It is convenient to ask consent for both the terms of service and privacy policy at the same time. This is ok, but both should be presented for user as separate documents to read. Terms of service is optional and it is not related to GDPR.
* [ ] **Data tagging:** You may need to tag data based on user consent. For example, has the user accepted data usage for marketing purpose.
* [ ] **Limited data access:** Grant access to personal data for only those who really need it. In most cases, a developer should not be a data processor, thus, a developer should not have access to any PII.
* [ ] **3rd parties:** If you hand over personal data to 3rd parties (e.g. by using 3rd party SaaS services), make sure that they are GDPR compliant, and you have user concent for doing so. You can, however, hand over data also to non-compliant parties if it is necessary for the process itself, and you have explicit user consent for doing so (for example, making hotel reservations). NOTE: Google Analytics [forbids](https://support.google.com/analytics/answer/6366371?hl=en) storing any personal data.
* [ ] **Rights for personal data:** Users have a right to access, correct, and erase all their personal data. A GUI implementation is not a requirement, but it's best that users can access, edit and delete their personal data themselves by using a GUI. This is not only more convenient, but in most cases also more secure, as it is hard to identify users reliably during human interaction. NOTE: You need to respond to the request of user within 30 days, and you may also refuse the request if you have a legitimate reason for doing so.
* [ ] **Data portability:** User has a right to receive the personal data concerning them in a structured, commonly used and machine-readable format. You don't need to implement a service for that, but keep this in mind.
* [ ] **Data minimization:** Personal data you collect must be limited to what is necessary, and must be kept only as long as needed. You should also consider automatic archival/erasure mechanims that anonymize or delete old PII data automatically, once it is no longer needed.
* [ ] **Data anonymization:** Anonymize data whenever it is possible. For example, retaining user reference is usually unnecessary when collecting history data for analytics. Note that anonymization is not a trivial task to do correctly as some users may still be identifiable from rare combinations of data.
* [ ] **Data pseudonymization:** You can limit PII access also by using pseudonymization. For example, keep all user identifying data in a separate system and reference the user with a generated user id elsewhere. However, just like anonymization, pseudonymization is not a trivial task to implement correctly.
* [ ] **Logging:** Keep all PII data out of the server logs, as logs often have a wider audience and different retention period than database data. Pseudonymization may help you with this. Review logs and, if it is necessary, consider log filtering either on the application or on the infrastructure level. There are also automatic log filtering tools that can filter some personal details automatically. NOTE: Beware query parameters as they end up in access logs.
* [ ] **Backups:** At this point you can assume that data need not be deleted from backups on user request, if the backup retention period is reasonable (e.g. 30 days). If you are required to keep backups of some data for a long period of time, consider pseudonymization and storing data to different databases based on requirements. NOTE: Be careful when restoring data from backups! You should not restore data that a user has previously deleted.
* [ ] **Data breach notification:** Users have a right to receive a notification about a data breach without undue delay, if the data breach is likely to result in a high risk to his rights and freedoms. Keep this in mind when choosing audit logging and an user management mechanisms. NOTE: Supervisory authority need to be informed not later than 72 hours after having become aware of the data breach.
* **Audit logging and reporting:** You should leave a clear audit trail when someone accesses another users PII. Otherwise you don't have enough data for notifying the supervisory authority, and the users in question. Therefore you'll have to assume that all PII of all users has been compromised.
  * [ ] **On application level:** For example, log these operations to a separate audit log table that can't be modified by users. Consider also ready-made audit mechanisms provided by databases and other tools. A GUI implementation is not necessary for viewing the entries. Note that audit log entries are also PII, but you have a valid excuse to refuse any modification/deletion requests on user's behalf.
  * [ ] **On infrastructure level:** This is not a trivial task, as it may be hard to prevent system administrators from accessing database with application credentials without leaving a clear audit trail that cannot be altered. However, most major gloud providers have very good audit logging mechanims that suffice, if used correctly.
* [ ] **Basic security mechanisms:** Take care of the basics like authentication, authorization, encrypting data on transit, firewall rules and keeping software up-to-date.
* [ ] **Additional security mechanisms:** Of course, you may use additional security mechanisms like automatic intrusion detection mechanims, encrypting all data at rest, etc. But in most cases these are not absolutely necessary.

NOTE: There are some country based exceptions for the rules. For example in Finland, the aforementioned age limit is 13 years. There are also some exceptions made in Finland that guarantee freedom of speech and some specific cases of data processing that strive for common good.

Links:

* [gdpr-info.eu](https://gdpr-info.eu/)
* [glossary-of-terms](https://www.eugdpr.org/glossary-of-terms.html)
* [gdpr-for-software-devs](https://www.infoq.com/articles/gdpr-for-software-devs)

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
