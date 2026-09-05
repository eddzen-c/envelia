# Envelia Studio Support

## Project status

Envelia Studio is currently in pre-release development. Features, interfaces, data structures, and support procedures may change before general availability.

The project does not currently provide guaranteed availability, emergency response, or 24/7 support.

## Choose the correct channel

Use the channel that matches the request:

| Request                                     | Channel                                                                                        | Visibility |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------- |
| Reproducible software defect                | [Bug report](https://github.com/eddzen-c/envelia/issues/new?template=bug-report.yml)           | Public     |
| Product improvement or new capability       | [Feature request](https://github.com/eddzen-c/envelia/issues/new?template=feature-request.yml) | Public     |
| General support or private product question | [support.enveliastudio@gmail.com](mailto:support.enveliastudio@gmail.com)                      | Private    |
| Security vulnerability                      | [Private vulnerability reporting](https://github.com/eddzen-c/envelia/security/advisories/new) | Private    |
| Code of Conduct concern                     | [serviciosdevsolution@gmail.com](mailto:serviciosdevsolution@gmail.com)                        | Private    |

Do not use public issues for account-specific questions, personal information, private invitation data, credentials, billing matters, security vulnerabilities, or conduct reports.

## General support requests

Use the private support mailbox listed above for questions that cannot be handled safely through a public issue.

Use the subject format `[Support] Brief description`.

A support request should clearly identify the assistance needed without including unnecessary confidential information.

## Before requesting support

Before opening an issue or contacting support:

1. Review the repository [README](../README.md).
2. Review the [contribution guidelines](./CONTRIBUTING.md).
3. Search existing issues and pull requests.
4. Confirm that the request concerns the latest code available on `main`.
5. Collect the minimum information needed to explain or reproduce the problem.
6. Remove credentials, personal data, invitation details, and unrelated logs.

## Information to include

When applicable, provide:

- A concise description of the problem or question.
- The affected component, route, package, or workflow.
- The expected and actual behavior.
- Reproduction steps.
- Browser, operating system, device, and relevant versions.
- Sanitized logs or screenshots.
- The commit, branch, or deployed version being used.
- Any workaround already attempted.
- The practical impact and urgency.

Never fabricate evidence, urgency, customer impact, or production status.

## Sensitive and private information

Envelia Studio support will never request a password, complete access token, authentication code, recovery code, private key, or unnecessary personal information.

Before sending evidence:

- Redact secrets and authentication material.
- Remove unrelated personal or customer data.
- Use synthetic examples whenever possible.
- Limit invitation details to the minimum necessary.
- Confirm that you are authorized to share every attachment.

If sensitive information is sent accidentally, notify support immediately and rotate any exposed credential.

## Response expectations

The maintainer will aim to acknowledge a properly submitted support request within three business days and provide an initial assessment within seven business days.

These targets are operational goals and not a service-level agreement.

Complexity, incomplete information, project capacity, holidays, third-party dependencies, and the pre-release status may affect response and resolution times.

Requests are prioritized according to security, data exposure, number of affected users, severity, reproducibility, availability of a workaround, and alignment with the product roadmap.

## Support scope and limitations

Support is primarily provided for:

- The latest code available on `main`.
- Official repository configuration.
- Reproducible behavior in supported environments.
- Documented development and contribution workflows.
- Product behavior maintained directly by Envelia Studio.

Support may be limited or declined for:

- Unsupported forks or substantially modified deployments.
- Outdated commits or dependencies.
- Third-party services outside the project's control.
- Requests without sufficient information.
- Unapproved integrations or configurations.
- General programming instruction unrelated to Envelia Studio.
- Commercial commitments that have not been agreed to in writing.

Support does not guarantee that every request will result in a code change, feature, workaround, or specific resolution time.

## Languages

Support requests may be submitted in English or Spanish.

Technical identifiers, logs, commands, and error messages should remain in their original form when translation could alter their meaning.

## Security incidents

Do not send vulnerability details to the general support mailbox or publish them in an issue.

Use [GitHub private vulnerability reporting](https://github.com/eddzen-c/envelia/security/advisories/new) and follow the repository security policy.

## Conduct reports

Do not use the general support mailbox for harassment, abuse, retaliation, or other Code of Conduct concerns.

Use the private moderation mailbox listed above and follow the repository Code of Conduct.

## Abuse and spam

Spam, phishing, harassment, malicious attachments, repeated off-topic requests, and attempts to misuse support channels may be ignored, filtered, blocked, or escalated.

Abuse of a support channel may also result in repository or platform restrictions.

## Changes to this policy

Support channels, scope, and response targets may evolve as Envelia Studio approaches general availability.

The version of this policy available on the default branch is authoritative.
