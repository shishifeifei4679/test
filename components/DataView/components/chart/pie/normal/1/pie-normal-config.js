const source = [
    ['dimension', '图例'],
    ['直接访问', '335'],
    ['邮件营销', '310'],
    ['联盟广告', '274'],
    ['视频广告', '235'],
    ['搜索引擎', '400'],
];
const PieNormalConfig = function () {
    this.config = {
        x: 0,
        y: 0,
        width: 350,
        height: 250,
        chartName: '标准饼图',
        chartType: 'PieNormal',
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
            name: 'name',
            value: 'value',
            sql: 'select * from pie_normal',
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
                text: '标准饼图',
                x: 'center',
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
            tooltip: {
                trigger: 'item',
            },
            series: [
                {
                    type: 'pie',
                    center: ['50%', '50%'],
                    radius: [0, '70%'],
                    roseType: false,
                    label: {},
                    labelLine: {},
                },
            ],
        },
    };
};

const getPieNormalConfig_1 = function () {
    return new PieNormalConfig().config;
};

export { getPieNormalConfig_1 };
