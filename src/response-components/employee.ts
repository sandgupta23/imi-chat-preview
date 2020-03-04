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

    getTemplate(text?, source?: ESourceType, bodyKey?: string[], txn?) {
        const employee = this.employee;
        const isPhone = getQueryStringValue('phonecasing');
        debugger;
        const htmlStr = `
                <div class="employee-card shadow-theme ${isPhone === 'true'?'view-phone':''}">
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
                            <div class="info">
                                    ${bodyKey.map((key) => this.getRows(employee[key])).join('')}
                            </div>
                        </div>
                        <div class="employee-card-footer">
                                <button data-txn="${txn}" class="open-modal" rel="modal:open" class="open-modal">More Info</button>
                        </div>
                    </div>
                
            `;
        return htmlStr;
    }

    getElement(text?, source?: ESourceType, bodyKey?: string[], txn) {
        const str = this.getTemplate(text, source, bodyKey, txn);
        return convertStringToDom(str);
    }
}
