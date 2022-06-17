import { LightningElement } from 'lwc';
import { NavigationMixin} from 'lightning/navigation'

export default class QuickCreate extends NavigationMixin(LightningElement) {

    newOrder(){
        this[NavigationMixin.Navigate]({
            type: "standard__objectPage",
            attributes: {
                objectApiName: "Order__c",
                actionName: "new"
            }
        });
    }
    newCustomer(){
        this[NavigationMixin.Navigate]({
            type: "standard__objectPage",
            attributes: {
                objectApiName: "Customer__c",
                actionName: "new"
            }
        });
    }
}