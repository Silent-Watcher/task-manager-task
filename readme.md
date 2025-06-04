# task-manager

## ⚠️ environment variables note

Inside the `.docker` directory, create a folder named `env`, and within it, add a file called `.env.dev`. Copy all the environment variables from the `.env.example` file located in the project root into `.env.dev`.

## ⚠️ MongoDB Replica Set Note 🥲

First spin up containers with:

```sh
npm run docker:dev
```

After spin up the containers run:

```sh
docker exec -it mongo bash
```

then:

```sh
mongosh --quiet --eval '
  rs.initiate({
    _id: "rs0",
    members: [{ _id: 0, host: "mongo:27017" }]
  });
  printjson(rs.status());
'
```

You should see something like:

```sh
{ "ok": 1 }
{
  "set": "rs0",
  "date": ISODate("2025-06-04T00:20:00Z"),
  "myState": 1,
  …
}
```

> If you do it slowly, the database circuit breaker will open, and you'll have to restart the service or wait for the circuit breaker to become half-open again

## Why we need replica set?

I utilized MongoDB transactions to prevent race conditions and ensure data consistency, thereby improving atomicity. Note that this feature requires a replica set configuration."

## Where can I find the API docs?

I've included a file named `task-manager-task.postman_collection.json`.
You can import this file into Postman to access the API documentation.

## About front-end section

In the front-end part of the project, I didn’t implement a **logout** functionality because I’m not sure why we would need logout in a stateless authentication system.

Regarding token refresh, I added automatic token refresh on a 401 error. Maybe I forgot to mention it somewhere, so don’t be too strict about that!


## Tools & Tech ⛏

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Zod](https://img.shields.io/badge/zod-%233068b7.svg?style=for-the-badge&logo=zod&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Vitest](https://img.shields.io/badge/-Vitest-252529?style=for-the-badge&logo=vitest&logoColor=FCC72B)
