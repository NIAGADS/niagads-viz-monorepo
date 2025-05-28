#!/bin/bash

echo "Generating bundled OpenAPI documentation"

# Load environment variables from .env file
if [ -f .env.local ]; then
    export $(grep -v '^#' .env.local | xargs)
else
    echo ".env file not found!"
    exit 1
fi

# Check if API_INTERNAL_URL variable is set
if [ -z "$API_INTERNAL_URL" ]; then
    echo "API_INTERNAL_URL variable not set in .env file!"
    exit 1
fi

# Check if API_MAJOR_VERSION variable is set
if [ -z "$API_MAJOR_VERSION" ]; then
    echo "API_MAJOR_VERSION variable not set in .env file!"
    exit 1
fi

# Check if redocly is installed, install if not
if ! command -v redocly &> /dev/null; then
    echo "Installing redocly."
    npm install -g @redocly/cli
fi

mkdir public/docs

# Define URLs using HOST_NAME from .env
ROOT="${API_INTERNAL_URL}/v${API_MAJOR_VERSION}/openapi"
FILER="${API_INTERNAL_URL}/v${API_MAJOR_VERSION}/filer/openapi"
GENOMICS="${API_INTERNAL_URL}/v${API_MAJOR_VERSION}/genomics/openapi"

# Download the OpenAPI YAML files
# and erge the three files using Redocly CLI
if wget -O public/docs/root.yaml "$ROOT.yaml" \
    && wget -O public/docs/filer.yaml "$FILER.yaml" \
    && wget -O public/docs/genomics.yaml "$GENOMICS.yaml" \
    && redocly join public/docs/root.yaml public/docs/genomics.yaml public/docs/filer.yaml \
        --output public/docs/openapi.yaml \
        --without-x-tag-groups; then
    echo "Bundled public/docs/openapi.yaml created."
else
    echo "FAILED to create openapi.yaml bundle."
fi


# Download the OpenAPI JSON files
# and merge the three files using Redocly CLI
if wget -O public/docs/root.json "$ROOT.json" \
    && wget -O public/docs/filer.json "$FILER.json" \
    && wget -O public/docs/genomics.json "$GENOMICS.json" \
    && redocly join public/docs/root.json public/docs/genomics.json public/docs/filer.json \
        --output public/docs/openapi.json \
        --without-x-tag-groups; then
    echo "Bundled public/docs/openapi.json created."
else
    echo "FAILED to create openapi.json bundle."
fi