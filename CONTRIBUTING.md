# Contributing to rifteo-skills

## Adding a new agent

Edit `lib/agents.js` and add an entry to the `AGENTS` object:

```js
'my-agent': {
  project: '.my-agent/skills',
  global: path.join(HOME, '.my-agent', 'skills')
}
```

Then update the supported agents table in `README.md`.

## Adding a new skill

Skills live in the [skills](https://github.com/rifteo/skills) repo, not here.
Open a PR there — a GitHub Actions workflow auto-updates the discovery index on merge.

## Running locally

```bash
git clone https://github.com/rifteo/skills-cli
cd skills-cli
npm link
rifteo-skills help
```

## Publishing to npm

Releases are tagged and published via the `publish` GitHub Actions workflow.
Create a release tag to trigger it:

```bash
git tag v1.0.1
git push origin v1.0.1
```
