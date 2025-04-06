# Contributing to MEAN Stack Contacts Application

Thank you for your interest in contributing to our project! This guide will help you get started with the development process and explain how to submit contributions.

## Table of Contents

- [Contributing to MEAN Stack Contacts Application](#contributing-to-mean-stack-contacts-application)
  - [Table of Contents](#table-of-contents)
  - [Code of Conduct](#code-of-conduct)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Setting Up the Development Environment](#setting-up-the-development-environment)
  - [Development Workflow](#development-workflow)
    - [Keeping Your Fork Updated](#keeping-your-fork-updated)
  - [Pull Request Process](#pull-request-process)
    - [PR Title Format](#pr-title-format)
    - [PR Description Template](#pr-description-template)
  - [Coding Standards](#coding-standards)
    - [General Guidelines](#general-guidelines)
    - [Frontend (Angular)](#frontend-angular)
    - [Backend (Express.js)](#backend-expressjs)
  - [Testing Guidelines](#testing-guidelines)
    - [Frontend Testing](#frontend-testing)
    - [Backend Testing](#backend-testing)
  - [Documentation](#documentation)
  - [Issue Reporting](#issue-reporting)
  - [Feature Requests](#feature-requests)
  - [Community](#community)
    - [Communication Channels](#communication-channels)
    - [Contributor Recognition](#contributor-recognition)
  - [Code Review Process](#code-review-process)
  - [Project Governance](#project-governance)
  - [Getting Help](#getting-help)
  - [Thank You!](#thank-you)

## Code of Conduct

We have a few ground rules that we ask all contributors to adhere to:

- Be respectful and inclusive
- Value constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

- Git
- Node.js (LTS version)
- Docker and Docker Compose (for development)
- MongoDB (if running locally without Docker)

### Setting Up the Development Environment

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/mean-docker.git
   cd mean-docker
   ```

3. Add the upstream repository as a remote:
   ```bash
   git remote add upstream https://github.com/nitin27may/mean-docker.git
   ```

4. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

5. Start the development environment:
   ```bash
   docker-compose -f docker-compose.debug.yml up
   ```

## Development Workflow

1. Create a new branch from `master` for your work:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes, following the [coding standards](#coding-standards)

3. Add and commit your changes:
   ```bash
   git add .
   git commit -m "Add feature X"
   ```

4. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

5. Create a pull request from your fork to the main repository

### Keeping Your Fork Updated

Regularly sync your fork with the upstream repository:

```bash
git checkout master
git pull upstream master
git push origin master
```

## Pull Request Process

1. Ensure your PR addresses a specific issue or feature
2. Update the README.md and documentation with details of changes, if applicable
3. Add appropriate tests for your changes
4. Ensure the test suite passes and your code lints without errors
5. Submit the PR for review

### PR Title Format

Use a clear and descriptive title for your PR, following this format:
- `feat: Add new feature`
- `fix: Fix bug in component`
- `docs: Update README`
- `style: Format code`
- `refactor: Refactor component structure`
- `test: Add tests for feature`
- `chore: Update dependencies`

### PR Description Template

```
## Description
[Description of the changes]

## Related Issue
Fixes #[issue_number]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring
- [ ] Performance improvement
- [ ] Tests
- [ ] Build/CI
- [ ] Other (please specify)

## Testing
[Describe how you tested your changes]

## Screenshots (if applicable)
[Add screenshots here]

## Checklist
- [ ] My code follows the project's coding standards
- [ ] I have added tests for my changes
- [ ] All new and existing tests pass
- [ ] I have updated the documentation
- [ ] My changes don't break existing functionality
```

## Coding Standards

### General Guidelines

- Write clean, readable, and self-documenting code
- Follow the principle of DRY (Don't Repeat Yourself)
- Keep functions and methods short and focused on a single task
- Use meaningful variable and function names

### Frontend (Angular)

- Follow the [Angular Style Guide](https://angular.io/guide/styleguide)
- Use the project's existing TSLint configuration
- Format code using Prettier
- Use Angular CLI for generating components, services, etc.

Example component structure:
```typescript
@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})
export class ExampleComponent implements OnInit {
  // Properties at the top
  property: string;

  // Constructor
  constructor(private service: ExampleService) {}

  // Lifecycle hooks
  ngOnInit(): void {
    // Initialization logic
  }

  // Public methods
  publicMethod(): void {
    // Method implementation
  }

  // Private methods
  private helperMethod(): void {
    // Method implementation
  }
}
```

### Backend (Express.js)

- Follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Format code using Prettier
- Use async/await for asynchronous operations
- Organize routes and controllers logically

Example controller structure:
```javascript
// Import dependencies
const Model = require('../models/model');

// Controller methods
exports.list = async (req, res) => {
  try {
    const items = await Model.find();
    res.json({
      status: "success",
      message: "Items retrieved successfully",
      data: items
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message
    });
  }
};
```

## Testing Guidelines

### Frontend Testing

- Write unit tests for components, services, and pipes
- Aim for at least 70% code coverage
- Test both success and failure scenarios
- Use TestBed for component testing

Example test:
```typescript
describe('ExampleComponent', () => {
  let component: ExampleComponent;
  let fixture: ComponentFixture<ExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExampleComponent],
      providers: [ExampleService]
    }).compileComponents();

    fixture = TestBed.createComponent(ExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should perform an action', () => {
    // Test implementation
  });
});
```

### Backend Testing

- Write unit tests for controllers and models
- Write integration tests for API endpoints
- Use Mocha, Chai, and Supertest

Example test:
```javascript
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();

chai.use(chaiHttp);

describe('API endpoints', () => {
  it('should list all items on GET /api/items', (done) => {
    chai.request(server)
      .get('/api/items')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('success');
        done();
      });
  });
});
```

## Documentation

Good documentation is crucial for the project. Please follow these guidelines:

- Update the README.md file when adding new features or changing functionality
- Document your code with comments where necessary
- Use JSDoc for functions and methods
- Create or update API documentation for new or modified endpoints

## Issue Reporting

If you find a bug or have a suggestion for improvement:

1. Check if the issue already exists in the [GitHub Issues](https://github.com/nitin27may/mean-docker/issues)
2. If not, create a new issue using the appropriate template
3. Provide as much detail as possible, including:
   - Steps to reproduce the issue
   - Expected behavior
   - Actual behavior
   - Screenshots or error messages
   - Environment details (OS, browser, etc.)

## Feature Requests

We welcome feature requests that align with the project goals:

1. Check if the feature has already been requested
2. Create a new issue using the feature request template
3. Clearly describe the feature and its benefits
4. Provide examples of how the feature would be used

## Community

We value our community and encourage active participation. Here are ways you can engage with the project community:

### Communication Channels

- **GitHub Issues**: Primary channel for bug reports, feature requests, and discussions
- **Pull Requests**: For code contributions and reviews
- **Project Discussions**: Use GitHub Discussions for general questions and ideas

### Contributor Recognition

We recognize all contributors to the project in the following ways:

- All contributors are listed in our [CONTRIBUTORS.md](CONTRIBUTORS.md) file
- Significant contributions may be highlighted in release notes
- Community members who consistently contribute high-quality work may be invited to join as maintainers

## Code Review Process

All submissions go through a review process:

1. Initial review by maintainers for general fit with project goals
2. Technical code review for quality, performance, and adherence to standards
3. Tests and CI checks must pass
4. At least one approval from a maintainer is required before merging

Expect questions and feedback during the review process. This is a normal part of development and helps ensure quality.

## Project Governance

The project is currently maintained by a small team led by [Nitin Singh](https://github.com/nitin27may). Governance includes:

- **Maintainers**: Review and merge pull requests, guide overall direction
- **Contributors**: Anyone who has contributed code, documentation, or other assets
- **Users**: People who use the project and provide feedback

## Getting Help

If you need help with your contribution:

- Ask questions in the relevant GitHub issue
- Tag specific maintainers if you need their input
- Be patient - maintainers are volunteers with limited time

## Thank You!

Your contributions make this project better for everyone. Whether you're fixing a typo in documentation or implementing a major feature, we appreciate your time and effort.

---

*By contributing to this project, you agree to abide by its terms and conditions as outlined in the project's [LICENSE](LICENSE) file.*