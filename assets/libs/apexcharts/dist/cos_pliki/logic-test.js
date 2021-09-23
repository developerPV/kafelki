window.logicTestCount = 0;
window.getLogicTest = function(selector, operationCount = 1) {

    function GenerateTest() {

        const numbers = ['zero', 'jeden', 'dwa', 'trzy', 'cztery', 'pięć', 'sześć', 'siedem', 'osiem', 'dziewięć', 'dziesięć'];
        const operations = ['+', '*'];
        

        var min = 1;
        var max = 5;

        const output  = {
            test : numbers[Math.floor(Math.random() * (max - min)) + min],
            bin: ''
        }

        for(let i = 0 ; i < operationCount ; i++ ) {

            const operator = operations[Math.floor(Math.random() * (operations.length ))];
            
           
            switch (operator) {
                case '*': 
                    max = numbers.indexOf('dwa');
            }

            output.test += ` ${operator} ${numbers[Math.floor(Math.random() * (max - min)) + min]}`;
        }

        // output.test = output.test.slice(0, -2);
        output.bin += window.btoa(unescape(encodeURIComponent( output.test )));
        output.test += " =";
        output.test = output.test.replaceAll('*', '×');

        return output;
    }

    function mount($) {

        const elem = $(selector);
        const test = GenerateTest();

        const output = $(`<div class="uwks-logic-test">
                            <div class="test">
                                <p>${test.test}</p>
                            </div>
                            <div class="uksw-input-control">
                                <label class="uksw-info-text" for="logic-test-${window.logicTestCount++}" >Wynik</label>
                                <input required id="logic-test-${window.logicTestCount}" name="logic-test[answer]" class="uksw-input" type="text" />
                                <input type="hidden" name="logic-test[bin]" value="${test.bin}" />
                            </div>
                        </div>`
        );
        
        elem.prepend(output);
    }

    return mount(jQuery);
}
