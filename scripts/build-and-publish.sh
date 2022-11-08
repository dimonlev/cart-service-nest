#!bin/bash

REGION=eu-west-1
AWS_ACCOUNT_ID=848843843025
DOCKER_APP_REPOSITORY=dimonlev-cart-api
AWS_DOCKER_REGISTRY_URL=$AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/
DOCKER_TIME_TAG="(date +%s)"
DOCKER_LATEST_TAG=latest

docker logout $AWS_DOCKER_REGISTRY_URL

aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $AWS_DOCKER_REGISTRY_URL

docker build \
        -f "$(dirname "$0")/../Dockerfile" \
        -t "$DOCKER_APP_REPOSITORY:$DOCKER_TIME_TAG" \
        -t "$DOCKER_APP_REPOSITORY:$DOCKER_LATEST_TAG" \
        "$(dirname "$0")/../"

docker tag $DOCKER_APP_REPOSITORY:"$DOCKER_TIME_TAG" $AWS_DOCKER_REGISTRY_URL/$DOCKER_APP_REPOSITORY:"$DOCKER_TIME_TAG"
docker tag $DOCKER_APP_REPOSITORY:"$DOCKER_LATEST_TAG" $AWS_DOCKER_REGISTRY_URL/$DOCKER_APP_REPOSITORY:"$DOCKER_LATEST_TAG"

docker push aws $AWS_DOCKER_REGISTRY_URL/$DOCKER_APP_REPOSITORY