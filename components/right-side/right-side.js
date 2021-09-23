// (function(){




//     let counter = 0;

//     function GenerateControl(count, value) {
//         // id = 'dataControl-' + counter++;
//         const container = $(`<div class="m-2 p-3 border border-white rounded"></div>`);
//         const inputGroup = $('<div class="input-group"></div>');
//         const inputNumber = $(`<input type="number" class="form-control text-center pr-2" value="${value}"/>`);
//         const eraseButton = $(`<button class="btn btn-outline-danger" type="button"><i class="fas fa-times"></i></button>`);
//         const inputRange = $(`<input type="range" min="0" max="100" step="1" value="${value}" class="input-range mt-1" />`);

//         inputGroup.append(`<span class="input-group-text">#${count}</span>`);

//         inputNumber.change(function() {
//             var evt = $.Event('dataChange');
//             evt.value = this.value;
//             dataContainer.trigger(evt);
//         });
//         inputNumber.keyup(function() {
//             inputRange.val(this.value);
//         });
//         inputGroup.append(inputNumber);

//         eraseButton.click(function() {
//             var evt = $.Event('dataErase');
//             evt.element = container;
//             evt.value = container.find('input[type="number"]').first().val();
//             dataContainer.trigger(evt);
//             container.remove();
//         });
//         inputGroup.append(eraseButton);

//         container.append(inputGroup);

//         inputRange.on('input', function() {
//             inputNumber.val(this.value).change();
//         });
//         container.append(inputRange);

//         return container;
//     }

//     dataContainer.append(GenerateControl(1,50));

//     dataContainer.on('dataChange', (e) => console.log(e));

// })();

class DataController {
    #container;
    #addButton;
    #dataContainer;

    constructor(containerSelector = '', dataset = 10) {
        this.#BulidOuter();
        
        if(!Number.isInteger(dataset)) dataset =10;
        this.#SetData(dataset);

        const instance= $(this);
        instance.on('dataChange', this.#OnDataChange);
        
        if( containerSelector != '') this.Mount(containerSelector);
    }

    #OnDataChange() {
        const data = [];
        this.#dataContainer.children().each(function() {
            data.push(parseInt(
                $(this).find('input[type="number"]').val()
            ));
        });
        var evt = $.Event('change');
        evt.dataset=data;
        $(this).trigger(evt);
    }

    Mount(selector) {
        var s = $(selector);
        if(s.length== 0) return;

        this.#container = s;
        this.#container.append(this.#dataContainer);
        this.#container.append(this.#addButton);
    }
    
    #BulidOuter() {
       
        this.#dataContainer = $('<div style="overflow-x: hidden; overflow-y:scroll" class="flex-fill align-self-stretch flex-grow-1 flex-shrink-1"></div>');
       
        this.#addButton = $('<button type="button" class="btn btn-secondary m-3 "><i class="fas fa-plus"></i></button>');
        this.#addButton.click(function() {
            this.AddData();
            this.#OnDataChange();
        }.bind(this));
       
    }

    #SetData(count) {
        for(let i = 0; i < count; i++) {
            this.AddData();
        }
    }

    AddData() {
        const length = this.#dataContainer.children().length + 1;
        const value = Math.floor(Math.random() * (101));
        this.#dataContainer.append( this.#GenerateControl(length, value) );
    }

    Recalculate() {
        this.#dataContainer.children().each( function(i) {
            $(this).find('.counter').text('#' + (i+1));
        });
    }

    #GenerateControl(count, value) {
        const container = $(`<div class="m-2 p-3 border border-white rounded"></div>`);
        const inputGroup = $('<div class="input-group"></div>');
        const inputNumber = $(`<input type="number" class="form-control text-center pr-2" value="${value}"/>`);
        const eraseButton = $(`<button class="btn btn-outline-danger" type="button"><i class="fas fa-times"></i></button>`);
        const inputRange = $(`<input type="range" min="0" max="100" step="1" value="${value}" class="input-range mt-1" />`);
        const instance = $(this);

        inputGroup.append(`<span class="input-group-text counter">#${count}</span>`);
        

        inputNumber.change(function() {
            inputRange.val(this.value);
            var evt = $.Event('dataChange');
            evt.value = this.value;
            instance.trigger(evt);
        });
        inputNumber.keyup(function() {
            inputRange.val(this.value);
        });
        inputGroup.append(inputNumber);

        eraseButton.click(function() {
            container.remove();
            var evt = $.Event('dataChange');
            evt.value = null;
            instance.trigger(evt);
            instance[0].Recalculate();
        });
        inputGroup.append(eraseButton);

        container.append(inputGroup);

        inputRange.on('input', function() {
            inputNumber.val(this.value).change();
        });
        container.append(inputRange);

        return container;
    }
}

window.datasetList = [
    new DataController('#right-side')
]

