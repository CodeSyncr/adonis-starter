# adonis starter service

## Setup

### Prerequisite

- nodeJS v18
- Postgres SQL
- Redis 5

Postgres and redis you can run via docker-compose: `docker-compose up -d` or `docker compose up -d`
to down docker-compose services as `docker-compose down` or `docker compose down`

### Code local setup

```
git clone https://github.com/CodeSyncr/adonis-starter.git
npm i
cp .env.example .env
npm run db:setup
```

NOTE: Setup .env file locally as per your local system use case.

### Run code locally

```
npm run dev
```

While running locally, no need to run worker separately, it's already part of server code.

#### For debugging

```
npm run debug
```

## Docker & CI/CD

```sh
docker build . -t adonis-starter:1.0 --no-cache

dr run -itd --env-file .env -e APP_TYPE=server -p 3333:3333 -p 9999:9999 --name server adonis-starter:1.0
dr run -itd --env-file .env -e APP_TYPE=worker -p 4444:3333  -p 10000:9999 --name worker adonis-starter:1.0
```

### GITHUB ACTION

```
name: Code Build & Push to ECR - Staging
on:
  push:
    branches:
      - staging
jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-region: ${{ secrets.AWS_REGION }}
          aws-access-key-id: ${{ secrets.GH_PUSH_AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.GH_PUSH_AWS_SECRET_ACCESS_KEY }}
      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1
      - name: Build and push Docker image
        uses: docker/build-push-action@v2
        with:
          context: .
          push: true
          tags: |
            ${{ secrets.ECR_REGISTRY_STAGING }}:${{ github.sha }}
            ${{ secrets.ECR_REGISTRY_STAGING }}:latest
```