#!/bin/bash

echo "Checking database status..."
ts-node -r tsconfig-paths/register ./src/scripts/check-database.ts

if [ $? -eq 0 ]; then
  echo "Database is ready. Starting development server..."
  nest start --watch
else
  echo "Failed to setup database. Cannot start development server."
  exit 1
fi 