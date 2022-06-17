import { LightningElement, api } from 'lwc';

export default class ShoppingCartProduct extends LightningElement {

    _product;
    @api
    get product() {
        return this._product;
    }
    set product(value) {
        this._product = value;
        this.name = value.Name;
        this.price = value.Product_price__c
    }
    
    name;
    price;
}