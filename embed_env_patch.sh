#!/bin/sh

# Define the path to your compiled JS file
CONFIG_FILE="./public/embed.js"

# Replace the placeholders with the actual env variables using sed
sed -i "s|\$VITE_BASE_URL|${VITE_BASE_URL}|g" "$CONFIG_FILE"
