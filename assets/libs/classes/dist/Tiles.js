class Tile {

    type = 'tile';
    OuterHTML

    Chart;

    set #title(val) {
        this._title.text(val);
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
        this._subtitle.text(val);
    }
    _subtitle

    set #unit(val) {
        this.#unit_p = val;
        this._unit.text(this.#unit_v +' ' + this.#unit_p);
    }
    #unit_p;
    set #unitValue(val) {
        this.#unit_v = val;
        this._unit.text(this.#unit_v +' ' + this.#unit_p);

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
        titleInputSelector = '#optionTitleValue',
        sizeInputSelector = '#sizeOptionInput',
        colorInputSelector = '#colorValue',
        iconInputSelector = '#choseIcon',
        subtitleInputSelector = '#optionSubtitleValue',
        unitInputSelector = '#optionUnitValue',
        chartInputSelector ='#optionChartValue',
        dataset = datasetList[0],
        mountSelector = '#output'
    ) {
        
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
        
        this.#unit_v = dataset.dataset[dataset.dataset.length -1];
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
            this.#unit_v + ' ' +  this.#unit_p,
            this.#chartType,
            dataset
        );

        this.Chart = new Chart(this.#chartType, this._chart[0], dataset);

        $(mountSelector).append(this.OuterHTML);
    }

    UnitValue(dataset) {
        throw new Error('Abstract method');
    }

    Bulid(size, color, icon, title, subtitle, unit, chartType, dataset) {

        throw new Error('Abstract method');
    }

    get HTML() {
        return this.OuterHTML[0].outerHTML.formatHTML();
    }

}


class TileStyle1 extends Tile {

    constructor() {
       super();  
    }

    Bulid(size, color, icon, title, subtitle, unit, chartType, dataset) {

        this._size = $('<div class="' + size + '"></div>');
        this._color = $('<div class="card bg-primary border-none" style="background-color: '+color+' !important"></div>');
        this._icon = $('<i class="'+icon+'"></i>');
        this._title = $('<h4 class="card-title text-white">'+title+'</h4>');
        this._subtitle = $('<h5 class="card-subtitle text-white">'+subtitle+'</h5>');
        this._unit = $('<font class="display-6 text-white">'+unit+'</font>');
        this._chart = $('<div class="usage chartist-chart" style="height: 120px"></div>');

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

    arrow;

    set color(val) {
        this.arrow.css('color', val);
        this._color.text(
            `.ct-bar { stroke: ${val} !important; }
            .ct-area { fill: ${val} !important; }
            .ct-line { stroke: ${val} !important; }
            `);
    }

    constructor() {
       super();  
    }

    Bulid(size, color, icon, title, subtitle, unit, chartType, d) {

        this._size = $('<div class="' + size + '"></div>');
        this._color = $(
            `<style  type="text/css" class="additionalStylesTile">
                .ct-bar { stroke: ${color} !important; }
                .ct-area { fill: ${color} !important; }
                .ct-line { stroke: ${color} !important; }
            </style>`);
        this._title = $('<h4 class="text-center">'+title+'</h4>');
        const arrowClass = d.dataset[d.dataset.length-1] > d.dataset[d.dataset.length-2] ? 'ti-angle-up' : 'ti-angle-down';
        this.arrow = $('<i class="'+arrowClass+'" style="color:'+color+'"></i>');
        this._unit = $(`<h4 class="font-weight-medium mb-0">${d.dataset.reduce((a,b) => a+b)}</div>`);
        this._chart = $('<div></div>');

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



    UnitValue(d) {
        if(d.dataset[d.dataset.length-1] > d.dataset[d.dataset.length-2]) 
            this.arrow[0].className = 'ti-angle-up';
        else {
            this.arrow[0].className = 'ti-angle-down';
        }

        return d.dataset.reduce((a,b) => a+b);
    }
}