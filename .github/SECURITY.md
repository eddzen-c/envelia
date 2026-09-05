# Security Policy

## Supported versions

Envelia Studio is currently in pre-release development. Security fixes are applied only to the latest code available on `main`.

| Version                            | Supported |
| ---------------------------------- | --------- |
| Latest `main`                      | Yes       |
| Older commits, branches, and forks | No        |

## Reporting a vulnerability

Do not report security vulnerabilities through public GitHub issues, discussions, pull requests, or other public channels.

Use [GitHub private vulnerability reporting](https://github.com/eddzen-c/envelia/security/advisories/new) to submit the report securely.

Include as much of the following information as possible:

- The affected component, route, package, or commit.
- The security impact and realistic attack scenario.
- Clear reproduction steps or a minimal proof of concept.
- Any prerequisites or required permissions.
- A suggested mitigation, when available.

Do not include real credentials, personal data, production secrets, or information belonging to third parties.

## Response process

We aim to acknowledge a report within five business days and provide an initial assessment within ten business days.

We may request additional information while reproducing and evaluating the issue. Resolution and disclosure timelines depend on severity, complexity, and affected dependencies.

## Responsible testing

When investigating a potential vulnerability:

- Test only accounts, systems, and data you own or are authorized to use.
- Avoid privacy violations, service disruption, and destructive actions.
- Stop testing and report immediately if personal or confidential data is exposed.
- Do not perform denial-of-service, social engineering, or physical attacks.

## Examples of in-scope reports

- Authentication or authorization bypasses.
- Cross-account or cross-tenant data access.
- Injection, cross-site scripting, or server-side request forgery.
- Exposure of credentials, secrets, or personal data.
- Unsafe file handling or code execution.
- Other reproducible vulnerabilities with concrete security impact.

## Examples of out-of-scope reports

- Unverified automated scanner output.
- Missing best practices without a demonstrable security impact.
- Self-XSS that cannot affect another user.
- Social engineering, physical attacks, or denial-of-service testing.
- Vulnerabilities affecting unsupported third-party services outside our control.

## Coordinated disclosure

Keep vulnerability details private until remediation is available or a disclosure plan has been agreed upon through the security advisory.
