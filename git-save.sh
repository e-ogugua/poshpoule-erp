#!/bin/bash

# Get the current timestamp
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

# Add all changes
git add .

# Commit with timestamp
git commit -m "Autosave: $TIMESTAMP"

# Push to remote
git push origin main

echo "✅ Changes saved at $TIMESTAMP"
