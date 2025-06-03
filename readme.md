# task-manager

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
