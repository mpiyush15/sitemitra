#!/bin/bash

# ======================================================================
# Site Mitra Database Migration Script
# Copies data from MongoDB Atlas directly into the VPS local database
# ======================================================================

# 1. Source (MongoDB Atlas) URI
SOURCE_URI="mongodb+srv://utkarsheducation54_db_user:Utkarsh2026@cluster0.kntmwaj.mongodb.net/site-mitra"

# 2. Destination (Local VPS MongoDB) URI
DEST_URI="mongodb://localhost:27017/sitemitra"

echo "========================================="
echo "Starting Database Migration..."
echo "========================================="

# Step 1: Dump the data from Atlas to a local folder named "dump"
echo "[1/3] Downloading data from MongoDB Atlas..."
mongodump --uri="$SOURCE_URI"

if [ $? -eq 0 ]; then
  echo "✅ Data successfully downloaded from Atlas."
else
  echo "❌ Error downloading data. Make sure mongodump is installed."
  exit 1
fi

# Step 2: Restore the data to the VPS local MongoDB
echo "[2/3] Uploading data to your VPS MongoDB..."
# The dump is saved in a folder called 'dump/site-mitra' (because Atlas db is named site-mitra)
mongorestore --uri="$DEST_URI" --drop dump/site-mitra

if [ $? -eq 0 ]; then
  echo "✅ Data successfully restored to local VPS database!"
else
  echo "❌ Error restoring data to VPS. Make sure mongorestore is installed."
  exit 1
fi

# Step 3: Cleanup
echo "[3/3] Cleaning up local dump files..."
rm -rf dump

echo "========================================="
echo "🎉 Migration Complete!"
echo "Your VPS now has all the data from Atlas."
echo "========================================="
