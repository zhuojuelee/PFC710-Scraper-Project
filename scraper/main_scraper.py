from aws.s3_client import S3Client
from pom.footlocker_release_page import FootLockerReleasePage

def scrape_and_write_to_s3():
    # init s3 client and get existing IDs
    s3Client = S3Client()
    shoeIds = s3Client.get_shoes_ids_map()

    # get footlocker release page and its products
    footLockerReleasePage = FootLockerReleasePage()
    allProductContainers = footLockerReleasePage.get_all_product_containers()

    # process all containers
    newData = []
    for product in allProductContainers:
        productId = product.get_product_id()

        # check if product has been scraped before
        if productId in shoeIds:
            continue
        
        csvRow = product.get_data_as_csv_row()
        newData.append(csvRow)

    # update if there is new data
    if len(newData) > 0:
        # get old data and join with new data
        oldData = s3Client.get_shoes_data()
        dataToUpload = oldData + newData
        s3Client.upload_shoes_data(dataToUpload)

    return newData

# scrape_and_write_to_s3()
