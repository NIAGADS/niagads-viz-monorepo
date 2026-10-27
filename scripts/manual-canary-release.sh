CANARY_SHA=$(git commit-tree 'HEAD^{tree}' \
  -p main \
  -m "Temporary canary release for app/oa-api")

git worktree add --detach .worktrees/oa-api-canary "$CANARY_SHA"

cd .worktrees/oa-api-canary

npm ci

npx lerna run build --concurrency 1

npx lerna publish --canary --dist-tag canary

cd ../.. || exit 1

git worktree remove --force .worktrees/oa-api-canary
