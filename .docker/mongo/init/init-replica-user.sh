#!/bin/bash
set -e

# 1. Wait until mongod is fully up and accepting connections
echo ">>> Waiting for mongod to be ready..."
until mongosh --eval "db.adminCommand({ ping: 1 })" &> /dev/null; do
  sleep 1
done
echo ">>> mongod is up. Now initiating the replica set..."

# 2. Initiate the single-node replica set named "rs0"
mongosh <<EOF
  rs.initiate({
    _id: "rs0",
    members: [
      { _id: 0, host: "127.0.0.1:27017" }
    ]
  });
EOF
echo ">>> Replica set initiated (rs0)."

# 3. Wait until this node becomes PRIMARY before creating users
echo ">>> Waiting for PRIMARY to be elected..."
until mongosh --eval "rs.isMaster().ismaster" | grep "true" &> /dev/null; do
  sleep 1
done
echo ">>> Node is PRIMARY. Now creating application user..."

# 4. Create an application‐scoped user in a specific database (e.g., "mydatabase")
DB_NAME="test"
APP_USER="adminuser"
APP_PASS="password"

mongosh <<EOF
  use ${DB_NAME};
  db.createUser({
    user: "${APP_USER}",
    pwd: "${APP_PASS}",
    roles: [
      { role: "readWrite", db: "${DB_NAME}" }
    ]
  });
EOF
echo ">>> Created user '${APP_USER}' in database '${DB_NAME}'."
