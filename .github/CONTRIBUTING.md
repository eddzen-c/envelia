# Contributing to Envelia Studio

Thank you for your interest in improving Envelia Studio.

This document defines the technical, quality, security, and review requirements for contributions to this repository.

## Contribution model

Envelia Studio is proprietary software currently maintained exclusively by the repository owner.

Community participation during pre-release is limited to bug reports and feature suggestions submitted through the configured GitHub issue forms.

External code, documentation, designs, visual assets, patches, and other implementation materials are not accepted. Do not begin implementation work or submit a pull request unless this policy is changed and the repository owner provides prior written authorization.

## Before contributing

Before opening an issue:

1. Search existing issues to avoid duplicate reports or suggestions.
2. Use the appropriate issue form for bugs or feature requests.
3. Provide enough reproducible and non-sensitive information for evaluation.
4. Do not attach source code, patches, designs, credentials, personal data, or confidential materials.
5. Never disclose a security vulnerability through a public issue.

Report security vulnerabilities through [GitHub private vulnerability reporting](https://github.com/eddzen-c/envelia/security/advisories/new).

Opening an issue does not authorize implementation work or the submission of a pull request.

## Development requirements

The repository requires:

- Node.js 24.
- pnpm 11.24 or a compatible version allowed by `package.json`.
- Git.
- A development environment capable of running the workspace applications.

Confirm the installed versions:

```
node --version
pnpm --version
git --version
```

## Local setup

Clone and prepare the repository:

```
git clone https://github.com/eddzen-c/envelia.git
cd envelia
pnpm install
```

Start the development tasks:

```
pnpm run dev
```

Do not commit generated output, dependency directories, environment files, credentials, private keys, or local development artifacts.

## Branch workflow

Create every change from an updated `main` branch:

```
git switch main
git pull --ff-only origin main
git switch --create type/short-description
```

Use one of these branch prefixes:

- `feat/` for product functionality.
- `fix/` for defect corrections.
- `docs/` for documentation.
- `refactor/` for internal restructuring without behavior changes.
- `test/` for automated test changes.
- `chore/` for maintenance and repository configuration.

Keep each branch focused on one clearly defined concern.

Do not commit directly to `main`.

## Code standards

Contributions must:

- Follow the existing architecture and naming conventions.
- Preserve strict TypeScript checks.
- Maintain accessibility and responsive behavior.
- Avoid unrelated formatting or refactoring.
- Include tests when behavior changes.
- Avoid duplicated logic and unnecessary abstractions.
- Document new configuration and environment variables.
- Avoid exposing secrets, personal data, or internal information.

## Quality checks

Run the mandatory checks before creating a pull request:

```
pnpm run format:check
pnpm run lint
pnpm run type-check
```

Run additional checks when applicable:

```
pnpm run test
pnpm run test:e2e
pnpm run build
```

The Husky pre-commit hook automatically executes formatting, lint, and type validation. A successful local hook does not replace the required GitHub Actions checks.

## Dependencies

New dependencies must be necessary, actively maintained, license-compatible, and appropriate for the affected workspace.

When adding or updating a dependency:

- Explain why the existing platform cannot satisfy the requirement.
- Use an explicit version compatible with the repository policy.
- Commit the resulting `pnpm-lock.yaml` change.
- Review security, maintenance, and bundle-size implications.
- Avoid adding overlapping libraries for the same responsibility.

## Commit messages

Commit messages must follow Conventional Commits:

```
type(scope): concise description
```

Examples:

```
feat(web): add invitation preview
fix(web): prevent horizontal overflow
docs: add contribution guidelines
chore(ci): update quality workflow
```

Use imperative, concise subjects. Explain motivation, relevant decisions, and consequences in the body when the subject is insufficient.

The `commit-msg` hook validates commit messages with Commitlint.

## Pull requests

External pull requests are not accepted during pre-release. Unsolicited pull requests may be closed without review, and their contents will not be copied or integrated into the project.

Pull requests created by the repository owner must:

- Use the repository pull request template.
- Describe the motivation and principal changes.
- Remain focused and reviewable.
- Reference related issues when applicable.
- Include validation evidence.
- Include screenshots or recordings for visual changes.
- Document risks, compatibility concerns, and rollback steps.
- Pass all required GitHub Actions checks.
- Resolve review conversations before merge.

Repository-owner pull requests are integrated through squash merge. The final squash commit must follow Conventional Commits.

## Generated and assisted code

Code produced with automated or AI-assisted tools must be reviewed, understood, tested, and accepted by the contributor submitting it.

Do not submit generated code that:

- The contributor cannot explain or maintain.
- Introduces unverifiable behavior.
- Copies material without a compatible license.
- Contains fabricated APIs, dependencies, tests, or evidence.
- Exposes source material, credentials, or private information.

The contributor remains responsible for the complete change regardless of the tools used to create it.

## Security and privacy

Never include:

- Real credentials or access tokens.
- Production secrets.
- Personal or customer data.
- Private invitation information.
- Unauthorized third-party source code or assets.

Follow the repository security policy for responsible testing and private disclosure.

## Contribution terms

This repository does not currently publish an open-source license. Public access to the source code does not grant permission to copy, redistribute, sublicense, modify, deploy, commercialize, or reuse it.

Bug reports and feature suggestions may be evaluated, modified, implemented, or declined without compensation or an obligation to act. They must not contain third-party proprietary material, confidential information, personal data, source code, patches, designs, or other copyrightable implementation content.

External implementation contributions are not accepted during pre-release. Any future exception requires a separate written agreement executed before the contribution is submitted or integrated. That agreement must address ownership, intellectual property rights, permitted use, confidentiality, attribution, compensation, and other applicable terms.

A pull request, issue, comment, checkbox, email, or other submission does not by itself constitute written authorization, acceptance, or a transfer of ownership.

## Review and acceptance

Submission does not guarantee acceptance.

The maintainer may request changes or reject a contribution because of product direction, architecture, security, maintainability, scope, legal concerns, or insufficient validation.
