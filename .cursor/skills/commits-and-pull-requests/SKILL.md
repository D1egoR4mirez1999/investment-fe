---
name: commits-and-pull-requests
description: >-
  Acts as this repository's Git assistant for feature and fix branches, small
  independent commits, and GitHub pull requests. Use when the user asks for
  commits, a commit plan, branches, pull requests, merge requests, gh, glab,
  or this repository's Git conventions.
---

# Commits and pull requests

Act as the Git assistant for this repository. Aim for a correct `feat` or `fix` branch, small independent commits that each tell one story, and a pull request aligned with the team.

This repository is on GitHub. Create pull requests with `gh pr create`.

## Protected branch

`master` is protected. Do not commit or push on it. If the current branch is `master`, create `<type>/<short-description>` from `master` and switch to it before any commit.

## Branches

Use `<type>/<short-description>`.

- `type` is lowercase and one of: `feat`, `fix`, `refact`, `chore`, `docs`, `test`, `perf`.
- The description is kebab-case.

If the user did not give a type or a description, ask and suggest a name that matches the change. Do not invent the branch name.

The default pull request destination is `master`. Ask for a different destination only for a hotfix. Do not invent that branch.

## History

Merges keep the branch commits. Do not squash. Do not rewrite history (`rebase`, `push --force`) unless the user explicitly asks.

## Commits

Each commit is one reviewable unit. Together they narrate the pull request. Do not mix topics.

Message format:

```text
type(scope): description
```

- `type`: `feat`, `fix`, `refact`, `chore`, `docs`, `test`, `perf`, `build`, `ci`
- `scope`: optional but preferred; the area affected
- `description`: imperative, present tense, starts with a lowercase letter, no final period, in English

```text
feat(design): add custom code panel in page options
fix(preview): update payload type for broadcast channel messages
```

Before proposing commits, read `git status` and the diff. Omit paths ignored by this repository's `.gitignore` unless the user explicitly asks to include them. Do not add exclusions from another repository. Current ignored patterns:

- `/dist`, `/tmp`, `/out-tsc`, `/bazel-out`
- `/node_modules`, `npm-debug.log`, `yarn-error.log`
- `.idea/`, `.project`, `.classpath`, `.c9/`, `*.launch`, `.settings/`, `*.sublime-workspace`
- `.vscode/*` except `.vscode/settings.json`, `.vscode/tasks.json`, `.vscode/launch.json`, `.vscode/extensions.json`, `.vscode/mcp.json`
- `.history/*`
- `/.angular/cache`, `.sass-cache/`, `/connect.lock`, `/coverage`, `/libpeerconnection.log`, `testem.log`, `/typings`, `__screenshots__/`
- `.DS_Store`, `Thumbs.db`

If the change mixes topics (a dependency, a feature, and an unrelated fix), propose several commits. For each one give the exact message and which paths or hunks to stage. Use `git add -p` when it separates hunks. Keep unrelated work out of the same commit, unless splitting it would leave the build broken.

## Pull request

Title, same style, summarizing the whole outcome:

```text
type(scope): short description of the outcome
```

Write the description in English, even when the conversation is in another language. Use clear prose for review and QA: what problem it solves or what capability it adds, and decisions or touchpoints only when they matter. Do not list every file or every line.

This repository does not use a business ticket. Do not add a ticket section, and do not ask for or invent a ticket name or URL.

Create a draft pull request only when the user says there is an external dependency or another reason to start in draft. Otherwise create it as a normal pull request.

Before push or `gh pr create`, check `gh` auth and that the remote and the destination branch match what was agreed. If auth fails, ask the user to log in and do not create the pull request. If the remote is missing, ask. Do not invent a remote URL.

## Confirmation before `gh pr create`

Show this checklist, then ask if it is correct. Run the command only after an explicit yes.

- Current branch (it must not be `master`)
- Subjects of the commits that will be included
- Destination branch
- Draft: yes or no
- Title and description

If the purpose of the change is missing, or the destination is not the default (`master`) because this is a hotfix, ask. Do not invent those values.

## Order

1. Detect the current branch. If it is `master`, create `<type>/<short-description>` from `master` and switch to it.
2. Align type and scope with the user.
3. Propose a numbered commit plan, omitting ignored files.
4. Push only the working branch. Never push `master`.
5. Present the title, the description, the destination branch, and draft yes or no. Ask for confirmation. Then create the pull request.

## What to deliver

When helping, deliver in this order:

1. Suggested commands (`git checkout -b`, `git add`, `git commit -m`)
2. The title on one line
3. The description in Markdown, ready for the CLI or the UI
