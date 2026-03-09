#!/bin/bash
# script for automatically running every step required to release packages to npm
# see the README for more information

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
RELEASE_BRANCH=$(echo "release/$(date '+%m-%d-%Y')")

if [[ "$CURRENT_BRANCH" != "$RELEASE_BRANCH" ]]; then
    git checkout -b $BRANCH_NAME
    git push --set-upstream origin $BRANCH_NAME
fi

npm run build-fresh

npx lerna version --no-private

npx release from-package
