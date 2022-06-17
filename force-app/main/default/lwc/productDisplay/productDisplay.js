import { LightningElement, wire, api} from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

import NAME from '@salesforce/schema/Product__c.Name';
import PRICE from '@salesforce/schema/Product__c.Product_price__c';
import BRAND from '@salesforce/schema/Product__c.Brand__c';
import IMAGE_LINK from '@salesforce/schema/Product__c.Product_Image_Link__c';
import DESCRIPTION from '@salesforce/schema/Product__c.Product_description__c';

const FIELDS = [NAME, PRICE, BRAND, IMAGE_LINK, DESCRIPTION];

export default class ProductDisplay extends LightningElement {
    @api recordId;
    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    product;
    get name() {
        return getFieldValue(this.product.data, NAME);
    }
    get price() {
        return getFieldValue(this.product.data, PRICE);
    }
    get brand(){
        return getFieldValue(this.product.data, BRAND);
    }
    get desc() {
        return getFieldValue(this.product.data, DESCRIPTION);
    }
    get imgLink() {
        return getFieldValue(this.product.data, IMAGE_LINK);
    }
    
}