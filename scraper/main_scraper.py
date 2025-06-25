from aws.s3_client import S3Client
from pom.footlocker_release_page import FootLockerReleasePage
from pom.product_container import ProductContainer

def scrape_and_write_to_s3():
    # init aws clients
    s3Client = S3Client()
    shoeIds = s3Client.get_shoes_ids_map()

    # get footlocker release page and its products
    footLockerReleasePage = FootLockerReleasePage()
    productContainers = footLockerReleasePage.get_all_product_containers()

    # process all containers
    newData = []
    for i in range(len(productContainers)):
        product = ProductContainer(productContainers[i])
        productId = product.get_product_id()

        # check if product has been scraped before
        if productId in shoeIds:
            continue
        
        csvRow = ','.join([
            productId,
            product.get_product_name(),
            product.get_product_gender(),
            product.get_product_style(),
            product.get_price(),
            str(product.get_release_date_timestamp()),
            product.get_release_page_url(),
            product.get_img_src(),
        ])

        newData.append(csvRow)

    # join old and new data, then upload
    oldData = s3Client.get_shoes_data()
    dataToUpload = oldData + newData
    s3Client.upload_shoes_data(dataToUpload)

    return newData
