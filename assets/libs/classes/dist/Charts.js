class Chart {


    #chart;
    #mount;
    #type;
    #opts;
    #dataset;
    get #config() {
        return this.#GetConfig(this.#type, this.#opts);
    }
    get #data() {
        return this.#getData(this.#type, this.#dataset);
    }
    #extraCode = '';

    get Chart() { return this.#chart; }

    get #code() {
        return this.#extraCode + '\n' + this.additionalJs;
    }

    get JS() {
        let output = 'const Chart = ';

        switch (this.#type) {
            case 'line':
            case 'area-1':
            case 'area-2':
                output += 'new Chartist.Line(';
                break;
            case 'bars':
                output += 'new Chartist.Bar(';
                break;
            case 'gauge':
                output += 'new Gauge(';

        }

        let selector = '';
        if (this.#mount.id != '') {
            selector = '#' + this.#mount.id;
        } else {
            let arr = this.#mount.className.split(' ');
            selector = arr.map(e => '.' + e).join(' ');
        }
        if (this.#type == 'gauge') output += `$('${selector}')[0], \n`;
        else output += `'${selector}', \n`;

        if (this.#type != 'gauge') {
            output += JSON.stringify(this.#data, null, 4);
            output += ",\n";
        }

        let config = this.#config;
        if (this.#type != 'gauge') config.plugins = ['Chartist.plugins.tooltip()'];
        config = JSON.stringify(config, null, 4);
        output += config.replace(/\"/g, "");

        output += ')' + this.#code;

        return output;
    }


    constructor(type, mount, dataset, opts = {}) {
        this.#type = type;
        this.#mount = mount;
        this.#dataset = dataset;
        this.#opts = opts;
        this.additionalJs = '';

        $(dataset).change(this.#OnDatasetChange.bind(this));

        this.#Bulid(type, mount, this.#data, this.#config);
    }

    #Bulid(type, mount, data, config) {
        switch (type) {
            case 'line':
                this.#chart = new Chartist.Line(mount, data, config);
                break;
            case 'area-1':
                this.#chart = new Chartist.Line(mount, data, config);
                break;
            case 'area-2':
                this.#chart = new Chartist.Line(mount, data, config);
                break;
            case 'bars':
                this.#chart = new Chartist.Bar(mount, data, config).on('draw', function (d) {
                    if (d.type === 'bar') {
                        d.element.attr({
                            style: 'stroke-width: ' + 100 / (data.series[0].length + 2) + '%'
                        });
                    }
                });
                this.#extraCode = `.on('draw', function(d) {
                    if(d.type === 'bar') {
                        d.element.attr({
                            style: 'stroke-width: ' + 100 / (data.series[0].length+2)  + '%'
                        });
                    }
                })`;
                break;
            case 'gauge': {
                this.#chart = new Gauge(mount).setOptions(config);
                this.#chart.maxValue = data.max;
                this.#chart.setMinValue(data.min);
                this.#chart.animationSpeed = 45;
                this.#chart.set(data.current);
                this.#extraCode = `
Chart.maxValue = ${data.max};
Chart.setMinValue(${data.min});
Chart.animationSpeed = 45;
Chart.set(${data.current});
                `;

            }
        }
    }

    #getData(t, d) {
        switch (t) {
            case 'line':
            case 'area-1':
            case 'area-2':
            case 'bars':
                return {
                    labels: [...d.dataset.keys()],
                    series: [d.dataset]
                }
            case 'gauge':
                var max = d.dataset.length * 100
                var min = d.dataset.reduce((a, b) => a < 0 ? a : (b < 0 ? b : 0));
                var curr = d.dataset.reduce((a, b) => a + b);
                return {
                    max: max,
                    min: min,
                    current: curr,
                    dataLenght: d.dataset.length
                }
        }
    }

    #GetConfig(type, opts) {

        switch (type) {
            case 'line':
                return {
                    showArea: false,
                    showPoint: false,
                    fullWidth: true,
                    lineSmooth: Chartist.Interpolation.monotoneCubic(),
                    plugins: [Chartist.plugins.tooltip()], // As this is axis specific we need to tell Chartist to use whole numbers only on the concerned axis
                    axisY: {
                        onlyInteger: true,
                        offset: 0,

                        showLabel: false,
                        showGrid: false,

                    },
                    axisX: {
                        offset: 0,
                        showLabel: false,
                        showGrid: false,
                    },
                }


            case 'area-1':
                return {
                    showArea: true,
                    showPoint: false,
                    fullWidth: true,
                    lineSmooth: Chartist.Interpolation.simple(),
                    plugins: [Chartist.plugins.tooltip()], // As this is axis specific we need to tell Chartist to use whole numbers only on the concerned axis
                    axisY: {
                        onlyInteger: true,
                        showLabel: false,
                        showGrid: false,
                        offset: 0,

                    },
                    axisX: {
                        offset: 0,
                        showLabel: false,
                        showGrid: false,
                    },
                }

            case 'area-2':
                return {
                    showArea: true,
                    showPoint: true,
                    fullWidth: true,
                    lineSmooth: Chartist.Interpolation.none(),
                    plugins: [Chartist.plugins.tooltip()], // As this is axis specific we need to tell Chartist to use whole numbers only on the concerned axis
                    axisY: {
                        offset: 0,
                        onlyInteger: true,
                        showLabel: false,
                        showGrid: false,

                    },
                    axisX: {
                        offset: 0,
                        showLabel: false,
                        showGrid: false,
                    },
                }

            case 'bars':
                return {
                    plugins: [Chartist.plugins.tooltip()], // As this is axis specific we need to tell Chartist to use whole numbers only on the concerned axis
                    axisX: {
                        offset: 0,
                        showLabel: false,
                        showGrid: false,
                    },
                    axisY: {
                        offset: 0,
                        showLabel: false,
                        showGrid: false,

                    },
                }
            case 'gauge':
                return {
                    angle: 0, // The span of the gauge arc
                    lineWidth: 0.2, // The line thickness
                    radiusScale: 0.7, // Relative radius
                    pointer: {
                        length: 0.64, // // Relative to gauge radius
                        strokeWidth: 0.04, // The thickness
                        color: "#000000", // Fill color
                    },
                    limitMax: false, // If false, the max value of the gauge will be updated if value surpass max
                    limitMin: false, // If true, the min value of the gauge will be fixed unless you set it manually
                    colorStart: opts.color, // Colors
                    colorStop: opts.color, // just experiment with them
                    strokeColor: "#E0E0E0", // to see which ones work best for you
                    generateGradient: true,
                    highDpiSupport: true, // High resolution support
                };
        }
    }

    #OnDatasetChange = function (e) {

        var t = this.#data.dataLenght === e.dataset.length;
        this.#dataset = e;

        if (this.#type != 'gauge') {
            this.#chart.update(this.#data);
        } else {
            if (t) {
                this.#chart.set(this.#data.current)
            } else {
                this.#Bulid(this.#type, this.#mount, this.#data, this.#config);
            }
        }


    }
}
