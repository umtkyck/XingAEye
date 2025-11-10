# Contributing to XingAEye

Thank you for your interest in contributing to XingAEye! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/XingAEye.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Commit with clear messages: `git commit -m "Add: new feature description"`
6. Push to your fork: `git push origin feature/your-feature-name`
7. Create a Pull Request

## Development Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Configure .env with your settings
npm run dev
```

### Web Dashboard

```bash
cd web
npm install
cp .env.example .env.local
# Configure environment variables
npm run dev
```

### Mobile App

```bash
cd mobile
npm install
npm start
```

## Code Style

- Use TypeScript for new code
- Follow ESLint rules
- Format code with Prettier
- Write meaningful comments

## Commit Messages

Follow conventional commits format:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

Example: `feat: add real-time video streaming support`

## Testing

- Write unit tests for new features
- Ensure all tests pass before submitting PR
- Test on multiple platforms (iOS, Android, Web)

```bash
# Run tests
npm test

# Run linter
npm run lint
```

## Pull Request Process

1. Update documentation if needed
2. Add tests for new features
3. Ensure CI/CD passes
4. Request review from maintainers
5. Address review comments

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow

## Questions?

Open an issue or contact us at contribute@xingaeye.com

Thank you for contributing!
