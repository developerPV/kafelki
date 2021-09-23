

//page functions
jQuery(document).ready(() => {


    (function($) {
        var tiledata = $('#project-manager-data');
        if(tiledata.length == 0) return;

        tiledata = JSON.parse( decodeURIComponent(window.atob( tiledata.val() )) );
        const container = $('#project-manager-tile-continer');
        if(container.length == 0) return;

        for(const idx in tiledata) {
            container.find(`#name-${idx}`).text(tiledata[idx].name);
            container.find(`#email-${idx}`).text(tiledata[idx].email).attr('href', `mailto:${tiledata[idx].email}`);
        }

        window.macyInstance = Macy({
            container: '#project-manager-tile-continer',
            trueOrder: false,
            useContainerForBreakpoints: true,
            margin: 30,
            columns: 4,
            breakAt: {
                1000: 3,
                800: 2,
                600: 1
            }
        });

    })(jQuery);


    (function ($) {
        $('.supe-item-holder').find('[data-post_id]').each(function() { 
            const self = $(this);

            self.find('[href*="uczniowie"]').each( () => self.addClass('tax-uczen'));
            self.find('[href*="opiekunowie"]').each( () => self.addClass('tax-opiekun'));
            self.find('[href*="nauczyciele"]').each( () => self.addClass('tax-nauczyciel'));
            self.find('[href*="pedagodzy"]').each( () => self.addClass('tax-pedagog'));
        });
    })(jQuery);

    // set tooltip and inputmask

    (function ($) {
        $('.uksw-tooltip').tooltip();
        $(":input").inputmask();
    })(jQuery);


    // set min height page;

    (function ($) {
        if ($('#outerContent').length > 0) {
            $('#uksw-header').removeClass('mb-140');
            $('#uksw-footer').removeClass('mt-140');
        }

        const header = $('#uksw-header');
        const footer = $('#uksw-footer');
        const content = $('#uksw-content');

        $('#uksw-content').css('min-height', Math.floor($(document).height() - footer.outerHeight(true) - header.outerHeight(true) - content.outerHeight(true)) - 50 + "px");
    })(jQuery);

    // password input
    (function ($) {
        const hideIcon = $('.uksw-password-input-icons .uksw-icon-hide');
        const showIcon = $('.uksw-password-input-icons .uksw-icon-show');
        const input = $('.uksw-password-input-icons input');


        $('.uksw-password-input-icons').each(function (i, e, a) {
            const self = $(this);
            const input = self.find('input');
            if (input.length == 0) return;

            self.find('img').each(function () {
                const self = $(this);
                self.css('top', input.position().top + (input.outerHeight() / 2) - (self.outerHeight() / 2));
            });

            const hideIcon = self.find('.uksw-icon-hide');
            const showIcon = self.find('.uksw-icon-show');

            function fn(show) {
                if (show) {
                    showIcon.hide();
                    hideIcon.show();
                    input.attr('type', 'text');
                } else {
                    hideIcon.hide();
                    showIcon.show();
                    input.attr('type', 'password');
                }
            }

            hideIcon.click(fn.bind(hideIcon, false));
            showIcon.click(fn.bind(showIcon, true));

        });
    })(jQuery);


    // wcag

    (function ($) {
        const html = $('html');

        function GetOptions() {

            const options = {
                contrast: false,
                fontSize: 100
            };

            const contrast = $.cookie('wcag_contrast');
            const fontSize = $.cookie('wcag_fontSize', Number);

            if (contrast === 'true') options.contrast = true;
            else options.contrast = false;
            if (fontSize >= 100 && fontSize <= 150) options.fontSize = fontSize;

            return options;
        }

        function SetOptions(options) {

            if (options.contrast === true) {
                html.addClass('hight-contrast');
                $.cookie('wcag_contrast', true, { expires: 365, path: '/' });
            } else {
                html.removeClass('hight-contrast');
                $.cookie('wcag_contrast', false, { expires: 365, path: '/' });
            }

            if (options.fontSize === 150) {
                html.addClass('fontsize-l').removeClass('fontsize-m');
                $.cookie('wcag_fontSize', 150, { expires: 365, path: '/' });

            } else if (options.fontSize === 125) {
                html.addClass('fontsize-m').removeClass('fontsize-l');
                $.cookie('wcag_fontSize', 125, { expires: 365, path: '/' });

            } else {
                html.removeClass('fontsize-m').removeClass('fontsize-l');
                $.cookie('wcag_fontSize', 100, { expires: 365, path: '/' });

            }

            if(typeof(window.macyInstance) != 'undefined') {
                if(options.fontSize > 125) window.macyInstance.options.columns = 3;
                else window.macyInstance.options.columns = 4;
                window.macyInstance.reInit();
            }
        }

        const options = GetOptions();
        SetOptions(options);

        $('#wcag').find('img').click(function () {

            if (this.id === 'wcag-contrast') options.contrast = !options.contrast
            else if (this.id === 'wcag-font-size-biggest') options.fontSize = 150;
            else if (this.id === 'wcag-font-size-bigger') options.fontSize = 125;
            else options.fontSize = 100;

            SetOptions(options);
        });
    })(jQuery);


    // cookies popup
    ( function($) {
        const cookiesContainer = $('.uksw-cookies-info');
        if( typeof($.cookie('confirm_cookies_info')) == 'undefined' ) cookiesContainer.show();
        else cookiesContainer.hide();

        $('#uksw-cookies-close-info-btn').click(function(e) {
            e.preventDefault();
            $.cookie('confirm_cookies_info', true, {expires: 365,path: '/'});
            cookiesContainer.hide();
        })
    })(jQuery);


    

});

Number.prototype.pad = function (size) {
    var s = String(this);
    while (s.length < (size || 2)) { s = "0" + s; }
    return s;
}