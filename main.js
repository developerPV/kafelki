document.addEventListener('loadedDependencies', () => window.components.LoadComponents());
document.addEventListener('loadedComponents', (e) => console.log('loaded components', e));

String.prototype.tab = function(times =1, tabsize = 2, newLine = true) {
    var t = [];
    t.length = tabsize;
    t = t.fill(' ').join('');
    var arr = [];
    arr.length = times > 0 ? times : 0;
    t= arr.fill(t).join('');
    if (newLine) t = '\n'+t;
    return this+t;
}

String.prototype.insert = function(pos, text) {
    console.log(pos, text);
    return this.slice(0, pos) + text + this.slice(pos);
}

String.prototype.formatHTML = function() {
    var lvl = 0, i = 0;
    var str = new String();
    var lastOpHasNewLvl = true;
    var lastOpHasEndLvl = false;


    for(i ; i < this.length; i++) {



        if(this[i] == '<' && this[i+1] != '/') {

            if(lastOpHasNewLvl === false) str += ''.tab(lvl);

            lvl++;

            while(this[i] != '>') {
                str += this[i];
                i++;
            } 
            str += this[i];

            if(this[i+1] == '<' && this[i+2] == '/') ;
            else  str += ''.tab(lvl);

            lastOpHasNewLvl = true;
            lastOpHasEndLvl = false;

        }
        else if(this[i] == '<' && this[i+1] == '/') {

            lvl--;
            
            str += ''.tab(lvl);

            while(this[i] != '>') {
                str += this[i];
                i++
            } 

            str += this[i];

            lastOpHasNewLvl = false;
            lastOpHasEndLvl = true;

        } else {

            if(lastOpHasEndLvl===true) str += ''.tab(lvl);

            str += this[i];

            lastOpHasNewLvl = false;
            lastOpHasEndLvl = false;

        }

    }
    return str.toString();
}





