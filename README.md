# Coindor Backend

## Description

This API will provide the necessary endpoints to Coindor App.

## Technologies

The technologies used were Node.js, Express and MongoDB.

## Endpoints

- **POST /register**
- **POST /login**
- **PATCH /api/user/:userId** : Modifies a user. The only fields allowed to modify are coins.
- **POST /api/admin/approve/:userId** : Approves a registered user.
- **POST /api/admin/coin** : Adds new coin.
- **PATCH /api/admin/coin** : Modifies coin.

## Run App (local environment)

An instance of MongoDB should be running at port 27017. Then execute the following command at root directory:

> npm run start

## Run Tests

The tests were done using Mocha and Chai. An instance of MongoDB should be running at port 27017.
To run tests execute:

> npm run test