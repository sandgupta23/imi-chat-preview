import {ESourceType} from "../typings/send-api";
import {convertStringToDom} from "../utility";
import {convertToLink} from "./link";
import {Line} from "./high-charts-types/line";
import {Bar} from "./high-charts-types/bar";
import {Annotation} from "./high-charts-types/annotation";
import {SparkLineChart} from "./high-charts-types/spark-line-chart";
import {LineTimeSeries} from "./high-charts-types/line-time-series";
import {LiveData} from "./high-charts-types/live-data";
import {ColumnStackingGrouping} from "./high-charts-types/column-stacking-grouping";

export class HighChart {
    static chatTypes = {
        line: {
            key: 'line',
            className: Line,
        }, bar: {
            key: 'bar',
            className: Bar,
        }, annotation: {
            key: 'annotation',
            className: Annotation,
        }, SparkLineChart: {
            key: 'SparkLineChart',
            className: SparkLineChart,
        }, LineTimeSeries: {
            key: 'LineTimeSeries',
            className: LineTimeSeries,
        },/* LiveData: {
            key: 'LiveData',
            className: LiveData,
        },*/ ColumnStackingGrouping: {
            key: 'ColumnStackingGrouping',
            className: ColumnStackingGrouping,
        },
    };
    chart;

    constructor(private message, private readonly type) {
        this.type = this.type.split("__").join('');
        Object.keys(HighChart.chatTypes).forEach((key) => {
            if (this.type === key) {
                const className = ((HighChart.chatTypes[key]).className);
                this.chart = new className();
            }
        });
    }

    getElement(quick_reply, source?: ESourceType) {
        const str = this.getTemplate(quick_reply, source);
        return convertStringToDom(str);
    }

    getTemplate(quick_reply, source?: ESourceType) {
        return this.chart.getTemplate(source);
    }

    createQuickReplyButtons(quick_reply) {
        let str = "";
        quick_reply.quick_replies.forEach((quick_reply) => {
            str = str + `<button data-payload="${quick_reply.payload}">${quick_reply.title}</button>`
        });

        return str;
    }

    runScript(el) {
        this.chart.runScript(el);
    }

}
