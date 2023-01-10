#!/bin/bash

# Step 1: Retrieve the extension's current version by looking into manifest.json
version=$(grep -Po '(?<="version": ")[^"]*' manifest.json)

# Step 2: Create a directory "ally-tool-gw-extension" and copy the necessary files
mkdir ally-tool-gw-extension
cp background.js content.js manifest.json ally-tool-gw-extension/

# Step 3: Create a zip archive of the new directory
zip -r ally-tool-gw-extension-v$version.zip ally-tool-gw-extension

# Step 4: Move the zip archive to the "exports" directory
mv ally-tool-gw-extension-v$version.zip exports/

# Step 5: Delete the directory created in step 2
rm -r ally-tool-gw-extension
