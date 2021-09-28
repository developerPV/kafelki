(function() {
  $('.btn-group').children().click(function(){
    const self = $(this);
    self.addClass('conf-selected');
    self.siblings().removeClass('conf-selected');
    var evt = $.Event('change');
    evt.value = self.data('value');
    self.parent().data('value', evt.value);
    self.parent().trigger(evt);
    
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


  $('#selectModelChrts').change(function(e) {
    var tile;
    $('.additionalStylesTile').remove();

    switch(e.value) {
      case 1 :
        tile = new TileStyle1();
        AddStyles(`
        .ct-line {
          stroke: #fff !important;
        }
        .ct-area {
          fill: #fff !important;
          fill-opacity: .3 !important;
        }
        .ct-point {
          stroke: #fff !important;
        }
        .ct-bar {
          stroke: #fff !important;
        }
        `);
        break;
      
      case 2 : {
        tile = new TileStyle2();
      }

    }

    if(tile.type === 'tile') {
      $(tile).change(function(e) {
        $('#outputHTML').text(this.HTML);
        $('#outputCSS').text($('#additionalStylesTile').html());
        $('#outputJS').text(this.Chart.JS);
      });

      $('#outputHTML').text(tile.HTML);
      $('#outputCSS').text($('.additionalStylesTile').html());
      $('#outputJS').text(tile.Chart.JS);
    }
  });

  function AddStyles(styles) {
    $('<style id="additionalStylesTile" class="additionalStylesTile" type="text/css">'+styles+'</style>').appendTo('head');
  }

})();


