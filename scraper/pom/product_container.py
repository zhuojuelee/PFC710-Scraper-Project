from datetime import datetime

def create_class_atr_util(class_name):
    return {
        'class': class_name
    }

PRODUCT_NAME_PRIMARY_CLASSNAME = 'ProductName-primary'
PRODUCT_GENDER_STYLES_CLASSNAME = 'ProductGenderStyles ProductGenderStyles--inProductCard'
PRODUCT_PRICE_CLASSNAME = 'ProductPrice'
PRODUCT_RELEAE_DATE_CLASSNAME = 'ProductReleaseDate'

class ProductContainer:
    def __init__(self, soup):
        self.soup = soup

    def get_product_id(self):
        url = self.get_release_page_url()
        # format: href="/en/release-dates/jordan/64966111.html"
        idHtml = url.split('/')[-1]
        return idHtml.split('.')[0]

    def get_img_src(self):
        return self.soup.img['src']
    
    def get_release_page_url(self):
        href = self.soup.a['href']
        return f'https://www.footlocker.ca{href}'
    
    def get_product_name(self):
        span = self.soup.find('span', create_class_atr_util(PRODUCT_NAME_PRIMARY_CLASSNAME))
        return span.text

    def get_product_gender(self):
        p = self.soup.find('p', create_class_atr_util(PRODUCT_GENDER_STYLES_CLASSNAME))
        spans = p.find_all('span', recursive=False)
        return spans[0].text.split(':')[1]
    
    def get_product_style(self):
        p = self.soup.find('p', create_class_atr_util(PRODUCT_GENDER_STYLES_CLASSNAME))
        spans = p.find_all('span', recursive=False)
        return spans[1].text.split(':')[1]
    
    def get_price(self):
        div = self.soup.find('div', create_class_atr_util(PRODUCT_PRICE_CLASSNAME))
        span = div.find('span')
        return span.text.replace('$', '').strip()
    
    def get_release_date_timestamp(self):
        span = self.soup.find('span', create_class_atr_util(PRODUCT_RELEAE_DATE_CLASSNAME))
        date = span.text.split(':')[1]
        date_with_year = date + f' {datetime.now().year}'
        dt = datetime.strptime(date_with_year, "%b %d %Y")
        timestamp = int(dt.timestamp())
        return timestamp
        
    def get_data_as_csv_row(self):
        return ','.join([
            self.get_product_id(),
            self.get_product_gender(),
            self.get_product_style(),
            self.get_price(),
            str(self.get_release_date_timestamp()),
            self.get_release_page_url(),
            self.get_img_src(),
        ])
