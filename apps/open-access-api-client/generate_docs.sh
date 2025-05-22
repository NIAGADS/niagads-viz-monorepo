#!/bin/bash

# Load environment variables from .env file
if [ -f .env.local ]; then
    export $(grep -v '^#' .env.local | xargs)
else
    echo ".env file not found!"
    exit 1
fi

# Check if API_PUBLIC_URL variable is set
if [ -z "$API_PUBLIC_URL" ]; then
    echo "API_PUBLIC_URL variable not set in .env file!"
    exit 1
fi

# Check if API_MAJOR_VERSION variable is set
if [ -z "$API_MAJOR_VERSION" ]; then
    echo "API_MAJOR_VERSION variable not set in .env file!"
    exit 1
fi

# Define URLs using HOST_NAME from .env
ROOT="${API_PUBLIC_URL}/v${API_MAJOR_VERSION}/openapi.yaml"
FILER="${API_PUBLIC_URL}/v${API_MAJOR_VERSION}/filer/openapi.yaml"
GENOMICS="${API_PUBLIC_URL}/v${API_MAJOR_VERSION}/genomics/openapi.yaml"

# Download the OpenAPI YAML files
wget -O docs/root.yaml "$ROOT"
wget -O docs/filer.yaml "$FILER"
wget -O docs/genomics.yaml "$GENOMICS"

# Check if redocly is installed, install if not
if ! command -v redocly &> /dev/null; then
    npm install -g @redocly/cli
fi


# Merge the three files using Redocly CLI
if redocly join docs/root.yaml docs/genomics.yaml docs/filer.yaml \
    --output docs/openapi.yaml \
    --prefix-components-with-info-prop x-namespace \
    --prefix-tags-with-info-prop x-namespace; then
    echo "SUCCESS"
else
    echo "FAIL"
fi