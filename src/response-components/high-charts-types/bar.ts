import {ESourceType} from "../../typings/send-api";

export class Bar {
    getTemplate(source){
        const htmlStr = `
                <div class="message-wrapper ${source === ESourceType.human ? 'message-wrapper-human' : ''}">
                    <figure class="highcharts-figure">
                        <div id="container"></div>
                        <p class="highcharts-description">
                            Basic line chart showing trends in a dataset. This chart includes the
                            <code>series-label</code> module, which adds a label to each line for
                            enhanced readability.
                        </p>
                    </figure>
                </div>
               
            `;
        return htmlStr;
    }
    runScript(el){
        Highcharts.chart(el, {
            chart: {
                type: 'bar'
            },
            title: {
                text: 'Stacked bar chart'
            },
            xAxis: {
                categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Total fruit consumption'
                }
            },
            legend: {
                reversed: true
            },
            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },
            series: [{
                name: 'John',
                data: [5, 3, 4, 7, 2]
            }, {
                name: 'Jane',
                data: [2, 2, 3, 2, 1]
            }, {
                name: 'Joe',
                data: [3, 4, 4, 2, 5]
            }]
        });
    }
}
