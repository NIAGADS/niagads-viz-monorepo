SCRIPT="${NODE_ENV:-dev}"

cd ../apps/$1
concurrently "npm run watch" "npx lerna run ${SCRIPT}"