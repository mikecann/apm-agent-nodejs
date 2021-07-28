#!/bin/bash

# copies agent files from a working directory to the current node_modules folder
echo "Copying from /Users/astorm/Documents/github/elastic/apm-agent-nodejs/"
rm -rf ./node_modules/elastic-apm-node
mkdir ./node_modules/elastic-apm-node

cp /Users/astorm/Documents/github/elastic/apm-agent-nodejs/index.js ./node_modules/elastic-apm-node
cp /Users/astorm/Documents/github/elastic/apm-agent-nodejs/package.json ./node_modules/elastic-apm-node
cp -r /Users/astorm/Documents/github/elastic/apm-agent-nodejs/lib/ ./node_modules/elastic-apm-node/lib/

# zips up files and adds to function
zip -r function.zip index.js node_modules && aws lambda update-function-code --function-name july-2021-delete-after-july-31 --zip-file fileb://function.zip --region us-west-2

