#!/bin/bash
# Script to launch Veritas Deepfake Detection Server and open the browser
PROJECT_DIR="/Users/manasmudhiraj/.gemini/antigravity/scratch/deepfake-detector"

cd "$PROJECT_DIR" || exit 1

echo "Starting Deepfake Detection Server at http://localhost:3000..."
open "http://localhost:3000"

npm start
