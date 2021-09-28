class Chart {


    #chart;
    #type;
    #mount;
    #config;
    #data;
    #extraCode = '';

    get JS() {
        let output = '';

        switch(this.#type) {
            case 'line':
            case 'area-1':
            case 'area-2':
                output += 'new Chartist.Line(';
                break;
            case 'bars' :
                output += 'new Chartist.Bar(';
                break;
        }

        let selector  = '';
        if(this.#mount.id != '') {
            selector = '#'+this.#mount.id;
        } else {
            let arr = this.#mount.className.split(' ');
            selector = arr.map(e => '.'+e).join(' ');
        }

        output += `'${selector}', \n`;

        
        output += JSON.stringify(this.#data, null, 4);
        output += ",\n";
        
        let config = this.#config;
        config.plugins = ['Chartist.plugins.tooltip()'];
        config = JSON.stringify(config, null, 4);
        output += config.replace(/\"/g, "");

        output += ')' + this.#extraCode;

        return output;
    }


    constructor(type, mount, dataset) {
        this.#type = type;
        $(dataset).change(this.#OnDatasetChange.bind(this));
        this.#mount = mount;
        this.#data = {
            labels: [...dataset.dataset.keys()],
            series: [dataset.dataset]
        }

        this.#config = this.#GetConfig(type);
        this.#Bulid(type, mount, this.#data, this.#config);
    }

    #Bulid(type, mount, data, config) {
        switch(type) {
            case 'line' :
                this.#chart = new Chartist.Line(mount, data, config);
                break;
            case 'area-1' :
                this.#chart = new Chartist.Line(mount, data, config);
                break;
            case 'area-2' :
                this.#chart = new Chartist.Line(mount, data, config);
                break;
            case 'bars' :
                this.#chart = new Chartist.Bar(mount, data, config).on('draw', function(d) {
                    if(d.type === 'bar') {
                        d.element.attr({
                            style: 'stroke-width: ' + 100 / (data.series[0].length+1)  + '%'
                        });
                    }
                });
                this.#extraCode = `.on('draw', function(d) {
                    if(d.type === 'bar') {
                        d.element.attr({
                            style: 'stroke-width: ' + 100 / (data.series[0].length+1)  + '%'
                        });
                    }
                })`;
                break;
        }
    }

    #GetConfig(type) {

        switch(type) {
            case 'line' :
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
                
            
            case 'area-1' :
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
    
            case 'area-2' :
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
        
            case 'bars' : 
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
                
        }
    }

    #OnDatasetChange = function(e) {
        const data = {
            labels: [...e.dataset.keys()],
            series: [e.dataset]
        }
        this.#data= data;
        this.#chart.update(data);
    }
}
