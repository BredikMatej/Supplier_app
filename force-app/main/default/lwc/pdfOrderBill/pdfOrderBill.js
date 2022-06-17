import { LightningElement, wire, api, track } from 'lwc';
import { getFieldValue, getRecord } from 'lightning/uiRecordApi';

import pdflib from "@salesforce/resourceUrl/pdflib";
import { loadScript } from "lightning/platformResourceLoader";

import NAME from '@salesforce/schema/Order__c.Name';
import CUSTOMER from '@salesforce/schema/Order__c.Customer__c';
import LIST from '@salesforce/schema/Order__c.List_of_products__c';
import DATE from '@salesforce/schema/Order__c.Order_date__c';
import CUSTOMER_NAME from '@salesforce/schema/Order__c.Customer_full_name__c';
import CUSTOMER_ADDRESS from '@salesforce/schema/Order__c.Customer_address__c';
import CUSTOMER_EMAIL from '@salesforce/schema/Order__c.Customer_email__c';


const FIELDS = [NAME, CUSTOMER, LIST, DATE, CUSTOMER_NAME, CUSTOMER_ADDRESS, CUSTOMER_EMAIL];

export default class PdfOrderBill extends LightningElement {

  @api recordId;

  @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
  order;

  renderedCallback() {
    loadScript(this, pdflib).then(() => { });
  }

  async createPdf() {
    const pdfDoc = await PDFLib.PDFDocument.create();
    const timesRomanFont = await pdfDoc.embedFont(
      PDFLib.StandardFonts.TimesRoman
    );

    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const fontSize = 30;
    page.drawText("Invoice", {
      x: 50,
      y: height - 4 * (fontSize * 1.2),
      size: fontSize * 1.2,
    });

    page.drawText("Suplier App", {
      x: 400,
      y: height - 4 * fontSize,
      size: fontSize * 0.8,
    });

    page.drawText("Hlavná ulica 5", {
      x: 400,
      y: height - 7 * (fontSize * 0.7),
      size: fontSize * 0.6,
    });
    page.drawText("915 01", {
      x: 400,
      y: height - 8 * (fontSize * 0.7),
      size: fontSize * 0.6,
    });
    page.drawText("Bratislava 9", {
      x: 400,
      y: height - 9 * (fontSize * 0.7),
      size: fontSize * 0.6,
    });
    page.drawText("Slovensko", {
      x: 400,
      y: height - 10 * (fontSize * 0.7),
      size: fontSize * 0.6,
    });


    page.drawText("Invoice # ", {
      x: 300,
      y: height - 13 * (fontSize * 0.7),
      size: fontSize * 0.6,
    });

    page.drawText("Order date ", {
      x: 300,
      y: height - 14 * (fontSize * 0.7),
      size: fontSize * 0.6,
    });

    page.drawText("Due date ", {
      x: 300,
      y: height - 15 * (fontSize * 0.7),
      size: fontSize * 0.6,
    });
    page.drawText("" + this.order.data.fields.Name.value + "", {
      x: 400,
      y: height - 13 * (fontSize * 0.7),
      size: fontSize * 0.6,
    });

    page.drawText("" + this.order.data.fields.Order_date__c.value + "", {
      x: 400,
      y: height - 14 * (fontSize * 0.7),
      size: fontSize * 0.6,
    });
    let dueDate = new Date("" + this.order.data.fields.Order_date__c.value + "")
    dueDate.setDate(dueDate.getDate() + 14);
    let mounthZero = "";
    let dateZero = "";
    if (dueDate.getMonth() + 1 < 10)
      mounthZero = "0";
    if (dueDate.getDate() + 1 < 10)
      dateZero = "0";
    page.drawText("" + dueDate.getFullYear() + "-" + mounthZero + "" + (dueDate.getMonth() + 1) + "-" + dateZero + "" + dueDate.getDate() + "", {
      x: 400,
      y: height - 15 * (fontSize * 0.7),
      size: fontSize * 0.6,
    });

    page.drawText("Billed To", {
      x: 50,
      y: height - 13 * (fontSize * 0.7),
      size: fontSize * 0.6,
    });
    page.drawText("" + this.order.data.fields.Customer_full_name__c.value + "", {
      x: 50,
      y: height - 16 * (fontSize * 0.6),
      size: fontSize * 0.5,
    });
    let address = "" + this.order.data.fields.Customer_address__c.value + ""
    const parts = address.split(",")
    for (let i = 0; i < parts.length; i++) {
      page.drawText("" + parts[i].trim() + "", {
        x: 50,
        y: height - (17 + i) * (fontSize * 0.6),
        size: fontSize * 0.5,
      });
    }

    page.drawLine({
      start: { x: 50, y: 463 },
      end: { x: 530, y: 463 },
      thickness: 2,
      opacity: 1,
    })

    page.drawText("Description", {
      x: 50,
      y: height - 13.6 * fontSize,
      size: fontSize * 0.7,
    });
    page.drawText("Unit price", {
      x: 230,
      y: height - 13.6 * fontSize,
      size: fontSize * 0.7,
    });
    page.drawText("QTY", {
      x: 350,
      y: height - 13.6 * fontSize,
      size: fontSize * 0.7,
    });
    page.drawText("Amount", {
      x: 420,
      y: height - 13.6 * fontSize,
      size: fontSize * 0.7,
    });

    page.drawLine({
      start: { x: 50, y: 420 },
      end: { x: 530, y: 420 },
      thickness: 2,
      opacity: 1,
    })

    let allProductsStr = ""+ this.order.data.fields.List_of_products__c.value +"";
    const allProducts = allProductsStr.split(",");
    let subtotal = 0;
    let amount = 0;
    let euro = ""
    for (let i = 0; i < allProducts.length; i++){
      var productToAdd = allProducts[i].split(":");
      let space = 0;
      for(let j = 0; j< productToAdd.length+1; j++){
        if(j==1){
          space = 180;
          euro = " €";
        }
        if(j==2){
          space = 300;
          euro = "";
        }
        if(j==3){
          space = 370;
          euro = "";
        }
        if(j<3){          
          page.drawText("" + productToAdd[j].trim() + "" + euro, {
            x: 50+space,
            y: height - (17.5 + i) * (fontSize * 0.85),
            size: fontSize * 0.6,
          });
        }
        else{
          amount = parseFloat(productToAdd[1]) * parseFloat(productToAdd[2]);
          page.drawText(""+ amount.toFixed(2)+" €", {
            x: 50+space,
            y: height - (17.5 + i) * (fontSize * 0.85),
            size: fontSize * 0.6,
          });
        }
      }
      subtotal += amount;
    }

    page.drawText("Total", {
      x: 280,
      y: height - (16.6 + allProducts.length) * fontSize,
      size: fontSize * 0.7,
    });
    page.drawText("Tax (20%)", {
      x: 280,
      y: height - (15.6 + allProducts.length) * fontSize,
      size: fontSize * 0.7,
    });
    page.drawText(""+subtotal.toFixed(2)+" €", {
      x: 400,
      y: height - (16.6 + allProducts.length) * fontSize,
      size: fontSize * 0.7,
    });
    page.drawText(""+ (subtotal*0.2).toFixed(2) +" €", {
      x: 400,
      y: height - (15.6 + allProducts.length) * fontSize,
      size: fontSize * 0.7,
    });

    page.drawLine({
      start: { x: 50, y: 800 },
      end: { x: 530, y: 800 },
      thickness: 2,
      opacity: 1,
    })
    page.drawLine({
      start: { x: 50, y: 50 },
      end: { x: 530, y: 50 },
      thickness: 2,
      opacity: 1,
    })

    const pdfBytes = await pdfDoc.save();
    this.saveByteArray("Invoice " + this.order.data.fields.Name.value + "", pdfBytes);
  }

  saveByteArray(pdfName, byte) {
    var blob = new Blob([byte], { type: "application/pdf" });
    var link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    var fileName = pdfName;
    link.download = fileName;
    link.click();
  }
}