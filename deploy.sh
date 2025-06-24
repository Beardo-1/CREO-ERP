#!/bin/bash

# Build the project
echo "Building the project..."
npm run build

# Create a temporary directory for deployment
echo "Preparing deployment..."
rm -rf temp-deploy
mkdir temp-deploy
cp -r dist/* temp-deploy/

# Switch to gh-pages branch
git checkout -b gh-pages 2>/dev/null || git checkout gh-pages

# Clear existing files
rm -rf *

# Copy built files
cp -r temp-deploy/* .

# Add .nojekyll file to prevent Jekyll processing
touch .nojekyll

# Commit and push
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages --force

# Switch back to main
git checkout main

# Clean up
rm -rf temp-deploy

echo "Deployment complete! Your site will be available at:"
echo "https://beardo-1.github.io/CREO-ERP/" 