#!/bin/bash
# script for automatically running every step required to release packages to npm
# see the README for more information

BRANCH_NAME=$(echo "release/$(date '+%m-%d-%Y')")

git checkout -b $BRANCH_NAME
git push --set-upstream origin $BRANCH_NAME

npm run build-fresh

npx lerna version --no-private

npx release from-package
