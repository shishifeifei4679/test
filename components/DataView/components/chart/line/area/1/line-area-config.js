const source = [
    ['dimension', '图例'],
    ['周一', '120'],
    ['周二', '132'],
    ['周三', '101'],
    ['周四', '134'],
    ['周五', '90'],
    ['周六', '230'],
    ['周日', '210'],
];
const LineAreaConfig = function () {
    this.config = {
        x: 0,
        y: 0,
        width: 350,
        height: 250,
        chartName: '标准折线面积图',
        chartType: 'LineArea',
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
            name: 'x',
            value: 'y',
            sql: 'select * from line_normal',
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
                show: true,
                text: '标准折线面积图',
                left: 'center',
                textStyle: {
                    color: '#ffffff',
                },
            },
            tooltip: {
                trigger: 'axis',
                // axisPointer: { type: 'cross' },
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

const getLineAreaConfig_1 = function () {
    return new LineAreaConfig().config;
};

export { getLineAreaConfig_1 };
