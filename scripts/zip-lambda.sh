#!/bin/bash
LAMBDA_DIR="scraper"
BUILD_DIR="scraper/build"
ZIP_FILE="scraper-lambda-deployment.zip"

# clean up
rm -rf $BUILD_DIR $ZIP_FILE
mkdir -p $BUILD_DIR

# activate venv
source scraper/venv/bin/activate

# copy depedencies from site-packages
SITE_PACKAGES=$(python -c "import site; print(site.getsitepackages()[0])")
cp -r "$SITE_PACKAGES"/* "$BUILD_DIR/"

# copy all top level .py files
cp "$LAMBDA_DIR"/*.py "$BUILD_DIR/"

# copy directories
cp -r "$LAMBDA_DIR/aws" "$LAMBDA_DIR/pom" "$BUILD_DIR/"

# zip it up
cd "$BUILD_DIR"
zip -r "../../$ZIP_FILE" .
cd -

echo "Scraper Lambda package built at $ZIP_FILE"