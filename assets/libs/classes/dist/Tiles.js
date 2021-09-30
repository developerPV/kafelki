class Tile {

    type = 'tile';
    OuterHTML

    Chart;

    #opts

    set #title(val) {
        this.#opts.title = val;
        this.SetText(this._title, val);
    }
    _title

    set #size(val) {
        this.#opts.size = val;
        this._size[0].className = val;
        this.#chart = this.#chartType;
    }
    _size;

    set #color(val) {
        this.#opts.color = val;
        if (this.#chartType === 'gauge') {
            this.Chart?.Chart.setOptions({ colorStart: val, colorStop: val });
        }
        else {

            if (this.#colorType == 'inline') {
                this._color.attr('style', 'background-color:' + val + '!important');
            }
            else if (this.#colorType == 'stylesheet') {
                this._color.text(
                    `.ct-bar { stroke: ${val} !important; }\n` +
                    `.ct-area { fill: ${val} !important; }\n` +
                    `.ct-line { stroke: ${val} !important; }\n` +
                    `.ct-point { stroke:  ${val} !important; }`
                )
            }
        }
        this.SetColor(val);
    }
    _color;
    #colorType = '';

    set #icon(val) {
        this.#opts.iconCLass = val;
        this._icon[0].className = val;
    }
    _icon

    set #subtitle(val) {
        this.#opts.subtitle = val;
        this.SetText(this._subtitle, val);
    }
    _subtitle

    set #unit(val) {
        this.#unit_p = val;
        this.SetText(this._unit, this.SetUnit(this.#unit_v, this.#unit_p));
    }
    #unit_p;
    set #unitValue(val) {
        this.#unit_v = val;
        this.SetText(this._unit, this.SetUnit(this.#unit_v, this.#unit_p));
    }
    #unit_v;
    _unit;

    set #chart(val) {
        this.#chartType = val;

        if (val === 'gauge' && this._chart[0].tagName === 'DIV') {
            this._chart = this.#SwitchElement(this._chart, $('<canvas></canvas>'));
        } else if (val !== 'gauge' && this._chart[0].tagName === 'CANVAS') {
            this._chart = this.#SwitchElement(this._chart, $('<div></div>'));
        }

        this.Chart = new Chart(val, this._chart[0], this.#_dataset, this.#opts);
        this.Chart.additionalJs = this.GetAdditionalJs();
    }
    _chart;
    #_dataset;
    #chartType;

    constructor(
        colorType,
        fn = null,
        titleInputSelector = '#optionTitleValue',
        sizeInputSelector = '#sizeOptionInput',
        colorInputSelector = '#colorValue',
        iconInputSelector = '#choseIcon',
        subtitleInputSelector = '#optionSubtitleValue',
        unitInputSelector = '#optionUnitValue',
        chartInputSelector = '#optionChartValue',
        dataset = datasetList,
        mountSelector = '#output',
    ) {
        this.#colorType = colorType;

        if (typeof (fn) == 'function') fn.call(this);

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
        $(colorInputSelector).on('changeColor', function (e) {
            instance.#color = e.value;
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

        this.#opts = {
            size: $(sizeInputSelector).data('value'),
            color: $(colorInputSelector).val(),
            iconClass: $(iconInputSelector)[0].className,
            title: $(titleInputSelector).val(),
            subtitle: $(subtitleInputSelector).val(),
        }

        this.#unit_v = this.UnitValue(dataset);
        this.#unit_p = $(unitInputSelector).val();
        this.#chartType = $(chartInputSelector).val();

        this._size = $('<div class="' + this.#opts.size + '"></div>');

        if (colorType == 'stylesheet') {
            this._color = $(`<style  type="text/css" class="additionalStylesTile"></style>`);
            this._color.appendTo('head');
            this.#color = this.#opts.color;
        } else this._color = $('<div></div>');

        this._icon = $('<i></i>');
        this._title = $('<h4></h4>');
        this._subtitle = $('<h5></h5>');
        this._unit = $('<font></font>');

        if (this.#chartType == 'gauge') {
            this._chart = $('<canvas class="chart-container"></canvas>');
        } else {
            this._chart = $('<div class="chart-container"></div>');
        }


        this.Bulid(
            this.#opts.size,
            this.#opts.color,
            this.#opts.iconClass,
            this.#opts.title,
            this.#opts.subtitle,
            this.#unit_p,
            dataset
        );

        $(mountSelector).append(this.OuterHTML);

        this.#chart = this.#chartType;
    }

    GetAdditionalJs() { return ''; }

    SetColor(val) {
        return null;
    }

    UnitValue(dataset) {
        throw new Error('Abstract method');
    }

    SetUnit(value, unit) {
        throw new Error('Abstract method');
    }

    Bulid(size, color, icon, title, subtitle, unit_p, dataset) {

        throw new Error('Abstract method');
    }

    SetText(elem, text) {
        elem.each(function () {
            for (const child of this.childNodes)
                if (child.nodeName == '#text')
                    child.textContent = text;
        })
    }

    #SwitchElement(el1, el2) {
        const style = el1.attr('style');
        const cls = el1.attr('class');
        const id = el1.attr('id');

        el2.attr('style', style);
        el2.attr('class', cls);
        el2.attr('id', id);

        el2.insertAfter(el1);

        el1.remove();

        return el2;

    }

    get HTML() {
        var output = this.OuterHTML.clone();
        output.find('.chart-container').empty();
        return output[0].outerHTML.formatHTML();
    }

}

class TileStyle1 extends Tile {

    constructor() {
        super('inline');
    }

    GetAdditionalJs() {
        return `Chart.eventEmitter.addEventHandler('data', function(e){
    $('#unit')[0].text(e.series[0][e.series[0].length - 1]);
});`;
    }

    Bulid(size, color, icon, title, subtitle, unit_p, d) {

        const unit = d.dataset[d.dataset.length - 1] + ' ' + unit_p;

        this._color = $('<div class="card bg-primary border-none" style="background-color: ' + color + ' !important"></div>');
        this._icon = $('<i class="' + icon + '"></i>');
        this._title = $('<h4 class="card-title text-white">' + title + '</h4>');
        this._subtitle = $('<h5 class="card-subtitle text-white">' + subtitle + '</h5>');
        this._unit = $('<font id="unit" class="display-6 text-white">' + unit + '</font>');
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
                            $('<div>').append(
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

    SetUnit(v, u) {
        return v + ' ' + u;
    }
}

class TileStyle2 extends Tile {

    constructor() {
        super('stylesheet', function () {
            this.arrow = $('<i id="arrow"></i>');
        });
    }

    SetColor(val) {
        this.arrow.css('color', val);
    }

    GetAdditionalJs() {
        return `Chart.eventEmitter.addEventHandler('data', function(e){

    const className = e.series[0][e.series[0].length-1] > e.series[0][e.series[0].length-2] ? 'ti-angel-up' : 'ti-angel=down';
    $('#arrow')[0].className = className;

    $('#unit').text(e.series[0].reduce((a,b) => a+b));
})`;
    }

    Bulid(size, color, icon, title, subtitle, unit, d) {

        this._title = $('<h4 class="text-center">' + title + '</h4>');
        const arrowClass = d.dataset[d.dataset.length - 1] > d.dataset[d.dataset.length - 2] ? 'ti-angle-up' : 'ti-angle-down';
        this.arrow[0].className = arrowClass;
        this.arrow.css('color', color);

        this._unit = $(`<h4 id="unit" class="font-weight-medium mb-0">${d.dataset.reduce((a, b) => a + b)}</div>`);

        this.OuterHTML =
            this._size.append(
                $('<div class="card"></div>').append(
                    $('<div class="card-body text-center"></div>').append(
                        this._title,
                        this._chart,
                    ),
                    $('<div class="p-2 text-center border-top"></div>').append(
                        this._unit.prepend(this.arrow)
                    )
                )
            );
    }

    SetUnit(value, unit) {
        return value;
    }

    UnitValue(d) {
        if (d.dataset[d.dataset.length - 1] > d.dataset[d.dataset.length - 2])
            this.arrow[0].className = 'ti-angle-up';
        else {
            this.arrow[0].className = 'ti-angle-down';
        }

        return d.dataset.reduce((a, b) => a + b);
    }
}

class TileStyle3 extends Tile {
    constructor() {
        super('inline');

    }

    GetAdditionalJs() {
        return `Chart.eventEmitter.addEventHandler('data', function(e){
    $('#unit').text(e.series[0].reduce((a,b) => a+b));
})`;
    }

    Bulid(size, color, icon, title, subtitle, unit_p, d) {

        const unit = unit_p + d.dataset.reduce((a, b) => a + b);
        this._color = $('<div class="card bg-primary border-none" style="background-color: ' + color + ' !important"></div>');
        this._title = $('<h4 class="card-title text-white">' + title + '</h4>');
        this._unit = $('<h6 id="unit" class="card-subtitle text-white">' + unit + '</h6>');
        this._icon = $('<i class="' + icon + '"></i>');
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
        return d.dataset.reduce((a, b) => a + b);
    }

    SetUnit(value, unit) {
        return unit + value;
    }
}

class TileStyle4 extends Tile {

    constructor() {
        super('stylesheet', function () {
            this.arrow = $('<i id="arrow" style="font-size: 0.875rem !important"></i>');
        });
    }

    GetAdditionalJs() {
        return `Chart.eventEmitter.addEventHandler('data', function(e){

    const className = e.series[0][e.series[0].length-1] > e.series[0][e.series[0].length-2] ? 'ti-angel-up text-success': 'ti-angel=down text-danger';
    $('#arrow')[0].className = className;

    $('#unit').text(e.series[0].reduce((a,b) => a+b));
})`
    }

    Bulid(size, color, icon, title, subtitle, unit, d) {

        const arrowClass = d.dataset[d.dataset.length - 1] > d.dataset[d.dataset.length - 2] ? 'ti-angle-up text-success' : 'ti-angle-down text-danger';
        this.arrow[0].className = arrowClass;
        this._unit = $(`<span id="unit" class="display-6">${d.dataset.reduce((a, b) => a + b)}</span>`);
        this._title = $('<h6>' + title + '</h6>');
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
        if (d.dataset[d.dataset.length - 1] > d.dataset[d.dataset.length - 2])
            this.arrow[0].className = 'ti-angle-up text-success';
        else {
            this.arrow[0].className = 'ti-angle-down text-danger';
        }

        return d.dataset.reduce((a, b) => a + b);
    }
}

class TileStyle5 extends Tile {

    constructor() {
        super('stylesheet', function () {
            this.lastMonth = $('<small id="lastMonth"> </span>');
            this.lastMonthIcon = $('<i id="lastMonthIcon" class="mdi"></i>');
            this.lastDay = $('<b id="lastDay"></b>');
            this.avgDay = $('<b id="avgDay"></b>');
            this.avgMonth = $('<b id="avgMonth"></b>');
        });

    }

    GetAdditionalJs() {
        return `
function CalculateStats(d) {

    function GrowThatBack(now, back) {
        return new ProcentFromNumber(now - back, back);
    }
    var monthSum = [];
    var arr = [];
    for (var i = 1; i <= d.length; i++) {
        if (i % 30 == 0) {
            monthSum.push(arr.reduce((a, b) => a + b));
            arr = [];
        }
        arr.push(d[i - 1])
    }
    monthSum.push(arr.reduce((a, b) => a + b));

    if (monthSum.length < 2) monthSum.unshift(0);

    var lastDayGrowth = GrowThatBack(d[d.length - 1], d[d.length - 2]);
    var lastMonthGrowth = GrowThatBack(monthSum[monthSum.length - 1], monthSum[monthSum.length - 2]);

    arr = [];
    d.reduce((a, b) => { arr.push(GrowThatBack(b, a)); return b });

    var avgDayGrowth = new ProcentFromNumber(arr.reduce((a, b) => a + b)).setDevideBy(d.length);

    arr = [];
    monthSum.reduce((a, b) => { arr.push(GrowThatBack(b, a)); return b });

    var avgMonthGrowth = new ProcentFromNumber(arr.reduce((a, b) => a + b)).setDevideBy(monthSum.length);

    return {
        lastDay: lastDayGrowth,
        avgDay: avgDayGrowth,
        lastMonth: lastMonthGrowth,
        avgMonth: avgMonthGrowth
    }
}


SetStats(d) {
    const stats = this.CalculateStats(d);

    stats.lastMonth.setPrecision(0);

    let text = '';
    if (stats.lastMonth > 0) {
        $('#lastMonth').removeClass('text-danger').addClass('text-success');
        $('#lastMonthIcon').removeClass('mdi-arrow-down').addClass('mdi-arrow-up');
        text = 'Więcej niż w poprzednim miesiącu';
    } else {
        $('#lastMonth').removeClass('text-success').addClass('text-danger');
        $('#lastMonthIcon').removeClass('mdi-arrow-up').addClass('mdi-arrow-down');
        text = 'Mniej niż w poprzednim miesiącu';
    }

    for (const child of  $('#lastMonth')[0].childNodes)
        if (child.nodeName == '#text')
            child.textContent = stats.lastMonth.toString() + ' ' + text;

    $('#lastDay').text(stats.lastDay.toString());
    $('#avgDay').text(stats.avgDay.toString());
    $('#avgMonth').text(stats.avgMonth.toString());
}`;
    }


    Bulid(size, color, icon, title, subtitle, unit_p, d) {

        this._title = $(`<h4 class="card-title mb-0 me-3">${title}</h4>`);

        this.SetStats(d.dataset);

        this.OuterHTML =
            this._size.append(
                $('<div class="card"></div>').append(
                    $('<div class="card-body analytics-info"></div>').append(
                        $('<div class="d-flex align-items-center mb-3"></div>').append(
                            this._title,
                            $('<div class="ms-auto"></div>').append(
                                this.lastMonth.prepend(this.lastMonthIcon)
                            )
                        ),
                        $('<div class="d-flex justify-content-between"></div>').append(
                            $('<div class="border-end w-100 pe-3"></div>').append(
                                $('<h6 class="text-muted fw-normal">Dzienny przyrost</h6>'),
                                this.lastDay
                            ),
                            $('<div class="ms-3 w-100 border-end pe-3"></div>').append(
                                $('<h6 class="text-muted fw-normal">Śr. Miesięczny</h6>'),
                                this.avgMonth
                            ),
                            $('<div class="ms-3 w-100"></div>').append(
                                $('<h6 class="text-muted fw-normal">Śr. Dzienny</h6>'),
                                this.avgDay
                            )
                        )
                    ),
                    this._chart
                )
            );


    }

    SetStats(d) {
        const stats = this.CalculateStats(d);

        stats.lastMonth.setPrecision(0);

        if (stats.lastMonth > 0) {
            this.lastMonth.removeClass('text-danger').addClass('text-success');
            this.lastMonthIcon.removeClass('mdi-arrow-down').addClass('mdi-arrow-up');
            this.SetText(this.lastMonth, `${stats.lastMonth} Więcej niż w poprzednim miesiącu`);
        } else {
            this.lastMonth.removeClass('text-success').addClass('text-danger');
            this.lastMonthIcon.removeClass('mdi-arrow-up').addClass('mdi-arrow-down');
            this.SetText(this.lastMonth, `${stats.lastMonth} Mniej niż w poprzednim miesiącu`);
        }

        this.lastDay.text(stats.lastDay.toString());
        this.avgDay.text(stats.avgDay.toString());
        this.avgMonth.text(stats.avgMonth.toString());
    }

    SetUnit(value, unit) { return null; }

    UnitValue(d) {
        this.SetStats(d.dataset);
        return null;
    }

    CalculateStats(d) {

        function GrowThatBack(now, back) {
            return new ProcentFromNumber(now - back, back);
        }
        var monthSum = [];
        var arr = [];
        for (var i = 1; i <= d.length; i++) {
            if (i % 30 == 0) {
                monthSum.push(arr.reduce((a, b) => a + b));
                arr = [];
            }
            arr.push(d[i - 1])
        }
        monthSum.push(arr.reduce((a, b) => a + b));

        if (monthSum.length < 2) monthSum.unshift(0);

        var lastDayGrowth = GrowThatBack(d[d.length - 1], d[d.length - 2]);
        var lastMonthGrowth = GrowThatBack(monthSum[monthSum.length - 1], monthSum[monthSum.length - 2]);

        arr = [];
        d.reduce((a, b) => { arr.push(GrowThatBack(b, a)); return b });

        var avgDayGrowth = new ProcentFromNumber(arr.reduce((a, b) => a + b)).setDevideBy(d.length);

        arr = [];
        monthSum.reduce((a, b) => { arr.push(GrowThatBack(b, a)); return b });

        var avgMonthGrowth = new ProcentFromNumber(arr.reduce((a, b) => a + b)).setDevideBy(monthSum.length);

        return {
            lastDay: lastDayGrowth,
            avgDay: avgDayGrowth,
            lastMonth: lastMonthGrowth,
            avgMonth: avgMonthGrowth
        }
    }
}

class TileStyle6 extends Tile {

    constructor() {
        super('stylesheet');
    }

    Bulid(size, color, icon, title, subtitle, unit_p, d) {

        const unit = unit_p + this.UnitValue(d);

        this._title = $(`<h4 class="text-center">${title}</h4>`);
        this._unit = $(`<h4 class="font-weight-medium mb-0">${unit}</h4>`);
        this.OuterHTML =
            this._size.append(
                $('<div class="card"></div>').append(
                    $('<div class="card-body"></div>').append(
                        this._title,
                        $('<div class="gaugejs-box">').append(
                            this._chart
                        )
                    ),
                    $('<div class="p-2 text-center border-top"></div>').append(
                        this._unit
                    )
                )
            );
    }

    UnitValue(d) {
        return d.dataset.reduce((a, b) => a + b)
    }
    SetUnit(v, u) { return u + v }
}

class TileStyle7 extends Tile {
    constructor() {
        super('');
    }

    Bulid(size, color, icon, title, subtitle, unit, d) {
        this._unit = $(`<h1 class="fw-light">${this.UnitValue(d)}</h1>`);
        this._title = $(`<h6 class="text-muted">${title}</h6>`);
        const procent = this.CalcProcent(d);
        this._color = $(`<div class="css-bar mb-0"></div>`);
        this.SetColor(color);

        this._
    }

    SetColor(color) {
        
    }

    UnitValue(d) {
        return d.dataset.reduce((a, b) => a + b);
    }

    SetUnit(v, u) { return v };

    RoundTo5(num) {
        return Math.round(num / 5) * 5
    }

    CalcProcent(d) {
        return RoundTo5(
            ProcentFromNumber(this.UnitValue(d), d.dataset.length * 100).valueOf() * 100
        );
    }

}