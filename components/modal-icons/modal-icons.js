(function() {

    var icons = new Map();

    const modal = $('#iconsModal');
    var searchtimeout = null;
    const searchInput = $('#iconModalShearchInput');
    searchInput.keydown(() => { if(searchtimeout != null) clearInterval(searchtimeout)});
    searchInput.keyup(function() {
        searchtimeout = setTimeout(search.bind(this, this.value), 500);
    });

    function search(value) {

        if(value == '') {
            icons.forEach(e => e.classList.remove('hard-hide'));
        } else {
            icons.forEach( (e, k) => {
                if(k.search(value) > 0) e.classList.remove('hard-hide');
                else e.classList.add('hard-hide');
            });
        }

    }

    $('#iconModalClearShearchInput').click(() => searchInput.val('').keyup());


    $('#iconValue').change(function(){
        if (this.value == '') $('#selecIconButton').prop('disabled', true);
        else $('#selecIconButton').prop('disabled', false);
    }).change();
    
    modal.on('show.bs.modal', function() {
        const promises = [];
        const self = $(this);
        self.find('[data-component-lazy]').each(function() {
            promises.push( components.Load(this) );
        });
        Promise.all(promises).then( () => {
            const $icons = self.find('.iconCtrn');

            $icons.click(function(){
                $icons.removeClass('conf-selected');
                this.classList.add('conf-selected');
                $('#iconValue').val(this.firstElementChild.className).trigger('change');
            });

            $icons.each(function () {
                const elem = $(this);
                let name = elem.find('span').first();
                icons.set(name.text(), elem[0]);
            });
        })
    });

    
    modal.on('hidden.bs.modal', () => {

        $('#iconsModal').find('[data-component-lazy]').each(function() {
            components.Remove(this.getAttribute('data-component-lazy'));
        });

        icons = new Map();
        searchInput.val('');
    });
    
    $('#selecIconButton').click(function(){
        const icon = document.getElementById('choseIcon');
        const value = document.getElementById('iconValue');
        icon.className = '';
        icon.className = value.value;
        var evt = $.Event('change');
        evt.value = value.value;
        $(icon).trigger(evt);
    });
})();