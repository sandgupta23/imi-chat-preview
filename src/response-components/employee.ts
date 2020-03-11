import {ESourceType} from "../typings/send-api";
import {convertStringToDom, getQueryStringValue} from "../utility";
import {convertToLink} from "./link";

export class EmployeeReply {
    constructor(private employee) {
    }

    getRows(small_card_description) {
        const rowHtmlStr = Object.keys(small_card_description).map((key) => {
            const val = small_card_description[key];
            return `
                <div class="row">
                    <div class="col-key">
                    <div>${key}:</div>
</div>
                    <div class="col-value"><div>
                    ${val}
</div></div>
                </div>
            `
        }).join('');
        return `
<!--            <div class="row-title">Organization</div>-->
            ${rowHtmlStr}
        `
    }

    getTemplate(text?, source?: ESourceType, bodyKey?: string[], txn?, employee?, isModal?) {
        // let employee: any = this.employee;
        // employee = {
        //     ...employee,
        //     ...employee.remaining_parameters
        // };
        const isPhone = getQueryStringValue('phonecasing');
        const htmlStr = `
                <div class="employee-card shadow-theme ${isPhone === 'true' ? 'view-phone' : ''}" ${isModal === 'true' ? 'view-modal' : ''}">
                        <div class="employee-card-header">
                            <div class="pic">
                                <img src="https://imibot-dev.s3.amazonaws.com/default/defaultbotlogo.png" alt="">
                            </div>
                            <div class="header-info">
                                <div class="title">${employee.header.name}</div>
                                <div class="description">${employee.header.jobtitle}</div>
                            </div>
                         </div>
                        <div class="employee-card-body">
                            ${bodyKey.map((key) => this.getModalBlockForKey(employee, key)).join('')}
                        </div>
                        <div class="employee-card-footer">
                                <button data-txn="${txn}" class="open-modal" rel="modal:open" class="open-modal">More Info</button>
                        </div>
                    </div>
                
            `;
        return htmlStr;
    }

    getModalBlockForKey(employee, key) {
        return `<div class="info">
<h1 class="info-title" style="display: none">${key}</h1>
                                        ${this.getRows(employee[key])}
                                </div>`
    }

    getElement(text?, source?: ESourceType, bodyKey?: string[], txn, employee?, isModal) {
        const str = this.getTemplate(text, source, bodyKey, txn, employee, isModal);
        return convertStringToDom(str);
    }
}
