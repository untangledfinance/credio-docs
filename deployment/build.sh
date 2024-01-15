#!/bin/bash

DOCKER_REGISTRY=$1
AWS_REGION=$2
SERVICE_NAME=$3
TAG=$4
ENV=$5

DOCKER_IMAGE="$DOCKER_REGISTRY/$SERVICE_NAME:$TAG"

aws ecr describe-repositories --repository-names --region "$AWS_REGION" "$SERVICE_NAME" || aws ecr create-repository --repository-name --region "$AWS_REGION" "$SERVICE_NAME"
docker build --build-arg env="$ENV" --no-cache -f deployment/Dockerfile -t "$DOCKER_IMAGE" .
docker push "$DOCKER_IMAGE"