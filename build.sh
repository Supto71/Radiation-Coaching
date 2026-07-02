#!/bin/bash
# Build script for Render

# Exit on error
set -o errexit

# Install backend dependencies
pip install -r backend/requirements.txt

# Install frontend dependencies and build
cd frontend
npm install
npm run build

# Move build to backend static folder
cd ..
rm -rf backend/static
cp -r frontend/dist backend/static
