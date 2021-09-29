class Tile {

    type = 'tile';
    OuterHTML

    Chart;

    set #title(val) {
        this.#SetText(this._title, val);
    }
    _title

    set #size(val) {
        this._size[0].className = val;
        this.#chart = this.#chartType;
    }
    _size;
    
    set color(val) {
        this._color.attr('style','background-color:'+val+'!important');
    }
    _color;

    set #icon(val) {
        this._icon[0].className = val;
    }
    _icon

    set #subtitle(val) {
        this.#SetText(this._subtitle, val);
    }
    _subtitle

    set #unit(val) {
        this.#unit_p = val;
        this.#SetText(this._unit, this.SetUnit(this.#unit_v, this.#unit_p));
    }
    #unit_p;
    set #unitValue(val) {
        this.#unit_v = val;
        this.#SetText(this._unit, this.SetUnit(this.#unit_v, this.#unit_p));
    }
    #unit_v;
    _unit;

    set #chart(val) {
        this.#chartType = val;
        this.Chart = new Chart(val, this._chart[0], this.#_dataset);
    }
    _chart;
    #_dataset;
    #chartType;

    constructor(
        fn = null,
        titleInputSelector = '#optionTitleValue',
        sizeInputSelector = '#sizeOptionInput',
        colorInputSelector = '#colorValue',
        iconInputSelector = '#choseIcon',
        subtitleInputSelector = '#optionSubtitleValue',
        unitInputSelector = '#optionUnitValue',
        chartInputSelector ='#optionChartValue',
        dataset = datasetList[0],
        mountSelector = '#output',
    ) {
        
        if(typeof(fn) == 'function') fn.call(this);

        const instance = this;
        var evt = $.Event('change');
        evt.value = this;

        this.#_dataset = dataset;
        $(mountSelector)[0].innerHTML = '';

        $(titleInputSelector).change(function () {
            instance.#title = this.value;
            $(instance).trigger(evt);
        });
        $(sizeInputSelector).change(function (e) {
            instance.#size = e.value;
            $(instance).trigger(evt);

        });
        $(colorInputSelector).on('changeColor',function (e) {
            instance.color = e.value;
            $(instance).trigger(evt);
        });
        $(iconInputSelector).change(function () {
            instance.#icon = this.className;
            $(instance).trigger(evt);
        });
        $(subtitleInputSelector).change(function () {
            instance.#subtitle = this.value;
            $(instance).trigger(evt);
        });
        $(unitInputSelector).change(function () {
            instance.#unit = this.value;
            $(instance).trigger(evt);
        });
        $(chartInputSelector).change(function () {
            instance.#chart = this.value;
            $(instance).trigger(evt);
        });
        $(dataset).change(function (e) {
            instance.#unitValue = instance.UnitValue(e);
            $(instance).trigger(evt);
        })
        
        this.#unit_v = this.UnitValue(dataset);
        this.#unit_p = $(unitInputSelector).val();
        this.#chartType = $(chartInputSelector).val();
        

        this._size = $('<div></div>');
        this._color = $('<div></div>');
        this._icon = $('<i></i>');
        this._title = $('<h4></h4></h4>');
        this._subtitle = $('<h5></h5>');
        this._unit = $('<font></font>');
        this._chart = $('<div></div>');


        this.Bulid(
            $(sizeInputSelector).data('value'),
            $(colorInputSelector).val(),
            $(iconInputSelector)[0].className,
            $(titleInputSelector).val(),
            $(subtitleInputSelector).val(),
            this.#unit_p, 
            this.#chartType,
            dataset
        );

        this.Chart = new Chart(this.#chartType, this._chart[0], dataset);

        $(mountSelector).append(this.OuterHTML);
    }

    UnitValue(dataset) {
        throw new Error('Abstract method');
    }

    SetUnit(value, unit) {
        return value + ' ' + unit;
    }

    Bulid(size, color, icon, title, subtitle, unit_p, chartType, dataset) {

        throw new Error('Abstract method');
    }

    SetText(elem, text) {
        elem.each(function() {
            for(const child of this.childNodes) 
                if(child.nodeName == '#text') 
                    child.textContent = text;
        })
    }

    get HTML() {
        var output = this.OuterHTML.clone();
        output.find('.chart-container').empty();
        return output[0].outerHTML.formatHTML();
    }

}


class TileStyle1 extends Tile {

    constructor() {
       super();
       
       this.Chart.additionalJs = 
`Chart.eventEmitter.addEventHandler('data', function(e){
    $('#unit')[0].text(e.series[0][e.series[0].length - 1]);
});`;
    }

    Bulid(size, color, icon, title, subtitle, unit_p, chartType, d) {

        const unit = d.dataset[d.dataset.length-1] + ' ' + unit_p; 

        this._size = $('<div class="' + size + '"></div>');
        this._color = $('<div class="card bg-primary border-none" style="background-color: '+color+' !important"></div>');
        this._icon = $('<i class="'+icon+'"></i>');
        this._title = $('<h4 class="card-title text-white">'+title+'</h4>');
        this._subtitle = $('<h5 class="card-subtitle text-white">'+subtitle+'</h5>');
        this._unit = $('<font id="unit" class="display-6 text-white">'+unit+'</font>');
        this._chart = $('<div class="chart-container usage chartist-chart" style="height: 120px"></div>');

        this.OuterHTML = 
            this._size.append(
                this._color.append(
                    $('<div class="card-body">').append(
                        $('<div class="d-flex">').append(
                            $('<div class="me-3 align-self-center">').append(
                                $('<h1 class="text-white">').append(
                                    this._icon
                                )
                            ),
                            $('<div>'). append(
                                this._title,
                                this._subtitle
                            )
                        ),
                        $('<div class="row">').append(
                            $('<div class="col-4 align-self-center">').append(
                                this._unit
                            ),
                            $('<div class="col-8 align-self-center">').append(
                                this._chart
                            )
                        )
                    )
                )
            );
        
    }

    UnitValue(dataset) {
        return dataset.dataset[dataset.dataset.length - 1];
    }
}


class TileStyle2 extends Tile {

    set color(val) {
        this.arrow.css('color', val);
        this._color.text(
`.ct-bar { stroke: ${val} !important; }
.ct-area { fill: ${val} !important; }
.ct-line { stroke: ${val} !important; }
.ct-point { stroke:  ${val} !important; }
`);
    }

    constructor() {
       super(function(){
            this.arrow = $('<i id="arrow"></i>');
       });
       this.Chart.additionalJs = 
`Chart.eventEmitter.addEventHandler('data', function(e){

    const className = e.series[0][e.series[0].length-1] > e.series[0][e.series[0].length-2] ? 'ti-angel-up' : 'ti-angel=down';
    $('#arrow')[0].className = className;

    $('#unit').text(e.series[0].reduce((a,b) => a+b));
})`;
    }

    Bulid(size, color, icon, title, subtitle, unit, chartType, d) {

        this._size = $('<div class="' + size + '"></div>');
        this._color = $(
`<style  type="text/css" class="additionalStylesTile">
    .ct-bar { stroke: ${color} !important; }
    .ct-area { fill: ${color} !important; }
    .ct-line { stroke: ${color} !important; }
    .ct-point { stroke:  ${color} !important; }
</style>`);
        this._title = $('<h4 class="text-center">'+title+'</h4>');
        const arrowClass = d.dataset[d.dataset.length-1] > d.dataset[d.dataset.length-2] ? 'ti-angle-up' : 'ti-angle-down';
        this.arrow[0].className = arrowClass;
        this.arrow.css('color', color);
        // this.arrow = $('<i class="'+arrowClass+'" style="color:'+color+'"></i>');
        this._unit = $(`<h4 id="unit" class="font-weight-medium mb-0">${d.dataset.reduce((a,b) => a+b)}</div>`);
        this._chart = $('<div class="chart-container"></div>');

        this._color.appendTo('head');

        this.OuterHTML = 
            this._size.append( 
                $('<div class="card"></div>').append(
                    $('<div class="card-body text-center"></div>').append(
                        this._title,
                        this._chart,
                    ),
                    $('<div class="p-2 text-center border-top"></div>').append(
                        this._unit.prepend( this.arrow )
                    )
                )
            );
    }

    SetUnit(value, unit) {
        return value;
    }

    UnitValue(d) {
        if(d.dataset[d.dataset.length-1] > d.dataset[d.dataset.length-2]) 
            this.arrow[0].className = 'ti-angle-up';
        else {
            this.arrow[0].className = 'ti-angle-down';
        }

        return d.dataset.reduce((a,b) => a+b);
    }
}

class TileStyle3 extends Tile {
    constructor() {
        super();
        this.Chart.additionalJs = 
`Chart.eventEmitter.addEventHandler('data', function(e){
    $('#unit').text(e.series[0].reduce((a,b) => a+b));
})`;
    }

    Bulid(size, color, icon, title, subtitle, unit_p, chartType, d) {
        const unit = unit_p + d.dataset.reduce((a,b) => a+b);
        this._size = $('<div class="' + size + '"></div>');
        this._color = $('<div class="card bg-primary border-none" style="background-color: '+color+' !important"></div>');
        this._title = $('<h4 class="card-title text-white">'+title+'</h4>');
        this._unit = $('<h6 id="unit" class="card-subtitle text-white">'+unit+'</h6>');
        this._icon = $('<i class="'+icon+'"></i>');
        this._chart = $('<div class="chart-container" style="height: 120px"></div>');

        this.OuterHTML = 
            this._size.append(
                this._color.append(
                    $('<div class="card-body"></div>').append(
                        $('<div class="d-flex"></div>').append(
                            $('<div></div>').append(
                                this._title,
                                this._unit
                            ),
                            $('<div class="ms-auto text-white"></div>').append(
                                this._icon
                            )
                        ),
                        this._chart
                    )
                )
            );

    }

    UnitValue(d) {
        return d.dataset.reduce((a,b) => a+b);
    }

    SetUnit(value, unit) {
        return unit + value;
    }
}

class TileStyle4 extends Tile {

    set color(val) {
        this._color.text(
`.ct-bar { stroke: ${val} !important; }
.ct-area { fill: ${val} !important; }
.ct-line { stroke: ${val} !important; }
.ct-point { stroke:  ${val} !important; }
`);
    }

    constructor() {
        super(function(){
            this.arrow = $('<i id="arrow" style="font-size: 0.875rem !important"></i>');
        });

        this.Chart.additionalJs = 
`Chart.eventEmitter.addEventHandler('data', function(e){

    const className = e.series[0][e.series[0].length-1] > e.series[0][e.series[0].length-2] ? 'ti-angel-up text-success': 'ti-angel=down text-danger';
    $('#arrow')[0].className = className;

    $('#unit').text(e.series[0].reduce((a,b) => a+b));
})`
    }

    Bulid(size, color, icon, title, subtitle, unit, chartType, d) {

        this._size = $('<div class="' + size + '"></div>');
        this._color = $(
`<style  type="text/css" class="additionalStylesTile">
    .ct-bar { stroke: ${color} !important; }
    .ct-area { fill: ${color} !important; }
    .ct-line { stroke: ${color} !important; }
    .ct-point { stroke:  ${color} !important; }
</style>`);
        const arrowClass = d.dataset[d.dataset.length-1] > d.dataset[d.dataset.length-2] ? 'ti-angle-up text-success' : 'ti-angle-down text-danger';
        this.arrow[0].className = arrowClass;
        this._unit = $(`<span id="unit" class="display-6">${d.dataset.reduce((a,b) => a+b)}</span>`);
        this._title = $('<h6>'+title+'</h6>');
        this._chart = $('<div class="chart-container" style="height:70px"></div>');
            
            
        this._color.appendTo('head');

        this.OuterHTML = 
            this._size.append( 
               $('<div class="card"></div>').append(
                   $('<div class="card-body"></div>').append(
                       $('<div class="row"></div>').append(
                           $('<div class="col-8"></div>').append(
                                this._unit.append(
                                    this.arrow
                                ),
                                this._title
                           ),
                           $('<div class="col-4 align-self-center text-end ps-0"></div>').append(
                               this._chart
                           )
                       )
                   )
               )
            );
    }

    SetUnit(value, unit) {
        return value;
    }

    UnitValue(d) {
        if(d.dataset[d.dataset.length-1] > d.dataset[d.dataset.length-2]) 
            this.arrow[0].className = 'ti-angle-up text-success';
        else {
            this.arrow[0].className = 'ti-angle-down text-danger';
        }

        return d.dataset.reduce((a,b) => a+b);
    }
}


class TileStyle5 extends Tile {


    Bulid(size, color, icon, title, subtitle, unit_p, chartType, d) {
        this._size = $('<div class="' + size + '"></div>');
        this._color = $(
            `<style  type="text/css" class="additionalStylesTile">
                .ct-bar { stroke: ${color} !important; }
                .ct-area { fill: ${color} !important; }
                .ct-line { stroke: ${color} !important; }
                .ct-point { stroke:  ${color} !important; }
            </style>`);
        this._title = $(`<h4 class="card-title mb-0">${title}</h4>`);
        
        var monthSum = [];
        var arr = [];
        for(var i = 1; i <= d.dataset.length ; i++) {
            if(i % 30 == 0) {
                monthSum.push(arr.reduce((a,b)=> a+b));
                arr = [];
            }
            arr.push(d.dataset[i-1])
        }
        const month



        this.addtext.addClass('text-success');
        this.arrow.addClass('mdi mdi-arrow-up');
        this.SetText(this.AddText)
    }

    CalculateStats(d) {

        function GrowThatBack(now, back) {
            return new ProcentFromNumber(now-back, back);
        }
        var monthSum = [];
        var arr = [];
        for(var i = 1; i <= d.length ; i++) {
            if(i % 30 == 0) {
                monthSum.push(arr.reduce((a,b)=> a+b));
                arr = [];
            }
            arr.push(d[i-1])
        }
        monthSum.push(arr.reduce((a,b)=> a+b));
    
        if(monthSum.length < 2) monthSum.unshift(0);
        
        var lastDayGrowth = GrowThatBack(d[d.length-1], d[d.length-2]);
        var lastMonthGrowth = GrowThatBack(monthSum[monthSum.length-1], monthSum[monthSum.length-2]);
        
        arr = [];
        d.reduce((a,b)=> {arr.push(GrowThatBack(b,a)); return b});
    
        var avgDayGrowth = new ProcentFromNumber(arr.reduce((a,b)=> a + b )).setDevideBy(d.length);
    
        arr = [];
        monthSum.reduce((a,b) => {arr.push(GrowThatBack(b,a)); return b});
    
        var avgMonthGrowth = new ProcentFromNumber(arr.reduce((a,b)=> a + b)).setDevideBy(monthSum.length);
    
        return {
            lastDay : lastDayGrowth,
            avgDay: avgDayGrowth,
            lastMonth: lastMonthGrowth,
            avgMonth: avgMonthGrowth
        }
    }
}