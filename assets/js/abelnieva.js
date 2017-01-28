/**
 * abelnieva - The source code of personal website based on Jekyll.
 * @version v1.0.0
 * @link    https://abelnieva.com
 * @author  Abel Nieva <abel@abelnieva.com>
 * @license ISC
 */
var AN = AN || {};

AN = (function ($) {

  var _api,
      dom;

  _api = {};
  dom = {
    document: $(document),
    html: $('html'),
    email: $('#js-email'),
    links: $('a'),
    gallery: $('#js-gallery'),
    galleryBtn: $('#js-gallery').find('li'),
    siteNavBtn: $('#js-site-nav-btn'),
    siteNavIcon: $('#js-site-nav-btn').find('.icon'),
    siteNavList: $('.site-nav__list')
  };

  function init() {
    buildEmail();
    linksWithTargetBlank();
    gallery();
    siteNavBtn();
  }

  function buildEmail() {
    var email;

    email = dom.email.attr('data-email');
    email = email.replace(RegExp(' dot ', 'gi'), '.');
    email = email.replace(RegExp(' at ', 'gi'), '@');
    dom.email.attr('href', 'mailto:' + email);
  }

  function linksWithTargetBlank() {
    dom.links = dom.links.toArray();
    dom.links.forEach(function targetBlank(item, index) {
      var href = item.getAttribute('href');

      if (!href.search(/http/g)) {
        item.setAttribute('target', '_blank');
      }
    });
  }

  function gallery() {
    dom.galleryBtn = dom.galleryBtn.toArray();
    dom.galleryBtn.forEach(function galleryBtn(item, index) {
      var href = item.getAttribute('data-img');

      $(item).click(function onClickGalleryBtn(event) {
        dom.html.append(getLightbox(href));

        $('#js-lightbox').fadeIn('fast', function showLightboxBtn() {
          dom.html.css('overflow', 'hidden');
        });
      });
    });
  }

  function getLightbox(value) {
    return '<div id="js-lightbox" style="display:none;" class="lightbox"><button class="lightbox__btn" onclick="AN.onClickLightboxBtn()">' +
      '<span class="icon  icon--cross"></span></button><div class="lightbox__item"><img src="' + value + '"/></div></div>';
  }

  function siteNavBtn() {
    dom.siteNavBtn.click(function onClickSiteNavBtn(event) {
      dom.siteNavIcon.toggleClass('icon--cross');
      dom.siteNavList.toggleClass('show');
      $('html').toggleClass('overflowHidden');
    });

    $('html, body').on('touchmove', function(event) {
      if($('html').hasClass('overflowHidden')) {
        event.preventDefault(); 
      }
    });
  }

  _api.onClickLightboxBtn = function(value) {
    $('html').css('overflow', 'visible');
    $('#js-lightbox').fadeOut('fast', function removeLightboxBtn() {
      this.remove();
    });
  };

  init();

  return _api;

})(jQuery);
