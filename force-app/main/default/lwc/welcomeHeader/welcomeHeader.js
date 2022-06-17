import { LightningElement, wire } from 'lwc';
import Id from '@salesforce/user/Id';
import { getRecord } from 'lightning/uiRecordApi';
import UserNameFld from '@salesforce/schema/User.Name';

export default class welcomeHeader extends LightningElement {
    time="";
    userId = Id;
    currentUserName;
    @wire(getRecord, { recordId: Id, fields: [UserNameFld]}) 
    userDetails({error, data}) {
        if (data) {
            this.currentUserName = data.fields.Name.value;
        } else if (error) {
            this.error = error ;
        }
    }
    connectedCallback() {
        this.getTime();
    
        setInterval(() => {
          this.getTime();
        }, 1000 * 5);
      }
    getTime(){
        const date = new Date();
        const hour = date.getHours();
        const min = date.getMinutes();

        this.time = `${this.getHour(hour)}:${this.getDoubleDigit(min)}`;
    }
    getHour(hour){
        return hour;
    }
    getDoubleDigit(digit){
        return digit < 10 ? "0" + digit : digit;
    }
}