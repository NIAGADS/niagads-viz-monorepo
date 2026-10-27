#!/bin/bash
# script for automatically building a docker service
# usage: ./build-docker.sh <service-name>
# see DOCKER_DEPLOYMENT.md for more information

DOCKER_SERVICES="genomicsdb adsp niagads-main genome-browser";

APP="$1";

if [[ !($DOCKER_SERVICES =~ $APP) ]]; then
    echo "ERROR: Unknown service";
    echo "$APP must be one of '$DOCKER_SERVICES'";
    exit 1;
fi

TAG="beta-v"
echo "Using tag: $TAG"

if [ -f "./.env" ]; then
    echo ".env already exists";
    echo "skipping creation...";
else
    echo "Creating .env file";
    cp "./sample.docker.env" "./.env";
fi

if [ -f "./apps/$APP/runtime.env" ]; then
    echo "runtime.env already exists for $APP";
    echo "skipping creation...";
else
    echo "creating runtime.env for $APP";
    cp "./apps/$APP/sample.runtime.env" "./apps/$APP/runtime.env";
fi

echo "Building image for $APP";
docker compose build $APP;

if [ $? -ne 0 ]; then
    echo "ERROR: building image for $APP failed!"
    exit 1
fi

echo "Tagging image";
docker tag client-app-$APP:staging $ECR_REGISTRY/$APP-beta:$TAG

if [ $? -ne 0 ]; then
    echo "ERROR: tagging image failed!"
    exit 1
fi

echo "Logging in to docker using aws";
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin  $ECR_REGISTRY

echo "Pushing image to ECR";
docker push $ECR_REGISTRY/$APP-beta:$TAG
