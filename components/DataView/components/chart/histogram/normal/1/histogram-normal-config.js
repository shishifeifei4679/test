const source = [
    ['dimension', '测试'],
    ['周一', '120'],
    ['周二', '132'],
    ['周三', '101'],
    ['周四', '134'],
    ['周五', '90'],
    ['周六', '230'],
    ['周日', '210'],
];
const HistogramNormalConfig = function () {
    this.config = {
        x: 0,
        y: 0,
        width: 350,
        height: 250,
        chartName: '标准柱状图',
        chartType: 'HistogramNormal',
        chartVersion: 1,
        rotate: 0,
        show: 'true',
        lock: 'false',
        choose: 'false',
        refresh: 'false',
        chartData: {
            dataSourceType: '',
            staticData: JSON.stringify({ source }),
            database: '',
            dimension: '无',
            name: 'product',
            value: 'amount',
            sql: 'select * from histogram_normal',
            restType: 'GET',
            restUrl: '',
            restHeader: '',
            restBody: '',
            fileName: '',
        },
        data: {
            source,
        },
        interval: 8000,
        option: {
            title: {
                text: '标准柱状图',
                left: 'center',
                textStyle: { color: '#fff' },
            },
            tooltip: {
                trigger: 'item',
            },
            legend: {
                show: false,
                textStyle: {
                    color: '#ffffff',
                },
            },
            grid: {
                left: '10%',
                top: '60',
                right: '10%',
                bottom: '60',
            },
            xAxis: {
                show: true,
                type: 'category',
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#ffffff',
                    },
                },
                axisLabel: {
                    show: true,
                    color: '#ffffff',
                },
                axisTick: {
                    show: false,
                },
                splitLine: {
                    show: false,
                    lineStyle: {
                        color: ['#cccccc'],
                    },
                },
                splitArea: {},
            },
            yAxis: {
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#ffffff',
                    },
                },
                axisLabel: {
                    show: true,
                    color: '#ffffff',
                },
                axisTick: {
                    show: false,
                },
                splitLine: {
                    show: false,
                    lineStyle: {
                        color: ['#cccccc'],
                    },
                },
                splitArea: {},
            },
            series: [],
        },
    };
};

const getHistogramNormalConfig_1 = function () {
    return new HistogramNormalConfig().config;
};

export { getHistogramNormalConfig_1 };
