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
const ScatterNormalConfig = function () {
    this.config = {
        x: 0,
        y: 0,
        width: 350,
        height: 250,
        chartName: '',
        chartType: 'ScatterNormal',
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
            sql: 'select * from scatter_normal',
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
            tooltip: {
                trigger: 'axis',
                // axisPointer: { type: 'cross' },
            },
            title: {
                show: true,
                text: '气泡散点图',
                left: 'center',
                textStyle: {
                    color: '#ffffff',
                },
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

const getScatterNormalConfig_1 = function () {
    return new ScatterNormalConfig().config;
};

export { getScatterNormalConfig_1 };
