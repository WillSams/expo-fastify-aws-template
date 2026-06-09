# TypeScript Fullstack Template

**TypeScript · React · Material UI · Zustand · Fastify · AWS Lambda · S3 · CloudFront · Terraform**

[![Application Unit Tests](https://github.com/WillSams/fullstack-typescript-template/actions/workflows/pr-validate.yml/badge.svg)](https://github.com/WillSams/fullstack-typescript-template/actions/workflows/pr-validate.yml)

A reusable full-stack TypeScript template. Fork it, rename things, and ship.

![text](screenshot.png)

## When to use this stack

**React + Zustand** is a good fit when we want a proven, widely supported UI library without the ceremony of heavier state solutions like Redux. Zustand keeps global state simple: no boilerplate, no provider wrapping our whole tree, and very little setup. That makes it easier to onboard new contributors and keeps the codebase lean as requirements evolve.

**Fastify on Lambda** earns its place when traffic is variable or unpredictable. We pay only for actual invocations, cold starts stay reasonable because of Fastify’s low overhead and an esbuild single-file bundle, and we get automatic scaling without managing servers. It is a good choice for internal tools, MVPs, and APIs that do not justify running a container 24/7.

The combination makes sense when:

- We want **TypeScript end-to-end** with shared types between frontend and backend
- Traffic is **bursty or low-volume**, where serverless pricing beats reserved capacity
- Our team wants **minimal ops** with no clusters, auto-scaling groups, or load balancers to manage
- We need a **quick foundation** for a new project without starting from scratch each time

If we expect sustained high-throughput traffic, such as thousands of requests per second continuously, a long-running container behind a load balancer will likely be cheaper. For everything else, this stack gets us to production quickly without much operational overhead.

| Layer | Tech |
|---|---|
| Frontend | React 18, Material UI, Zustand, React Router, Vite, Vitest |
| Backend | Fastify 5, AWS Lambda (`@fastify/aws-lambda`), esbuild |
| Infrastructure | Terraform — Lambda, API Gateway (HTTP), S3, CloudFront, IAM, CloudWatch |
| Quality | ESLint, Prettier, Husky pre-commit + pre-push, GitHub Actions CI |

## Prerequisites

- [Node.js 22](https://nodejs.org/) — use `nvm use` to pick the version in `.nvmrc`
- [nvm](https://github.com/nvm-sh/nvm) *(recommended)*
- [direnv](https://direnv.net/) *(recommended)*
- [Terraform CLI](https://developer.hashicorp.com/terraform/install) — for infra changes
- [AWS CLI](https://aws.amazon.com/cli/) — for deployments

## Getting Started

```bash
# 1. Use the right Node version
nvm use

# 2. Set up environment variables
cp .envrc.example .envrc   # fill in values, then:
direnv allow

# 3. Install all dependencies
npm install
cd frontend && npm install && cd ..
cd backend  && npm install && cd ..

# 4. Start both services
npm run dev
```

The frontend is served at `http://localhost:3000` and the backend at `http://localhost:8080`.

## Project Structure

```
fullstack-typescript-template/
├── frontend/          # React + Zustand SPA (deploys to S3 + CloudFront)
│   ├── src/
│   │   ├── api/       # Axios client
│   │   ├── pages/     # Route-level components
│   │   ├── stores/    # Zustand stores
│   │   └── specs/     # Vitest tests + setup
│   └── vite.config.ts
├── backend/           # Fastify API (deploys as Lambda)
│   ├── src/
│   │   ├── app.ts     # Fastify instance + routes
│   │   ├── index.ts   # Lambda handler entry point
│   │   └── server.ts  # Local dev server
│   └── specs/         # Jest tests
├── .infrastructure/   # Terraform
│   ├── api_gateway.tf # HTTP API → Lambda
│   ├── frontend.tf    # S3 bucket + CloudFront
│   ├── lambda.tf      # Lambda function (ECR image)
│   ├── iam.tf
│   ├── logs.tf
│   └── environments/  # demo / staging / prod tfvars
└── .github/
    └── workflows/     # CI: lint + test on every PR
```

## Scripts

From the project root:

| Command | Description |
|---|---|
| `npm run dev` | Start frontend + backend concurrently |
| `npm run dev:frontend` | Start frontend only |
| `npm run dev:backend` | Start backend only |
| `npm run test:frontend` | Run frontend tests |
| `npm run test:backend` | Run backend tests |
| `npm run test:frontend:coverage` | Frontend tests with coverage |
| `npm run test:backend:coverage` | Backend tests with coverage |
| `npm run lint:frontend` | Lint frontend |
| `npm run lint:backend` | Lint backend |
| `npm run format:frontend` | Format frontend |
| `npm run format:backend` | Format backend |
| `npm run clean` | Remove all build artefacts and node_modules |

## Testing

```bash
# Backend (Jest)
npm run test:backend

# Frontend (Vitest)
npm run test:frontend
```

## Infrastructure

The Terraform configuration in `.infrastructure/` provisions:

- **Lambda** function (Docker image from ECR)
- **API Gateway HTTP API** with CORS and `$default` catch-all route
- **S3 bucket** for the React SPA (private, versioned)
- **CloudFront** distribution with OAC, HTTPS redirect, and SPA 404 fallback
- **IAM** role + `AWSLambdaBasicExecutionRole` policy
- **CloudWatch** log group with configurable retention

```bash
cd .infrastructure

# Initialise (once)
terraform init

# Plan against an environment
terraform plan -var-file=environments/demo.tfvars

# Apply
terraform apply -var-file=environments/demo.tfvars
```

### Deploying the frontend

After `terraform apply`, sync the Vite build to the S3 bucket:

```bash
cd frontend && npm run build
aws s3 sync dist/ s3://$(terraform -chdir=../.infrastructure output -raw s3_bucket) --delete
```

### Deploying the backend

Build and push the Docker image to ECR, then update the Lambda:

```bash
cd backend && npm run build

# Tag and push to ECR (replace with your account/region/function name)
aws ecr get-login-password | docker login --username AWS --password-stdin <account>.dkr.ecr.<region>.amazonaws.com
docker build -t fastify-template-function .
docker tag fastify-template-function:latest <account>.dkr.ecr.<region>.amazonaws.com/fastify-template-function:latest
docker push <account>.dkr.ecr.<region>.amazonaws.com/fastify-template-function:latest

aws lambda update-function-code \
  --function-name <environment>-fastify-template-function \
  --image-uri <account>.dkr.ecr.<region>.amazonaws.com/fastify-template-function:latest
```

## Code Quality

Pre-commit hooks (Husky) run format + lint on every commit. Pre-push hooks run the full test suite.

GitHub Actions runs lint and tests on every PR to `main`. Branch names must follow semantic conventions (`feat/`, `fix/`, `chore/`, `refactor/`, `docs/`, `style/`, `test/`).
