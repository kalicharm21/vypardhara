# Contributing

Thanks for considering a contribution.

## Dev setup

```bash
./setup.sh
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

## Code style

- Python: `black`, `ruff`, type hints required for public functions.
- TypeScript: `prettier`, ESLint config in repo.

## Tests

```bash
cd services/<name> && pytest -q
```

CI runs `pytest` + lint on every push (see `.github/workflows/ci.yml`).

## PRs

- Open against `main`.
- Include test coverage for new logic.
- Reference any related issue.
