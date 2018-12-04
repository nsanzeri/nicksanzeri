/*------------------------------------------------------------------
 Deft - Deft One Page Wordpress Theme

Copyright (C) 2018 Coderare
-------------------------------------------------------------------*/

(function( $ ) {

$( document ).ready(function() {
  "use strict";


  if (window.matchMedia("(max-width: 480px)").matches) {
      $('.deft-primary-menu').prependTo('#parent');
      $('.mobile-menu-icon').prependTo('#parent');

      $('.deft-nav a').on('click', function() {
        $(this).parents('.deft-primary-menu').toggleClass('visible');
        $('.mobile-menu-icon').children('i').toggleClass('fa-bars');
        $('.mobile-menu-icon').children('i').toggleClass('ion-close-round');
      });
    }

function link_is_external(link_element) {
  return (link_element.host !== window.location.host);
}

NProgress.configure({ showSpinner: false });

function ChangeUrl(page, url) {
    if (typeof (history.pushState) != "undefined") {
        var obj = { Page: page, Url: url };
          window.history.pushState(obj, obj.Page, obj.Url);
    }
}

var $content = $('.content-container');

window.onpopstate = function(event) {
  var link = document.location;
  getAjaxContent(link, $content);
  getTitleTag(link);

};

$('.current_page_item').addClass('h_active');

/**
 * Open all external links in a new window
 */
jQuery(document).ready(function($) {
	$('a')
		.filter('[href^="http"], [href^="//"]')
		.not('[href*="' + window.location.host + '"]')
		.attr('rel', 'noopener noreferrer')
		.attr('target', '_blank');
});

$('.ajax-anchorTag a[href^="http"]').live('click', function(e) {


    if(!link_is_external(this) ) {
      e.preventDefault();
      $('.content-container').addClass('animate-container');

      var $url = $(this).attr('href');
      ChangeUrl('url', $url);
      var link = jQuery(this).attr('href');
      getAjaxContent(link, $content);
      getTitleTag(link);
    }
  });

  var xhr = null;

  var getAjaxContent = function (link, $content) {
    if( xhr != null ) {
          xhr.abort();
          xhr = null;
    }

    xhr = $.ajax({
      type: 'POST',
      url: link,
      beforeSend: function() {
       NProgress.start();
      },
      complete: function () {
        setTimeout(function(){
          $('#rightContent').mCustomScrollbar("scrollTo",'top', {
            scrollInertia : 0,
          });
        }, 100);
      },
      success: function(data) {
        $content.html( $(data).find('.content') );
        post_img_holder();
        masonry_item();
        owl_carousel();
        initPhotoSwipeFromDOM('.my-gallery');
        isLightbox();

        var wpcf7_form = document.getElementsByClassName('wpcf7-form');
        [].forEach.call(wpcf7_form, function( form ) {
          wpcf7.initForm( form );
        });

        $('.deft-nav a').each(function() {
          if ($(this).attr('href') == window.location.href) {
            $(this).parent().addClass('h_active');
            $(this).parent().siblings().removeClass('h_active');
          }
        });

        // $('.deft-pagination a').addClass('btn-solid round');
        $('.content').imagesLoaded( function() {
          NProgress.done();

          setTimeout(function(){
            $('.content-container').removeClass('animate-container');
          }, 200);


        });

      },
      fail: function () {}
    });
  }

  function getTitleTag(link) {
    // pass param url
    // using ajax
    $.ajax({
        url : link,
        type : 'GET',
        success : function (response) {
            // function with response data
             var matches = $(response).filter('title').text();
            // show meta tag value
            $(document).prop('title', matches);
        }
    });
  }

  // function getAjaxContent (link) {
  //   NProgress.start();
  //
  //   $('.content-container').animate({opacity: '0'});
  //
  //   $('.content-container').load(link+' .content', function(response, status, xhr) {
  //     post_img_holder();
  //     masonry_item();
  //     owl_carousel();
  //     initPhotoSwipeFromDOM('.my-gallery');
  //     isLightbox();
  //     var wpcf7_form = document.getElementsByClassName('wpcf7-form');
  //     [].forEach.call(wpcf7_form, function( form ) {
  //       wpcf7.initForm( form );
  //     });
  //
  //     $('.deft-nav a').each(function() {
  //       if ($(this).attr('href') == window.location.href) {
  //         $(this).parent().addClass('h_active');
  //         $(this).parent().siblings().removeClass('h_active');
  //       }
  //     });
  //
  //     $('.deft-pagination a').addClass('btn-solid round');
  //     $('.content').imagesLoaded( function() {
  //       NProgress.done();
  //         if (NProgress.done()) {
  //           $('.content-container').animate({opacity: '1'});
  //
  //         }
  //     });
  //   });
  //
  // }


  $("#rightContent").mCustomScrollbar({
      axis:"y",
      theme:"minimal-dark",
      scrollbarPosition: 'outside',
      scrollInertia: 120,
      setHeight: '100%',
      setTop: 0,
  });

  $("#rightContent").mCustomScrollbar({
      //your scrollbar options
  }).on("mouseenter",function(){
      $(this).find("iframe").css("pointer-events","none");
  }).on("mouseup",function(){
      if(!$(this).find(".mCSB_scrollTools_onDrag").length) return;
      setTimeout(function(){ $("#rightContent").trigger("mouseenter"); },1);
  });
  $(window).on("blur",function(){
      $("#rightContent iframe").css("pointer-events","auto");
  }).on("focus",function(){
      $("#rightContent").trigger("mouseenter");
  });


  function isLightbox () {
    if ($isLightBox) {
    $('img').each(function(){
      var $imgAlt = $(this).attr("alt");
      var checkSwipe = $(this).parent('a').attr('itemprop');
      if (!checkSwipe) {
        $(this).parent('a').attr('data-lightbox', $imgAlt);
      }
    });
  }
  } isLightbox();


  $('#nav-icon1,#nav-icon2,#nav-icon3,#nav-icon4').click(function(){
  $(this).toggleClass('open');
});


// Masonry
function masonry_item() {
  var $grid = $('.deft-posts-container').imagesLoaded( function() {
    $grid.masonry({
      itemSelector: '.grid-item',
    });
  });

  var $project = $('.my-gallery').imagesLoaded( function() {
    $project.masonry({
      itemSelector: '.item',
    });
  });

} masonry_item();

// Owl carousel
function owl_carousel() {

  function getItem() {
    var item = $('.owl-carousel').attr("showItem");
    return item;
  }

  function displaynav() {
    var displaynav = $('.owl-carousel').attr("displaynav");
    if (displaynav == 'true') {
      return true;
    } else if (displaynav == 'false') {
      return false;
    }
  }

  function autowidth() {
    var autowidth = $('.owl-carousel').attr("autowidth");
    if (autowidth == 'true') {
      return true;
    } else if (autowidth == 'false') {
      return false;
    }
  }

  function getItemMargin() {
    var margin = $('.owl-carousel').attr("margin");
    return parseInt(margin);
  }

  $('.owl-carousel').owlCarousel({
    items : getItem(),
    margin: getItemMargin(),
    dots: false,
    nav: displaynav(),
    autoWidth: autowidth(),
    navClass: ['owl-prev fa fa-angle-left', 'owl-next fa fa-angle-right'],
    navText: false,
    responsiveClass:true,
    responsive:{
      0:{
          items:1,
      },
      768:{
          items:2,
      },
      1000:{
          items:getItem(),
      },
    }
  });

} owl_carousel();

/* ------------------------------------- */
/* Page Loading    ................... */
/* ------------------------------------- */
  $(".animsition").animsition({    inClass: 'fade-in',
    outClass: 'fade-out',
    inDuration: 300,
    outDuration: 800,
    linkElement: '.a-link',
    // e.g. linkElement: 'a:not([target="_blank"]):not([href^="#"])'
    loading: true,
    loadingParentElement: 'body', //animsition wrapper element
    loadingClass: 'animsition-loading',
    loadingInner: '', // e.g '<img src="loading.svg" />'
    timeout: false,
    timeoutCountdown: 5000,
    onLoadEvent: true,
    browser: [ 'animation-duration', '-webkit-animation-duration'],
    // "browser" option allows you to disable the "animsition" in case the css property in the array is not supported by your browser.
    // The default setting is to disable the "animsition" in a browser that does not support "animation-duration".
    overlay : false,
    overlayClass : 'animsition-overlay-slide',
    overlayParentElement : 'body',
    transition: function(url){ window.location.href = url; }
  });

$('body').on('animsition.inEnd', function(){
  $("#leftSide").addClass('instate');
});

/* ---------------------------------------------*/
/* animations for subscribe form & rightside ...*/
/* --------------------------------------------- */

$(function() {
  var map = document.getElementById('map');
  var mapToggle = document.getElementById('mapToggle');
  var btnSwitch = $(mapToggle).children('#switch');
  var home = document.getElementById('home');
  var midAnimate = $(home).find('.mid');
  var slowAnimate = $(home).find('.slow');

    function toggleMap (mapToggle, btnSwitch, map, home, midAnimate, slowAnimate) {
      $(btnSwitch).toggleClass('active');
      $(map).toggleClass('active');
      $(home).toggleClass('hidden');
      $(midAnimate).removeClass('mid');
      $(slowAnimate).removeClass('slow');
    }
    $(mapToggle).on('click', function(event) {
      event.preventDefault();
      if (event.target.hash === '#toggle') {
        toggleMap (mapToggle, btnSwitch, map, home, midAnimate, slowAnimate);
      }
    });
});

$(function() {
  var parent = document.getElementById('parent');
  var leftSide = $(parent).children('#leftSide');
  var navMenu = $(leftSide).find('#navMenu');
  var subscribe = $(parent).children('#subscribe');
  var rightSide = $(parent).children('#rightSide');
  var rightContent = $(rightSide).children('#rightContent');
  var moreInfoBtn = $(parent).find('#info');
  var closeBtn = $('<a href="#closesub"><i class="close-btn ion-close-round"></i></a>');
  var subOverlay = $('<div class="sub_overlay"></div>');
  var mobileMenuIcon = $('.mobile-menu-icon');
  var deftNavParent = ('.deft-primary-menu');
  var deftNav = $('.deft-nav');

  function showMobileNav(e, mobileMenuIcon, deftNav, deftNavParent) {
    e.preventDefault();
      $(deftNavParent).toggleClass('visible');
      $(deftNav).children
      $(mobileMenuIcon).children('i').toggleClass('fa-bars');
      $(mobileMenuIcon).children('i').toggleClass('ion-close-round');
    }

  function showSubscribe (event, leftSide, subscribe, closeBtn) {
    event.preventDefault();
    $(subscribe).addClass('fadeup');
    $(subOverlay).toggleClass('visible');

    $(subOverlay).on('click', function(){
      $(this).removeClass('visible');
      $(subscribe).removeClass('fadeup');
    });

    $(closeBtn).on('click', function(event) {
      event.preventDefault();
      $(subscribe).removeClass('fadeup');
      $(subOverlay).removeClass('visible');

    });
  }

  function enableInformation (leftSide, navMenu, rightSide, rightContent, moreInfoBtn) {

    $(leftSide).addClass('drag');

    if ($(parent).children('.main-logo.fixed')) {
      $(parent).children('.main-logo.fixed').toggleClass('hidden');
    }
    $(navMenu).addClass('visible');
    $(rightSide).addClass('expand');
    $(rightContent).addClass('showcontent');
    $(moreInfoBtn).children('i').toggleClass('ion-navicon-round');
    $(moreInfoBtn).children('i').toggleClass('ion-close-round');
  }

  function showContent (event, leftSide, navMenu, rightSide, rightContent, moreInfoBtn) {
    event.preventDefault();

    $(leftSide).toggleClass('drag');

    if ($(parent).children('.main-logo.fixed')) {
      $(parent).children('.main-logo.fixed').toggleClass('hidden');
    }

    $(navMenu).toggleClass('visible');
    $(rightSide).toggleClass('expand');
    $(rightContent).toggleClass('showcontent');
    $(moreInfoBtn).children('i').toggleClass('ion-navicon-round');
    $(moreInfoBtn).children('i').toggleClass('ion-close-round');
  }

  function addingContent (moreInfoBtn, subscribe, closeBtn, subOverlay) {
    var infoIcon = $('<i class="ion-navicon-round menu pr10"></i>');
    if($(moreInfoBtn).hasClass('btn-solid') || $(moreInfoBtn).hasClass('round') ) {
      $(moreInfoBtn).prepend(infoIcon);
    }
    $(subscribe).children('.border').prepend(closeBtn);
    $(subscribe).before(subOverlay);

  } addingContent (moreInfoBtn, subscribe, closeBtn, subOverlay)


  $(parent).on('click', function(event) {
    if (event.target.hash === '#info' || event.target.classList.contains('info-tab')) {
      showContent (event, leftSide, navMenu, rightSide, rightContent, moreInfoBtn);
    } else if (event.target.hash === '#subscribe' || event.target.classList.contains('subs')) {
      showSubscribe (event, leftSide, subscribe, closeBtn);
    } else if (event.target.hash === '#menu' || event.target.classList.contains('menu')) {
      showMobileNav (event, mobileMenuIcon, deftNav, deftNavParent);
    }
  });

  if (!deft_ajax.is_front_page && window.matchMedia('(min-width: 1025px)').matches) {
    enableInformation(leftSide, navMenu, rightSide, rightContent, moreInfoBtn);
  }
});


/* ------------------------------------- */
/* PhotoSwipe   ................... */
/* ------------------------------------- */
  var initPhotoSwipeFromDOM = function(gallerySelector) {
    // parse slide data (url, title, size ...) from DOM elements
    // (children of gallerySelector)
    var parseThumbnailElements = function(el) {
        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            figureEl,
            linkEl,
            size,
            item;

        for(var i = 0; i < numNodes; i++) {

            figureEl = thumbElements[i]; // <figure> element

            // include only element nodes
            if(figureEl.nodeType !== 1) {
                continue;
            }

            linkEl = figureEl.children[0]; // <a> element

            size = linkEl.getAttribute('data-size').split('x');

            // create slide object
            item = {
                src: linkEl.getAttribute('href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            };

            if(figureEl.children.length > 1) {
                // <figcaption> content
                item.title = figureEl.children[1].innerHTML;
            }

            if(linkEl.children.length > 0) {
                // <img> thumbnail element, retrieving thumbnail url
                item.msrc = linkEl.children[0].getAttribute('src');
            }

            item.el = figureEl; // save link to element for getThumbBoundsFn
            items.push(item);
        }

        return items;
    };

    // find nearest parent element
    var closest = function closest(el, fn) {
        return el && ( fn(el) ? el : closest(el.parentNode, fn) );
    };

    // triggers when user clicks on thumbnail
    var onThumbnailsClick = function(e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var eTarget = e.target || e.srcElement;

        // find root element of slide
        var clickedListItem = closest(eTarget, function(el) {
            return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
        });

        if(!clickedListItem) {
            return;
        }

        // find index of clicked item by looping through all child nodes
        // alternatively, you may define index via data- attribute
        var clickedGallery = clickedListItem.parentNode,
            childNodes = clickedListItem.parentNode.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;

        for (var i = 0; i < numChildNodes; i++) {
            if(childNodes[i].nodeType !== 1) {
                continue;
            }

            if(childNodes[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }

        if(index >= 0) {
            // open PhotoSwipe if valid index found
            openPhotoSwipe( index, clickedGallery );
        }
        return false;
    };

    // parse picture index and gallery index from URL (#&pid=1&gid=2)
    var photoswipeParseHash = function() {
        var hash = window.location.hash.substring(1),
        params = {};

        if(hash.length < 5) {
            return params;
        }

        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if(!vars[i]) {
                continue;
            }
            var pair = vars[i].split('=');
            if(pair.length < 2) {
                continue;
            }
            params[pair[0]] = pair[1];
        }

        if(params.gid) {
            params.gid = parseInt(params.gid, 10);
        }

        return params;
    };

    var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;

        items = parseThumbnailElements(galleryElement);

        // define options (if needed)
        options = {

          history: false,

            // define gallery index (for URL)
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),

            getThumbBoundsFn: function(index) {
                // See Options -> getThumbBoundsFn section of documentation for more info
                var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect();

                return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
            }

        };

        // PhotoSwipe opened from URL
        if(fromURL) {
            if(options.galleryPIDs) {
                // parse real index when custom PIDs are used
                // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                for(var j = 0; j < items.length; j++) {
                    if(items[j].pid == index) {
                        options.index = j;
                        break;
                    }
                }
            } else {
                // in URL indexes start from 1
                options.index = parseInt(index, 10) - 1;
            }
        } else {
            options.index = parseInt(index, 10);
        }

        // exit if index not found
        if( isNaN(options.index) ) {
            return;
        }

        if(disableAnimation) {
            options.showAnimationDuration = 0;
        }

        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    };

    // loop through all gallery elements and bind events
    var galleryElements = document.querySelectorAll( gallerySelector );

    for(var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i+1);
        galleryElements[i].onclick = onThumbnailsClick;
    }

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    var hashData = photoswipeParseHash();
    if(hashData.pid && hashData.gid) {
        openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
    }
};

// execute above function
initPhotoSwipeFromDOM('.my-gallery');

/* ------------------------------------- */
/* Backgound img Appending................... */
/* ------------------------------------- */

  $(function () {
    $('.background-img-holder').each(function(){
      var $imgSrc = $(this).children("img").attr("src");
      $(this).children("img").hide();
      $(this).css('background','url("'+$imgSrc+'")');
      $(this).css('background-size', 'cover');
      $(this).css('background-position', 'center');
      $(this).css('height', '100%');
    });
  });

function post_img_holder() {
  $('.post-img-holder').each(function(){
    var $imgSrc = $(this).children("img").attr("src");
    $(this).children("img").hide();
    $(this).css('background','url("'+$imgSrc+'")');
    $(this).css('background-size', 'cover');
    $(this).css('background-position', 'center');
    $(this).css('height', '100%');
  });
} post_img_holder();

/* ------------------------------------- */
/* CountDown Timer   ................... */
/* ------------------------------------- */

  $('#timerTwo')
  .countdown($('#timerTwo').attr("data-date")).on('update.countdown', function(event) {
    var $this = $(this).html(event.strftime(''
    + '<div class="clock-box"><span class="simple">%-D</span>days  </div>'
    + '<div class="clock-box"><span class="simple"> %H</span>h  </div>'
    + '<div class="clock-box"><span class="simple"> %M</span>m  </div>' ));  });


/* ------------------------------------- *//*
  Subscribe Form   ................... */
/* ------------------------------------- */

$(function() {
  ajaxMailChimpForm($("#subscribe-form"), $("#subscribe-result"));
  // Turn the given MailChimp form into an ajax version of it.
  // If resultElement is given, the subscribe result is set as html to
  // that element.
  function ajaxMailChimpForm($form, $resultElement){

      // Hijack the submission. We'll submit the form manually.
      $form.submit(function(e) {
          e.preventDefault();
          if (!isValidEmail($form)) {
              var error =  "A valid email address must be provided. Please check it and try again.";
              $resultElement.removeClass('success');
              setTimeout(function() {
                $resultElement.addClass('error');
                $resultElement.html(error);
              }, 150);

              setTimeout(function() {
                $resultElement.removeClass('error');
              }, 2500);

          } else {
            $resultElement.removeClass('success');
            $resultElement.removeClass('error');

            setTimeout(function() {
              if ( $('#subscribe').hasClass('vertical') ) {
                $('body').prepend('<div class="loading"></div>');
              } else {
                $('#subscribe').append('<div class="loading"></div>');
              }
              submitSubscribeForm($form, $resultElement);
            }, 150);

          }
      });
  }
  // Validate the email address in the form
  function isValidEmail($form) {
      // If email is empty, show error message.
      // contains just one @
      var email = $form.find("input[type='email']").val();
      if (!email || !email.length) {
          return false;
      } else if (email.indexOf("@") == -1) {
          return false;
      }
      return true;
  }
  // Submit the form with an ajax/jsonp request.
  // Based on http://stackoverflow.com/a/15120409/215821
  function submitSubscribeForm($form, $resultElement) {
      $.ajax({
          type: "GET",
          url: $form.attr("action"),
          data: $form.serialize(),
          cache: false,
          dataType: "jsonp",
          jsonp: "c", // trigger MailChimp to return a JSONP response
          contentType: "application/json; charset=utf-8",
          error: function(error){
            $resultElement.removeClass('success');

            setTimeout(function() {
              $resultElement.addClass('error');
            }, 800);

            setTimeout(function() {
              $resultElement.removeClass('error');
            }, 2500);

              // According to jquery docs, this is never called for cross-domain JSONP requests
          },
          success: function(data){
              if (data.result != "success") {
                  var message = data.msg || "Sorry. Unable to subscribe. Please try again later.";
                  if (data.msg && data.msg.indexOf("already subscribed") >= 0) {

                      message = "You're already subscribed. Thank you.";
                  }
                  $resultElement.removeClass('error');
                  $('#subscribe').children('.loading').remove();
                  $('body').children('.loading').remove();


                  setTimeout(function() {
                    $resultElement.addClass('success');
                    $resultElement.html(message);
                  }, 150);

                  setTimeout(function() {
                    $resultElement.removeClass('success');
                  }, 2500);

              } else {
                $resultElement.removeClass('error');
                $('#subscribe').children('.loading').remove();
                $('body').children('.loading').remove();


                setTimeout(function() {
                  $resultElement.addClass('success');
                  $resultElement.html("Thank you! You must confirm the subscription in your inbox.");
                }, 150);

                setTimeout(function() {
                  $resultElement.removeClass('success');
                }, 2500);

              }
          }
      });
  }
});

});

})( jQuery );
