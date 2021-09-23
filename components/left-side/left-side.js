(function() {
  $('.btn-group').children().click(function(){
    const self = $(this);
    self.addClass('conf-selected');
    self.siblings().removeClass('conf-selected');
    self.parent().trigger('change', {value: self.data('value')});
    
}).first().click();

  $('input.minicolors').minicolors({
      control: 'hue',
      format:'rgba',
      inline: true,
      letterCase:'lowercase',
      position:'bottom',
      swatches: ['#7460EE', '#1E88E5','#21C1D6','#FFB22B', '#FF821C', '#F62D51'],
      change: function(val, op) {
        if( !val) return;
        const evt = $.Event('changeColor');
        evt.value = val;
        evt.opacity = op;
        $(this).trigger(evt);
      },
      theme: 'bootstrap'
    });

  $('.style-control').click(function(){
    const self = $(this);
    self.addClass('conf-selected');
    self.siblings('.style-control').removeClass('conf-selected');

    $('#additionalOptions').children().addClass('hard-hide');

    let aop = self.data('additional-options');
    aop = aop.split('|');
    aop.forEach(function(e) {
      $('#option-'+e).removeClass('hard-hide');
    });
      const evt = $.Event('change');
      evt.value = self.data('value');
      self.parent().trigger( evt );
  });

})();


