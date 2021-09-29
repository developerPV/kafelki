class ProcentFromNumber {
    #n1;
    #n2;
    #precision;
    #devideBy;

    constructor(n1, n2 = 1, prec = 2, devideBy=1) {
        this.setNumerator(n1);
        this.setDenominator(n2)
        this.setPrecision(prec);
        this.setDevideBy(devideBy);
    }

    #checkNumber(num) {
        if( isNaN(num)) {
            console.error(num);
            throw new Error(num + ' is not number');
        }
        else return num;
    }
    #chcecGreather0(num) {
        if(num <= 0) {
            return 1;
        }
        else return num;
    }

    setNumerator(number) {
        this.#n1 = this.#checkNumber(number);
        return this;
    }
    setDenominator(number) {
        this.#n2 = this.#checkNumber(number)
        return this;
    }
    setPrecision(number) {
        this.#precision = this.#chcecGreather0(this.#checkNumber(number));
        return this;
    }
    setDevideBy(number) {
        this.#devideBy = this.#chcecGreather0(this.#checkNumber(number));
        return this;
    }

    #calc() {
        return this.#n1 / this.#n2 / this.#devideBy;
    }

    #prec() { 
        const p = 10**this.#precision;
        return Math.round( this.#calc() * p ) / p;
    }

    toString() {
        return Intl.NumberFormat('en-US',{minimumFractionDigits: this.#precision, useGrouping: false, style: "percent"}).format(this.#prec());
    }

    valueOf = function(round=false) {
        if(round) {
            return this.#calc();
        } else {
            return this.#prec();
        }
    }

}