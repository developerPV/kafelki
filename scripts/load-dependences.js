window.dependencies = {
    'jquery-minicolors' : {
        js: ['jquery.minicolors.min'],
        css: ['jquery.minicolors']
    },
    'perfect-scrollbar' : {
        js:['perfect-scrollbar.jquery.min'],
        css:['perfect-scrollbar.min']
    },
    'apexcharts' : {
        js:['apexcharts2'],
        css: ['apexcharts']
    },
    'c3' : {
        js:['c3.min', 'd3.min'],
        css:['c3.min']
    },
    'chartist' : {
        js:['chartist'],
        css:['chartist.min']
    },
    'chartist-plugin-tooltips' : {
        js:['chartist-plugin-tooltip'],
        css:['chartist-plugin-tooltip']
    },
    'sparkline' : {
        js:['sparkline']
    },
    app: {
        js:[
            'feather.min', 
            'custom', 
            'waves',
            'app',
            'app-style-switcher.horizontal', 
            'app.init', 
        ]
    },
    classes : {
        js: [
            'Dataset',
            'Charts',
            'Tiles',
            'ProcentFromNumber'
        ]
    }
}
console.log('loading dependencies');


( ()=> {
    const promisses = [];
    for(const dep in window.dependencies) {
        const base = './assets/libs/';
        if(typeof(window.dependencies[dep].css) != 'undefined') {

            window.dependencies[dep].css.forEach((e) => {
                $('head').append( $('<link rel="stylesheet" type="text/css"/>').attr('href', base + dep + '/dist/' + e +  '.css') );
            });
        }
        if(typeof(window.dependencies[dep].js) != 'undefined') {
            window.dependencies[dep].js.forEach((e) => {
               promisses.push(new Promise(function (resolve) {
                    $.getScript( base + dep + '/dist/' + e + '.js').done( () => resolve() );
                }));
            });
        }
    }
    Promise.all(promisses).then(() => document.dispatchEvent(new Event('loadedDependencies',{dependencies: window.dependencies})));
})();