#!/bin/bash
LAMBDA_DIR="sns_lambda"
BUILD_DIR="sns_lambda/build"
ZIP_FILE="sns-lambda-deployment.zip"

# clean up
rm -rf $BUILD_DIR $ZIP_FILE
mkdir -p $BUILD_DIR

# copy all top level .py files
cp "$LAMBDA_DIR"/*.py "$BUILD_DIR/"

# zip it up
cd "$BUILD_DIR"
zip -r "../../$ZIP_FILE" .
cd -

echo "SNS Lambda package built at $ZIP_FILE"