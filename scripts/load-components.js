window.components = {

    encodeID : (id) => (window.btoa(unescape(encodeURIComponent(id)))).replaceAll('=',''),
    getName : (elem) => { 
        let name = elem.getAttribute('data-component');
        if(name == null) return elem.getAttribute('data-component-lazy');
        else return name
    },
    
    loadedComponents: new Map(),
    removedComponents: new Map(),

    Load: function(elem, name = null) {

        if(name == null) name = this.getName(elem);

        let n = name.split('/');
        const fname = n[n.length-1];
        const path = n.length > 0 ? n.join('/') : fname;
        const file = './components/'+ path + '/' + fname + '.';
        const id = this.encodeID(name);

        $('head').append( $('<link id="'+id+'" rel="stylesheet" type="text/css"/>').attr('href', file + 'css') );

        return new Promise( resorver => {
            $(elem).load(file + 'html', (e) => {
                if(window.components.removedComponents.has(id)) {
                    window.components.removedComponents.delete(id);
                } 

                $.getScript(file + 'js', () => {
                    window.components.loadedComponents.set(name, elem);
                    resorver();
                });
                
            });
        });
    },

    Remove: function(name) {
        
        if(this.loadedComponents.has(name)) {

            const id = this.encodeID(name);

            $('link#'+id).remove();
            this.loadedComponents.get(name).innerHTML = '';
            this.loadedComponents = new Map();

            const dataComponents = $('[data-component], [data-component-lazy]');
            for(const elem of dataComponents) {
                const nn = this.getName(elem);
                this.loadedComponents.set(nn,elem);
            }
            this.removedComponents.set(id, name);
            this.removedComponents.forEach((n) => this.loadedComponents.delete(n));
            
        }
    },

    LoadComponents: async function() {

        const dataComponents = $('[data-component]');
        if(dataComponents.length > this.loadedComponents.size) {

            for(const elem of dataComponents) {
                const name = elem.getAttribute('data-component');
                if ( !this.loadedComponents.has(name) ) {
                    await this.Load(elem, name);
                }
            }
            
            this.LoadComponents();
        } else {
            console.log('loaded all components');
        }
    }
}


