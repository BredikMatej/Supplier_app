import { LightningElement, api } from 'lwc';

export default class ProductBox extends LightningElement {

    _product;
    
    @api
    get product() {
        return this._product;
    }
    set product(value) {
        this._product = value;
        this.pictureUrl = value.Product_Image_Link__c;
        this.name = value.Name;
        this.price = value.Product_price__c;
        this.brand = value.Brand__c
    }

    pictureUrl;
    name;
    price;
    brand;

}