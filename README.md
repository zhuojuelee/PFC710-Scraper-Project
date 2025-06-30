# PFC710 - Assignment 1

Seneca Polytechnic PFC710 (Project 1) Web Scraper

## Information

S3:
- S3 bucket name is `pfc710-shoes`
- Data is stored as a CSV `data.csv`
- Data format: `id,name,gender,style,price,releaseDateTimestamp,releasePageUrl,imgUrl`

## AWS Setup

1. Get your AWS CLI credentials from AWS Learner Lab
2. Modify your `.aws/credetials`

## Scraper Setup

### Prerequisitites:
- Python and pip installed

### Virualenv Setup
Follow the following instructions to setup the virtual env:
```bin\bash
cd scraper

# Create and activate the virtual env
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

Uncomment `scrape_and_write_to_s3()` at the end of `main_scraper.py`.

### Executimg the scraper:
```
`python main_scraper.py`
```

If you are at repo root, run `yarn scrape`

## Packaging the Lambda functions

1. Ensure you have `yarn` installed (refer to dashboard section)
2. Run `yarn zip:lambda:scraper` to build the Shoes Lambda
3. Run `yarn zip:lambda:sns` to build the SNS Lambda
4. Upload `lambda-deployment.zip` to the Shoes Lambda function through the AWS console
5. Upload `sns-lambda-deployment.zip` to the SNS Lamda function through the AWS console

## Dashboard UI Setup

Prerequisitites:
- NodeJS v22

Instructions below are run from repo root

### Install dependencies
```
yarn install
```

### Running the dashboard:
```
yarn dev
```

Head over to `localhost:3000`

### Building the dashboard:
```
yarn build
```

### Previewing prod
```
yarn preview
```
