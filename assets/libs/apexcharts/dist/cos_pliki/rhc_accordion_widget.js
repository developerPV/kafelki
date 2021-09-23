;;
(function($){
	var scroll_set_interval;
	var did_scroll = false;	
	//---	
	var methods = {
		init : function( options ){
			var settings = $.extend( {
				'todo':	false,
				'is_in_viewport': null,
				'scroll_delay': 100,
				'scroll_offset_start': 0, //starting
				'scroll_offset_scrolling' : 0,
				'accordion' : true
			}, options);			
			
			init_scroll_handler( settings );
			
			return this.each(function(){
				var data = $(this).data('rhcAccordionWidgetItem');
				if(!data){
					$(this)
						.data('rhcAccordionWidgetItem',settings)
					;			
					
					//click header to open body
					$(this).find('.rhc-widget-header')
						.unbind('click')
						.bind('click', function(e){
							var item = $(this).closest('.rhc-accordion-widget-item');
							holder = $(this).closest('.supe-item-holder');
							if( settings.accordion && holder.length > 0 ){								
								if( ! item.is('.open') ){
									holder.find('.rhc-accordion-widget-item.open').toggleClass('open');
								}
							}
							item.toggleClass('open');
							
							return true;
						})
					;
					
					//google map icon
					if( $(this).find('.rhc-gmap').length > 0 ){
						$(this).find('.rhc-icon-map')
							.data('container', this)
							.unbind('click')
							.bind('click', function(e){
								return cb_google_map_icon_click( e, $(this).data('container') );					
							})
						;					
					}else{
						$(this).find('.rhc-icon-map').hide();
					}
					
					//ical icon
					post_id = parseInt( $(this).data('post_id') );
					if( post_id > 0 ){
						$(this).find('.rhc-icon-ical')
							.data('container', this)
							.unbind('click')
							.bind('click', function(e){	
								return cb_ical_btn_click( e, this, $(this).data('container') );
							})
						;					
					}else{
						$(this).find('.rhc-icon-ical').hide();
					}

					//social sharing panel icons (requires addon)					
					social_sharing_addon( $(this), {
						title: $(this).find('.rhc-event-title').html()||'',
						description: $(this).find('.rhc-description').html()||'',
						url: $(this).find('.rhc-title-link').attr('href')||''
					});					

					//clear css
					$('[data-css_clear]').each(function(i,el){
						arg = $(this).data('css_clear')||'display';				
						$(this).css( arg, '');
					});
					//globally clear? :
					if( '#rhc_debug'!=window.location.hash ){
						$('.rhc-supe-loading').removeClass('rhc-supe-loading');	
					}					
					//--apply date format
					//rhc_fc_date_format();
					//header filling bar animation todo, find some non-harcoded way of doing this.
					//$(this).find('.rhc-widget-header[data-fc_color!=""]')
					$(this).find('.rhc-widget-header')
						.each(function(i,el){							
							el = $('<div class="rhc-acco-bg"></div>')
								.prependTo(this)
							;
							
							_color = $(this).data('fc_color');		
							if( _color ){
								el.css('background-color',  _color );
							}
						})
					;
					//--
					if( el_bottom_is_in_viewport && el_bottom_is_in_viewport( this, settings.scroll_offset_start ) ){
						$(this).addClass('supe-shown');			
					}else{
						$(this).removeClass('supe-shown').addClass('supe-animate');	
					}					
				}
			});
		}
	};
	
	function init_scroll_handler( s ){
		//--
		$(window).off("resize", scroll_handler);
		$(window).resize(scroll_handler);
		//---
		$(window).off("scroll", scroll_handler);
		$(window).scroll(scroll_handler);

		if( scroll_set_interval ){
			window.clearInterval(scroll_set_interval);
		}
			
		scroll_set_interval = setInterval(function() {
			if(did_scroll) {
				did_scroll = false;
				$('.rhc-accordion-widget-item:not(.supe-shown)').each(function(i,el){
					if( is_in_viewport( el, s.scroll_offset_scrolling ) ){
						$(el).addClass('supe-shown');
					}
				});
			}
		}, s.scroll_delay);
	}
	
	function el_bottom_is_in_viewport( el, offset ){
		offset = parseInt(offset||0);

		var $elem = $(el);
		var $window = $(window);

		var docViewTop = $window.scrollTop();
		var docViewBottom = docViewTop + $window.height() + offset;

		var elemTop = $elem.offset().top;
		var elemBottom = elemTop + $elem.outerHeight();

		//return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
		return (elemBottom <= docViewBottom);//compare against element bottom
		//return (elemTop <= docViewBottom);//compare against element top		
	}
	
	function is_in_viewport( el, offset ){
		offset = parseInt(offset||0);
//console.log('off',offset);
		var $elem = $(el);
		var $window = $(window);

		var docViewTop = $window.scrollTop();
		var docViewBottom = docViewTop + $window.height() + offset;

		var elemTop = $elem.offset().top;
		var elemBottom = elemTop + $elem.outerHeight();

		//return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
		//return (elemBottom <= docViewBottom);//compare against element bottom
		return (elemTop <= docViewBottom);//compare against element top
		
	}

	function scroll_handler(){
		did_scroll = true;
	}
	
	function cb_ical_btn_click( e, btn, container ){	
		//-- ics download link
		var local_id = $(container).data('post_id') || 0;
		if( local_id > 0 ){
			var url = RHC.ajaxurl;
			url = _add_param_to_url( url, 'rhc_action', 'get_icalendar_events');
			url = _add_param_to_url( url, 'ics', '1' );
			url = _add_param_to_url( url, 'ID', local_id );
			
			_target = $(btn).data('target')||'_self';
			
			window.open( url, _target );
		}
		return false;
	}
	
	function cb_google_map_icon_click( e, container ){
		gmap = $(container).find('.rhc-gmap');
		if( gmap.length ){
			//--toogle--
			gmap.toggleClass('rhc-gmap-open');
			//--init map
			setTimeout(function(){
				gmap.rhcGmap({});
			},100);//with an animation running somethings the map does not render.
		}
		return true;
	}
		
	function social_sharing_addon( item, ev ){
		//--setup sharing buttons from social panels
		if( 'undefined' != typeof rhp_vars ){			
			if( item.find('.rhc-icon-facebook').length > 0 ){
				item.find('.rhc-icon-facebook').show().unbind('click').bind('click',function(e){
					e.preventDefault();
					
					FB.init({appId: rhp_vars.fb_appID, status: true, cookie: true, version:'v2.4' });
					
					// calling the API ...
					var obj = {
					  method: 'share',
					  href: ev.url,
					  link: ev.url,
					  name: ev.title,
					  caption: ev.title,
					  description: ev.description
					};
				
					function callback(response) {
					  //console.log(response);
					}
					
					FB.ui(obj, callback);
				});
			}
			
			if( item.find('.rhc-icon-twitter').length > 0 ){
				item.find('.rhc-icon-twitter').show().unbind('click').bind('click',function(e){
					var articleUrl = encodeURIComponent( ev.url );
					var articleSummary = encodeURIComponent( ev.description );
					var goto = 'https://twitter.com/share?' +
						'&url=' + ev.url +
						'&text=' + ev.title + 
						'&counturl=' + ev.url;
					window.open(goto, 'Twitter', "width=660,height=400,scrollbars=no;resizable=no");
				});
			}
			
			if( item.find('.rhc-icon-linkedin').length > 0 ){
				item.find('.rhc-icon-linkedin').show().unbind('click').bind('click',function(e){
					var articleUrl = encodeURIComponent( ev.url );
					var articleTitle = encodeURIComponent( ev.title );
					var articleSummary = encodeURIComponent( ev.description );
					var articleSource = encodeURIComponent( ev.url );
					var goto = 'http://www.linkedin.com/shareArticle?mini=true'+
						 '&url='+articleUrl+
						 '&title='+articleTitle+
						 '&summary='+articleSummary+ articleUrl +
						 '&source='+articleSource;

					window.open(goto, 'LinkedIn', "width=660,height=400,scrollbars=no;resizable=no");
				});
			}	
			
			if( item.find('.rhc-icon-googleplus').length > 0 ){
				item.find('.rhc-icon-googleplus').show().unbind('click').bind('click',function(e){
					var articleUrl = encodeURIComponent( ev.url );
					var goto = 'https://plus.google.com/share?url=' + articleUrl;
		
					window.open(goto, 'Google+', "width=660,height=400,scrollbars=no;resizable=no");
				});
			}
		}
	}

	$.fn.rhcAccordionWidgetItem = function( method ) {
		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.rhcAccordionWidget' );
		}    
	};
	
	$.fn.rhcAccordionWidgetItem.is_in_viewport = is_in_viewport;
})(jQuery);

(function($){
	var methods = {
		init : function( options ){
			var settings = $.extend( {
				'todo':	false
			}, options);			
			
			return this.each(function(){
				var gmap = $(this);
				//--init map
				var data = gmap.data('rhc_gmap');
				if( !data ){
					gmap.data('rhc_gmap',true);
				
					init_gmap( gmap, get_markers( gmap ), 0 );
					return true;
				}
			});
		}
	};
	
	function get_markers( gmap ){
		var markers = [];
		gmap.children().each(function(i,el){		
			markers.push({
				name: $(el).html(),
				lon: $(el).data('glon'),
				lat: $(el).data('glat'),
				info: $(el).data('ginfo'),				
				address: $(el).data('gaddress'),
				marker_active: $(el).data('marker_active'),
				marker_inactive: $(el).data('marker_active'),
				marker_size: $(el).data('marker_size')
			});
		});
		return markers;
	}
	
	function init_gmap( gmap, markers, depth ){
		depth++;
		if( depth > 10 ) return false;		
		if( 'interactive' != gmap.data('type') ) return false;
		if( markers.length==0 ) return false;
		//-- markers
		function make_geocode_callback( markers, a ){
			var geocodeCallBack = function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					latlng = results[0].geometry.location;
					
					markers[a].lat = latlng.lat();
					markers[a].lon = latlng.lng();
				}
				return init_gmap( gmap, markers, depth);
			}
			return geocodeCallBack;
		}
		
		for( var a=0; a < markers.length ; a++ ){
			if( !markers[a].lat && !markers[a].lon && markers[a].address ){				
				var geocoder_map = new google.maps.Geocoder();
				geocoder_map.geocode( { 'address': markers[a].address}, make_geocode_callback( markers, a ) );	
				return;			
			}	
		}

		/*
		size = gmap.data('size');
		size_arr = size.split('x');
		*/
		gmap.uniqueId();
		
		ratio = gmap.data('ratio');
		ratio = ''==ratio?'4:3':ratio;
		ratio_arr = ratio.split(':');
		
		h = gmap.width() * ratio_arr[1] / ratio_arr[0] ;
		gmap.height( h );
   		//--
   		maptype = gmap.data('maptype') || 'ROADMAP' ;
   		//--
   		settings = {
   			mapTypeId: google.maps.MapTypeId[maptype],
   			center: new google.maps.LatLng( markers[0].lat, markers[0].lon )
   		};
   		if( gmap.data('zoom') ){
   			settings.zoom = gmap.data('zoom');
   		}
   		
		var map = new google.maps.Map( gmap.get(0) , settings);

		var bounds = new google.maps.LatLngBounds();
		var infowindow = new google.maps.InfoWindow();
		
		//-- add markers to map
		$.each( markers, function(i,data){			

			marker = new google.maps.Marker({
				position: new google.maps.LatLng( data.lat, data.lon ),
				map: map
			});
	
			bounds.extend(marker.position);			
			google.maps.event.addListener(marker, 'click', (function(marker, i) {
				return function() {
					infowindow.setContent((data.info||data.name||data.address));
					infowindow.open(map, marker);
				}
			})(marker, i));			
		});
		
				
		if( markers.length > 1 ){
			map.fitBounds(bounds); 
			/* resets to original zoom
			var listener = google.maps.event.addListener(map, "idle", function () {
				map.setZoom( gmap.data('zoom')||3 );
				google.maps.event.removeListener(listener);
			});	
			*/
		}
	}
		
	$.fn.rhcGmap = function( method ) {
		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.rhcGmap' );
		}    
	};
})(jQuery);

;;
(function($){
	var t = this;
	var page = 0;
	var pagequeue = [];
	var methods = {
		init : function( options ){
			var settings = $.extend( {
				'multiple' : true,
				'debug':false,
				'size':10,
				'term_post_count':0
			}, options);		

			return this.each(function(){
				var data = $(this).data('RHCSupeSimpleNav');
				if(!data){
					//--- 				
					pagequeue.push({
						id: $(this).attr('id') + $(this).data('atts').taxonomy + $(this).data('atts').terms,
						page: 0,
						content: $(this).clone().wrap('<div/>').parent().html()
					});
					//---				
					$(this).data('RHCSupeSimpleNav',settings);
					page = parseInt( $(this).data('atts').page );
					initial_render( this );
				}
			});
		}
	};
	
	function initial_render( el ){
		var settings = $(el).data('RHCSupeSimpleNav');		
		var holder = $(el);
		
		if( 4==parseInt( settings.nav ) ){
			$nav = $('<div></div>')
				.addClass('supe-simple-nav')
				.prependTo(
					$(el).find('.supe-head')
				)
			;		
		}

		if( 1==parseInt( settings.nav ) || 3==parseInt( settings.nav ) ){

			$nav = $('<div></div>')
				.addClass('supe-simple-nav')
				.prependTo(
					$(el).find('.supe-head')
				)
			;
		
			btn_left = $('<a class=="supe-prev"></a>')
				.data('supe', $(el))
				.appendTo( $nav )
				.on('click', function(e){
					return btn_prev_click($(this),e,$(this).data('supe'));
				})
			;
		
			btn_right = $('<a class=="supe-next"></a>')
				.data('supe', $(el))
				.appendTo( $nav )
				.on('click', function(e){
					return btn_next_click($(this),e,$(this).data('supe'));
				})
			;
		
		}

		
		if( 2==parseInt( settings.nav ) || 3==parseInt( settings.nav ) ){

			$nav2 = $('<div></div>')
				.addClass('supe-simple-nav')
				.css('z-index','10')
				.appendTo(
					$(el).find('.supe-footer')
				)
			;
		
			btn_left = $('<a class=="supe-prev"></a>')
				.data('supe', $(el))
				.appendTo( $nav2 )
				.on('click', function(e){
					return btn_prev_click($(this),e,$(this).data('supe'));
				})
			;
		
			btn_right = $('<a class=="supe-next"></a>')
				.data('supe', $(el))
				.appendTo( $nav2 )
				.on('click', function(e){
					return btn_next_click($(this),e,$(this).data('supe'));
				})
			;
		
		}
		
		//
		head = $(el).find('.supe-head');
		head.find('.selectpicker.not-inited').each(function(i,el){
			taxonomy = $(el).data('taxonomy');
			dropdown = $(el);
			dropdown.removeClass('not-inited');
			dropdown.attr('multiple', settings.multiple );
			dropdown.selectpicker({
				style: 'btn-small btn-taxfilter btn_tax',
				size: settings.size
			});	
			dropdown.unbind('change', auw_btn_tax).bind('change', {taxonomy:taxonomy,settings:settings,dropdown:dropdown,holder:holder}, auw_btn_tax);

			have_color=false;
			var dropdown_menu = dropdown.parent().find('.dropdown-menu');	
			dropdown.find('option').each(function(i,option){
				count = $(option).attr('data-count')||'';
				bgcolor = $(option).attr('data-bgcolor')||'transparent';

				if('transparent'!=bgcolor)have_color=true;
				dropdown_menu.find('li[rel="' + i + '"] a')
					.prepend( $('<span class="rhc-term-color"></span>').css('background-color',bgcolor).addClass(('transparent'==bgcolor?'rhc-no-color':'')) )
				;
				
				if( settings.term_post_count && parseInt( settings.term_post_count ) ){
					count = parseInt( count );
					if( count > 0 ){
						dropdown_menu.find('li[rel="' + i + '"] a')
							.append( $('<i class="fbd-term-count">' + parseInt( count ) + '</i>') )
						;														
					}
				}	
			});
				
			if(have_color){
				dropdown_menu
					.addClass('rhc-with-tax-color')
					.addClass('rhc-with-tax-color-accordeon')
				;
			}
		});
		
	}
	
	function auw_btn_tax(e){		
		var value = $(this).val();
		value = null==value ? '' : value;
		var values = [];
		
		if( 'string'==typeof value ){
			if( ''==value ){
			
			}else{
				values.push(value);
			}
		}else{
			$.each( value, function(i,v){
				if( ''==v )return true;
				values.push(v);	
			});		
		}
		//--load atts
		var atts = e.data.holder.attr('data-atts');	
		if( 'string' == typeof atts ){	
			atts = eval("(" + atts + ")");
		}
		
		//--modify atts
		atts.page = -1;//reset page.
		
		var taxonomy = e.data.taxonomy;	
		if( !atts.tax_filter ) atts.tax_filter = {};
		atts.tax_filter[taxonomy] = values;
		
		taxonomies = [];
		term_arr = [];
		for (var taxonomy in atts.tax_filter) {
			if (atts.tax_filter.hasOwnProperty(taxonomy)) {
				// do stuff
				if( atts.tax_filter[taxonomy].length > 0 ){
					taxonomies.push( taxonomy );
					term_arr.push.apply( term_arr, atts.tax_filter[taxonomy] );
				}
			}
		}	
		
		if( taxonomies.length==0 && term_arr.length==0 ){
			//all filter cleared - restore default.
			atts.taxonomy = atts.taxonomy_default;
			atts.terms = atts.terms_default;					
		}else{
			atts.taxonomy = taxonomies.join(',');
			atts.terms = term_arr.join(',');				
		}

		//--save atts	
		e.data.holder.attr('data-atts', JSON.stringify(atts) );	
		e.data.holder.data('atts', atts );	
		
		return btn_click(e.data.dropdown, e, e.data.holder, 1);
	}
	
	function btn_prev_click($btn, e, $supe){
		return  btn_click($btn, e, $supe, -1);
	}
	
	function btn_next_click($btn, e, $supe) {
		return  btn_click($btn, e, $supe, 1);
	}
	
	function btn_click($btn, e, $supe, delta){
//console.log('click');	
		if( $supe.is('.rhc-supe-lock') ) return false;

		$supe
			.addClass('rhc-supe-loading')
			.addClass('rhc-supe-lock')
		;
		$btn.addClass('btn-suppe-loading');
		//---
		
		//---
		fetch_events( $btn, e, $supe, delta, function($btn, e, $supe, delta, data){
			$btn.removeClass('btn-suppe-loading');
			$supe
				.removeClass('rhc-supe-loading')
				.removeClass('rhc-supe-lock')
			;
		});
		return true;
	}
	
	function handle_render_no_events(  $supe, data  ){
		var $item_holder = $supe
			.find('.supe-item-holder')
			.stop()
			.fadeOut('normal',function(){
				$(this).empty().show();
			})
		;
	}
	
	function render_events( $supe, data ){
//console.log( 'render_events' );
		if( $(data.HTML).find('.rhc-accordion-widget-item').length == 0 ){
//console.log( 'no events founds');
			return handle_render_no_events(  $supe, data  );
		}	
	
		var $item_holder = $supe
			.find('.supe-item-holder')
				/*.find('.rhc-event-item').each(function(i,old_item){
					if( !$.fn.rhcAccordionWidgetItem.is_in_viewport(old_item,200) ){
						$(old_item).remove();
					}else{
						$(old_item).addClass('rhc-supe-remove');
					}
				}).end()
				*/
			.stop()
			.fadeOut('normal',function(){
				$(this).empty().show();
				
				var $new_supe = $(data.HTML);
				$supe.data('atts', $new_supe.data('atts') );
		
				var $items = $(data.HTML).find('.rhc-accordion-widget-item');
				$items.each( function( i, item){
				
					$(item)
						.css('opacity',0)
						
						.appendTo( $item_holder )
					;
					
					if( $.fn.rhcAccordionWidgetItem.is_in_viewport( item,200) ){
						$(item)
							.addClass('supe-shown')
						;
					}else{
					
					}
					
					$(item).css('opacity','');
				});
				$supe.find('.rhc-accordion-widget-item')
					.rhcAccordionWidgetItem()	
				;
			})
		;
		


	}
	
	function fetch_events( $btn, e, $supe, delta, cb ){
		var dev_delay = 1;//to force show loading effects
		var args = {
			action: 'supe_get_events',
			delta: delta,
			data: $supe.data('atts')
		};
	
		q_page = parseInt( $supe.data('atts').page ) + parseInt( delta );

		in_queue = false;
		var data = {};		
		$(pagequeue).each(function(i,q){				
//return false;//break this look to always query.
			queue_id = $supe.attr('id') + $supe.data('atts').taxonomy + $supe.data('atts').terms;		
			if( queue_id==q.id && q_page == q.page ){
				in_queue = true;
				data = {
					R: 'OK',
					PAGE: q_page,
					HTML: q.content
				};
				render_events( $supe, data );
				
				setTimeout( function(a){				
					if( cb )
						cb( $btn, e, $supe, delta, data );
				} , dev_delay );	
				return false;				
			}
			return true;
		});
		
		if( in_queue ){
			return true;
		}
		
		 $
			.post( args.data.ajaxurl, args, function(data){		
				if(data.R=='OK'){	
				
					pagequeue.push({
						id: $supe.attr('id') + $supe.data('atts').taxonomy + $supe.data('atts').terms,
						page: data.PAGE,
						content: $(data.HTML).clone().wrap('<div/>').parent().html()
					});
									
					render_events( $supe, data );			
				}else if(data.R=='ERR'){
					//alert(data.MSG);					
				}else{
					//alert('Unexpected error');
				}
			
				setTimeout( function(){
					if( cb )
						cb( $btn, e, $supe, delta, data );
				} , dev_delay );			
			
			}, 'json')
			.fail(function(){
				setTimeout( function(){
					if( cb )
						cb( $btn, e, $supe, delta, data );
				} , dev_delay );					
			})
		;

	}
	
	$.fn.RHCSupeSimpleNav = function( method ) {
		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.RHCSupeSimpleNav' );
		}    
	};
})(jQuery);

(function($){
	var methods = {
		init : function( options ){
			var settings = $.extend( {
				'debug':false
			}, options);		

			return this.each(function(){
				var data = $(this).data('RHCSupe');
				if(!data){
				
					$(this).data('RHCSupe',settings);
					
					init_uew_widget_items( $(this) );		
					
					var this_supe = $(this);
					set_size_class( this_supe );
					$(window).on('resize',function(e){
						set_size_class( this_supe );
					});	
					//--
					/*
					var atts = $(this).data('atts');	
					atts.taxonomy_default = atts.taxonomy;
					atts.terms_default = atts.terms;
					//-- save atts
					$(this).attr('data-atts', JSON.stringify(atts) );	
					$(this).data('atts', atts );			
					*/
				}
			});
		}
	};
	
	function set_size_class( supe ){		
		var w = supe.width();
		if( w > 0 ){
			supe.removeClass (function (index, css) {
			   return (css.match (/(^|\s)auw_\S+/g) || []).join(' ');
			});		
			if( w < 200 ){
				supe.addClass('auw_200');
			}else if( w < 500 ){
				supe.addClass('auw_500');
			}else if( w < 600 ){
				supe.addClass('auw_500_600');
			}else if( w < 768 ){
				supe.addClass('auw_600_768');
			}else if( w < 1024 ){
				supe.addClass('auw_768_1024');
			}else if( w >= 1024 ){
				supe.addClass('auw_768_1024');
			}
		}
	}
	
	function init_uew_widget_items( supe ){
		if( supe.find('.rhc-accordion-widget-item').length > 0 ){
			supe.find('.rhc-accordion-widget-item')
				.rhcAccordionWidgetItem()
			;
		}else{
			supe.removeClass('rhc-supe-loading');	
			supe.find('.rhc-supe-no-events').css('opacity','');
		}
		
		atts = supe.data('atts');
		if( atts && atts.nav ){
			//-- other nav
			
			//--
			if( parseInt(atts.nav) > 0 ){
				supe
					.RHCSupeSimpleNav({
						'nav': atts.nav,
						'multiple': parseInt( atts.tax_filter_multiple ) ? true : false,
						'term_post_count' : ( atts.term_post_count ? atts.term_post_count : 0 )
					})
				;				
			}
		}
	}
	
	$.fn.RHCSupe = function( method ) {
		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.RHCSupe' );
		}    
	};
})(jQuery);


function init_uew_widgets(){
jQuery(document).ready(function($){
	if( $('.rhc-supe').length > 0 ){
		$('.rhc-supe').RHCSupe({});
	}else{
		setTimeout( init_uew_widgets ,500);
	}	
});
}

init_uew_widgets();

jQuery(document).ready(function($){
	
});

