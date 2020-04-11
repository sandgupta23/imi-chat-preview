import {ESourceType} from "../../typings/send-api";

export class LineTimeSeries {
    getTemplate(source) {
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

    runScript(el) {
        Highcharts.getJSON(
            'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/usdeur.json',
            function (data) {

                Highcharts.chart('container', {
                    chart: {
                        zoomType: 'x'
                    },
                    title: {
                        text: 'USD to EUR exchange rate over time'
                    },
                    subtitle: {
                        text: document.ontouchstart === undefined ?
                            'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
                    },
                    xAxis: {
                        type: 'datetime'
                    },
                    yAxis: {
                        title: {
                            text: 'Exchange rate'
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        area: {
                            fillColor: {
                                linearGradient: {
                                    x1: 0,
                                    y1: 0,
                                    x2: 0,
                                    y2: 1
                                },
                                stops: [
                                    [0, Highcharts.getOptions().colors[0]],
                                    [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                                ]
                            },
                            marker: {
                                radius: 2
                            },
                            lineWidth: 1,
                            states: {
                                hover: {
                                    lineWidth: 1
                                }
                            },
                            threshold: null
                        }
                    },

                    series: [{
                        type: 'area',
                        name: 'USD to EUR',
                        data: data
                    }]
                });
            }
        );
    }
}
