import { LightningElement, api, wire } from 'lwc';

import { publish, subscribe, MessageContext } from 'lightning/messageService';
import PRODUCTS_FILTERED_MESSAGE from '@salesforce/messageChannel/FiltersMessage__c';

import getSCP from '@salesforce/apex/ProductController.getShoppingCartProducts';

export default class ShoppingCart extends LightningElement {
    
    @api searchBarIsVisible;

    @api tilesAreDraggable = false;

    filters = {};

    @wire(MessageContext) messageContext;

    productFilterSubscription;

    @wire(getSCP, { filters: '$filters' })
    products;

    connectedCallback() {
        this.productFilterSubscription = subscribe(
            this.messageContext,
            PRODUCTS_FILTERED_MESSAGE,
            (message) => this.handleFilterChange(message)
        );
    }

    handleSearchKeyChange(event) {
        this.filters = {
            searchKey: event.target.value.toLowerCase()
        };
    }

    handleFilterChange(message) {
        this.filters = { ...message.filters };
    }
}