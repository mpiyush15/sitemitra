#!/bin/bash

# Define database name
DB_NAME="sitemitra"

echo "Connecting to local MongoDB on VPS and initializing database: $DB_NAME..."

# Use mongosh (or mongo for older versions) to create a database and a dummy collection
mongosh mongodb://localhost:27017/$DB_NAME --eval '
  db.createCollection("init");
  db.init.insertOne({ message: "Database sitemitra successfully initialized on VPS!", created_at: new Date() });
  print("✅ Database created and initialized with dummy collection.");
'

# Fallback to older 'mongo' shell if 'mongosh' is not found
if [ $? -ne 0 ]; then
  echo "mongosh not found, trying with legacy mongo shell..."
  mongo mongodb://localhost:27017/$DB_NAME --eval '
    db.createCollection("init");
    db.init.insertOne({ message: "Database sitemitra successfully initialized on VPS!", created_at: new Date() });
    print("✅ Database created and initialized with dummy collection.");
  '
fi

echo "====================================================="
echo "Setup complete! Please update your .env file in apps/api"
echo "to point to the local VPS database:"
echo "MONGODB_URI=mongodb://localhost:27017/$DB_NAME"
echo "====================================================="
