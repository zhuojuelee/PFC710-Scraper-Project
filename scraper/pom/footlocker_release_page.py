import requests

from bs4 import BeautifulSoup
from .product_container import ProductContainer

URL: str = 'https://www.footlocker.ca/en/release-dates'

# attrs
RELEASE_PRODUCT_CONTAINER_ATTR = {
    'class': 'ReleaseProduct-Container'
}

class FootLockerReleasePage:
    def __init__(self):
        response = requests.get(URL)
        soup = BeautifulSoup(response.content, 'html5lib')
        productContainersSoup = soup.find_all(
            'div', 
            attrs = RELEASE_PRODUCT_CONTAINER_ATTR
        )

        productContainers = map(
            (lambda product: ProductContainer(product)), 
            productContainersSoup
        )
        # setters
        self.soup = soup
        self.productContainers = productContainers

    def get_page_soup(self):
        return self.soup
    
    def get_all_product_containers(self) -> list[ProductContainer]:
        return self.productContainers
