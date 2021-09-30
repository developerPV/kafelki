class ProcentFromNumber {
    #n1;
    #n2;
    #precision;
    #devideBy;
    locale = 'en-US';

    constructor(n1, n2 = 1, prec = 2, devideBy = 1) {

        this.setNumerator(n1);
        this.setDenominator(n2)
        this.setPrecision(prec);
        this.setDevideBy(devideBy);

    }

    #checkNumber(num) {
        if (isNaN(num)) {
            console.error(num);
            throw new Error(num + ' is not number');
        }
        else return num;
    }
    #chcekGreather0(num) {
        if (num <= 0) {
            return 1;
        }
        else return num;
    }
    #notNegative(num) {
        return num < 0 ? -1 * num : num;
    }

    #toInt(num) {
        return Math.round(num);
    }

    setNumerator(number) {
        this.#n1 = this.#checkNumber(number);
        return this;
    }
    setDenominator(number) {
        this.#n2 = this.#chcekGreather0(this.#checkNumber(number));
        return this;
    }
    setPrecision(number) {
        this.#precision = this.#notNegative(this.#toInt(this.#checkNumber(number)));
        return this;
    }
    setDevideBy(number) {
        this.#devideBy = this.#chcekGreather0(this.#toInt(this.#checkNumber(number)));
        return this;
    }

    #calc() {
        // if (this.#n1 == 0) return -1;
        return this.#n1 / this.#n2 / this.#devideBy;
    }

    #prec() {
        let p = 10 ** this.#precision;
        if (p <= 1) return this.#calc();
        return Math.round(this.#calc() * p) / p;
    }

    toString() {
        return Intl.NumberFormat(this.locale,
            {
                minimumFractionDigits: this.#precision,
                maximumFractionDigits: this.#precision,
                useGrouping: false,
                style: "percent"
            }).format(this.#prec());
    }

    valueOf = function (round = false) {
        if (round) {
            return this.#prec();
        } else {
            return this.#calc();
        }
    }

}