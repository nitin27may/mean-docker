# Contributing to MEAN Stack with Docker

Thank you for considering contributing to this project! Here's how you can help.

## Ways to Contribute

- Reporting bugs
- Suggesting features
- Submitting pull requests
- Improving documentation

## Reporting Issues

When reporting issues, please use the issue templates provided. This ensures we have all the necessary information to address your concerns efficiently.

For bugs, please include:
- A clear description of the bug
- Steps to reproduce the issue
- Expected behavior
- Screenshots (if applicable)
- Environment details (OS, browser, versions)

For feature requests, please include:
- A clear description of the feature
- The motivation behind the request
- Any potential implementation details you have in mind

## Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development Setup

Please refer to our [Local Development Guide](docs/local-development.md) for details on setting up your development environment.

## Code Style

- For TypeScript/JavaScript code, we follow the ESLint configuration in the project
- For Angular code, follow the Angular style guide
- Keep code clean, well-commented, and tested

## Questions?

If you have any questions, feel free to open an issue with the "question" label.
## Working With AI Coding Agents

This repository carries `CLAUDE.md` and a `.claude/` folder so an agent pointed
at a fresh clone is productive without being told the layout. None of it is
required to contribute.

### Repository slash commands

| Command | What it does |
|---|---|
| `/verify` | The full definition of done: lint, build and test both workspaces, build the images, bring the stack up and exercise it |
| `/bump-deps` | The semi-annual dependency pass, including the version strings that drift |
| `/audit` | Re-runs the mechanical checks from the 2026 audit |

### Project MCP servers

`.mcp.json` declares two optional servers. Claude Code prompts before starting
either, and declining costs you nothing:

- **chrome-devtools** — drives the running app at `http://localhost`. Worth
  having: the app is zoneless, and the failure mode there is a UI that silently
  stops updating, which no unit test catches.
- **mongodb** — inspects the seeded `contact_db` directly. Its connection
  string is expanded from your local `.env`; no credentials are in the file,
  and none should ever be added to it.

### Recommended plugins

These install into your own Claude Code, not into this repository:

```
/plugin marketplace add anthropics/claude-code
/plugin install security-guidance
/plugin install pr-review-toolkit
```

`security-guidance` is the one that maps most directly onto how this repo has
failed before — secret logging, a hardcoded JWT fallback, tokens in query
strings.

### Ground rules

- Never put a secret in `.claude/settings.json`, `.mcp.json` or any committed
  file. Use `.env`, which is gitignored.
- Run `/verify` before opening a PR, or at minimum `./scripts/setup.sh --reset`
  plus lint/build/test in both workspaces. "The code is written" is not "it works".
- CI minutes on this repository are limited. Verify locally rather than pushing
  to see what happens.
