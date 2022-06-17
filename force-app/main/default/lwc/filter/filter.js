import { LightningElement, wire } from 'lwc';

import { publish, MessageContext } from 'lightning/messageService';
import PRODUCTS_FILTERED_MESSAGE from '@salesforce/messageChannel/FiltersMessage__c';

const DELAY = 350;

export default class Filter extends LightningElement {
    searchKey = '';
    maxPrice = 5000;

    filters = {
        searchKey: '',
        maxPrice: 5000
    };

    @wire(MessageContext)
    messageContext;

    handleSearchKeyChange(event) {
        this.filters.searchKey = event.target.value;
        this.delayedFireFilterChangeEvent();
    }

    handleMaxPriceChange(event) {
        const maxPrice = event.target.value;
        this.filters.maxPrice = maxPrice;
        this.delayedFireFilterChangeEvent();
    }

    delayedFireFilterChangeEvent() {
        window.clearTimeout(this.delayTimeout);
        this.delayTimeout = setTimeout(() => {
            publish(this.messageContext, PRODUCTS_FILTERED_MESSAGE, {
                filters: this.filters
            });
        }, DELAY);
    }
}