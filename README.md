# PFC710 - Assignment 1

Seneca PFC710 Web Scraper project

## Information

S3:
- S3 bucket name is `pfc710-shoes`
- Data is stored as a CSV (no headers)
- Data format: `id,name,gender,style,price,releaseDateTimestamp,releasePageUrl,imgUrl`


## AWS Setup

1. Get your AWS CLI credentials from AWS Learner Lab
2. Modify your `.aws/credetials`

## Scraper Setup

Prerequisitites:
- Python and pip installed

Follow the following instructions to setup the virtual env:
```bin\bash
cd scraper

# Create and activate the virtual env
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

Execute the scraper: `python main_scraper.py` or if you are at repo root, run `yarn scrape`

## Packaging the Lambda function

1. Ensure you have `yarn` installed (refer to frontend section)
2. Run `yarn zip:lambda` from repo root
3. Upload `lambda-deployment.zip` to the lambda function on AWS console

## Frontend Setup

Prerequisitites:
- NodeJS v22

Instructions below are run from repo root

### Install dependencies
```
yarn install
```

### Running the frontend:
```
yarn dev
```

Head over to `localhost:3000`

### Building the frontend:
```
yarn build
```

### Previewing prod
```
yarn preview
```
