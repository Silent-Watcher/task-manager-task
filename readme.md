# task-manager

## ⚠️ MongoDB Replica Set Note 🥲

This project uses a MongoDB replica set bound to 127.0.0.1. Because of that, when running MongoDB in Docker, other services in the same Docker network **can’t connect to it** using the service name (e.g. mongo), since 127.0.0.1 refers to the container itself.
To work around this, you should run a MongoDB container with the replica set bound to 127.0.0.1 and connect to it from tools like MongoDB Compass using: 127.0.0.1:27017
