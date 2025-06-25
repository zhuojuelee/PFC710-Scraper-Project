# PFC710 - Assignment 1

Seneca PFC710 Web Scraper project

## Information

S3:
- S3 bucket name is `pfc710-shoes`
- Data is stored as a CSV (no headers)
- Data format: `id,name,gender,style,price,releaseDateTimestamp,releasePageUrl,imgUrl`

### Scraper Setup

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

### Frontend Setup
Prerequisitites:
- AWS account
  - AWS credentials
- NodeJS v22

Running the frontend:
- `yarn install`
