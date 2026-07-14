#!/bin/bash

# ======================================================================
# Site Mitra Database Migration Script
# Copies data from MongoDB Atlas to your VPS MongoDB instance
# ======================================================================

# 1. Source (MongoDB Atlas) URI
# Ensure this matches exactly what's in your apps/api/.env right now
SOURCE_URI="mongodb+srv://utkarsheducation54_db_user:Utkarsh2026@cluster0.kntmwaj.mongodb.net/site-mitra"

# 2. Destination (Your VPS) URI
# Change "YourStrongPasswordHere" to the password you created on the VPS
# Note: Ensure port 27017 is open on your VPS (187.127.147.166) or you run this script ON the VPS
DEST_URI="mongodb://sitemitra_admin:YourStrongPasswordHere@187.127.147.166:27017/site-mitra"

echo "========================================="
echo "Starting Database Migration..."
echo "========================================="

# Step 1: Dump the data from Atlas to a local folder named "dump"
echo "[1/3] Downloading data from MongoDB Atlas..."
mongodump --uri="$SOURCE_URI"

if [ $? -eq 0 ]; then
  echo "✅ Data successfully downloaded from Atlas."
else
  echo "❌ Error downloading data. Do you have MongoDB Database Tools installed?"
  echo "If not, run: brew tap mongodb/brew && brew install mongodb-database-tools"
  exit 1
fi

# Step 2: Restore the data to the VPS
echo "[2/3] Uploading data to your VPS MongoDB..."
# The dump is saved in a folder called 'dump/site-mitra'
mongorestore --uri="$DEST_URI" --drop dump/site-mitra

if [ $? -eq 0 ]; then
  echo "✅ Data successfully uploaded to VPS!"
else
  echo "❌ Error uploading to VPS. Please check:"
  echo "   - Did you replace 'YourStrongPasswordHere' with the real password in this script?"
  echo "   - Is port 27017 open on the VPS? (If not, run this script from INSIDE the VPS using 127.0.0.1 instead of 187.127.147.166)"
  exit 1
fi

# Step 3: Cleanup
echo "[3/3] Cleaning up local dump files..."
rm -rf dump

echo "========================================="
echo "🎉 Migration Complete!"
echo "You can now update your apps/api/.env to point to the VPS MongoDB."
echo "========================================="
