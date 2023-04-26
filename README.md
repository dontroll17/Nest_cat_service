<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<p align="center">Cats service.</p>

## Description

Pet project.

## Installation

install k6 for load test [instalation](https://k6.io/docs/get-started/installation/)

```bash
$ npm ci
```

<p>create .env file</p>
<p>db create in docker(create user and database)</p>

```bash
$ docker run --name {Postgres name} -p {postgres_port}:{port} -e POSTGRES_PASSWORD={db_password} -d {db_name}
$ npm run migration
$ cd migrations
$ docker exec -i ${container hash} psql -U ${postgres user} -d{database} < data.sql
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov

# load test
$ npm run load_test
```

## License

Nest is [MIT licensed](LICENSE).
