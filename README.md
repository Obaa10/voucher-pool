## Project Overview

Voucher Pool API (NestJS)

A voucher pool is a collection of voucher codes that can be used by customers to get discounts on website. Each code may only be used once, and we would like to know when it was used by the customer. Since there can be many customers in a voucher pool, we need a call that auto-generates voucher codes for each customer. Here’s

### Functionalities

- Generate Voucher Code for each customer for a given Special Offer and expiration data
- Provide an endpoint, reachable via HTTP, which receives a Voucher Code and Email and validates the Voucher Code. In Case it is valid, return the Percentage Discount and set the date of usage
- For a given Email return all its valid Voucher Codes with the Name of the Special Offer

### Tasks

- Design a database schema
- Write an application
- API endpoint for verifying and redeeming vouchers
- Implement API Rate Limiting: Protect the API from abuse by implementing rate limiting on the endpoints.
- Use Database Transactions: Ensure data consistency by implementing use of transactions in your application.
- Write unit tests
- Using Typescript
- A nice little Readme on how to run
- PLUS POINT: Writing swagger for the API
- PLUS POINT: Docker file to setup the whole application with all the dependencies (database, nodejs)
- Note: Focus on code quality No need for access control think of it as an internal application

### Tech Stack

- NestJS (TypeScript)
- MySQL (TypeORM/Prisma)
- Docker (for containerization)
- Jest (for testing)

## Installation

```bash
$ npm install
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

## Running the app with Docker

```bash
$ docker-compose up --build
```
