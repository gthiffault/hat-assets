/* ==========================================================================
    #BARBA.JS 
========================================================================== */

  /* ======================================================================
      #EXTENDED PAGE
    ====================================================================== */ 

    var page = Barba.BaseView.extend({

      namespace: 'page',

      /* ==============================================================
          #ON ENTER 
        ============================================================== */
      
          onEnter: function() {

              TweenLite.to($('.barba-container'), 0, {

                  opacity: 1

              });  

        },

      /* ==============================================================
          #ON ENTER COMPLETED
        ============================================================== */

        onEnterCompleted: function() {

          $('html,body').animate({scrollTop:0},100);

function init() {
var vidDefer = document.getElementsByTagName('iframe');
for (var i=0; i<vidDefer.length; i++) {
if(vidDefer[i].getAttribute('data-src')) {
vidDefer[i].setAttribute('src',vidDefer[i].getAttribute('data-src'));
} } }
window.onload = init;


$(window).resize(function() {
if($(window).innerWidth() >= 1280 ) {
            TweenLite.to($('.c-emergency_label'), 0.3, {
              right: -42,
              opacity:1,
              ease: Sine.easeOut,
              delay:0 
            });                
            } else {
            TweenLite.to($('.c-emergency_label'), 0.3, {
              right: -55,
              opacity:1,
              ease: Sine.easeOut,
              delay:0 
            });   
           
            }  
})
//****************************************************************************//
    //TESTIMONIALS - COMMENTS
//****************************************************************************//
$(document).ready(function() {


   
    var array = [];
    var postID = '/432264780512618_' + $('.c-testimonials_id').text();
    window.fbAsyncInit = function() {
        FB.init({
            appId            : '516971002166010',
            autoLogAppEvents : true,
            xfbml            : true,
            version          : 'v3.2'
        });
        FB.api(
            postID,
            'GET',
            {access_token:'EAAHWLrDxevoBAGiYmSSJwef7U6uhICkMQPmCi3L0ZAVySwVJS0bhqspuQArqQqklQq0OsLGhyu4exvrsRM06RVw1zZC48zAP5C3K9hrIZBDe3ePL8IZAR9Tvl9nbCX4hjP1ypzQGcKinPIvXCG50IflZBUHDNSt1gCtZBuIMgfDW5x5UHNq22oEuZB3gX40Iv01bxvKU1xcn10X1A5tFzkHnZCWCyt5dinIUM6TxQa7KQgZDZD',
            fields:"comments.limit(10000){message,attachment,created_time}"},
            function (response) {
                if (response && !response.error) {
                    var i;
                    for (i = 0; i < response.comments['data'].length; i++) {
                        if(response.comments['data'][i]['message'] != null || response.comments['data'][i]['message'] != undefined) {
                            array.push(response.comments['data'][i]);
                        }
                    }
                }
            }
        );
    };
    setTimeout(function() {
        var x;
        if(array.length > 4) {

            $('.c-comments_view').show();
        }
        for (x = 0; x < array.length; x++) {

            var date = new Date(array[x]['created_time']);

if($(array[x]['attachment']).length) { 
    if($(array[x]['attachment']['type'] == "sticker")) { 
        $('.c-comments_ul').append($('<li class="c-comments_li">').append('<small>' + date.getDate() + '.' + (date.getMonth('F') + 1)  + '.' +  date.getFullYear() + '</small>' + '<p>' +  '<img src="' + array[x]['attachment']['target']['url']  + '"></p>')); 
    } else {
        $('.c-comments_ul').append($('<li class="c-comments_li">').append('<small>' + date.getDate() + '.' + (date.getMonth('F') + 1)  + '.' +  date.getFullYear() + '</small>' + '<p>' +  array[x]['message']  + '</p>'));        
    }
} else {
$('.c-comments_ul').append($('<li class="c-comments_li">').append('<small>' + date.getDate() + '.' + (date.getMonth('F') + 1)  + '.' +  date.getFullYear() + '</small>' + '<p>' +  array[x]['message']  + '</p>'));                    
}


    
        }
    },1000);

});

$('.c-comments_toggle').on('click', function() {
    $('.c-comments').slideToggle(400);
    $(this).toggleClass('-js-visibles-comments');
})

$('.c-share_toggle').on('click', function() {
    $('.c-share_options').slideToggle(400);
    $(this).toggleClass('-js-visibles-share');
})


$('.-emergency a').on('click', function() {
    $('.c-emergency_info').toggleClass('js-active');
})
$('#form').submit(function(ev) {
    // Prevent the form from actually submitting
    ev.preventDefault();

    // Send it to the server
    $.post({
        url: '/',
        dataType: 'json',
        data: $(this).serialize(),
        success: function(response) {
            if (response.success) {
                $('#thanks').fadeIn();
                alert('32453');
            } else {
                // response.error will be an object containing any validation errors that occurred, indexed by field name
                // e.g. response.error.fromName => ['From Name is required']
                alert('An error occurred. Please try again.');
            }
        }
    });
});




(function() {
    var secondary = new Headroom(document.querySelector(".c-header_navigation_secondary"), {
        tolerance: 5,
        offset : document.getElementById('page').offsetHeight - 86,
        classes: {
          initial: "animated",
          pinned: "slideInDown",
          unpinned: "slideOutUp"
        }
    });
    secondary.init();
    var main = new Headroom(document.querySelector(".c-header_navigation_primary"), {
        tolerance: 5,
        offset : document.getElementById('page').offsetHeight - 86,
        classes: {
          initial: "animated",
          pinned: "slideInDown",
          unpinned: "slideOutUp"
        }
    });
    main.init();

            var controllerFive = new ScrollMagic.Controller();
        if($('.c-quote').length) {
            new ScrollMagic.Scene({
                triggerHook: 0.9,
                triggerElement: '.c-quote',
                duration: $('.c-quote').height()
            })
  .setTween('.c-quote_wrap', {opacity:1,marginTop:0, ease: Linear.easeNone})
  .addTo(controllerFive);
        }     




        var controller = new ScrollMagic.Controller();
        if($('.c-content-icon').length) {
            new ScrollMagic.Scene({
                triggerHook: 0.2,
                triggerElement: '#contact',
                duration: $('#contact').height() + 144
            })
            .setTween(TweenMax.to('.c-content-icon', 1, {y: $('#contact').height()/2,opacity:0, ease: Linear.easeNone}))
            .addTo(controller);
        }



        var controllerOne = new ScrollMagic.Controller();
        if($('.o-wrapper.-two.-a .c-content').length) {
            new ScrollMagic.Scene({
                triggerHook: 1,
                triggerElement: '.o-wrapper.-two.-a',
                duration: $('.o-wrapper.-two.-a').height()
            })
            .setTween(TweenMax.to('.o-wrapper.-two.-a .c-content', 1, {y: '-50%', ease: Linear.easeNone}))
            .addTo(controllerOne);
        }

        var controllerOne = new ScrollMagic.Controller();
        if($('.o-wrapper.-two.-a .c-content').length) {
            new ScrollMagic.Scene({
                triggerHook: 0.5,
                triggerElement: '.o-wrapper.-two.-a',
                duration: $('.o-wrapper.-two.-a').height()
            })
            .setTween(TweenMax.to('.o-wrapper.-two.-a .c-content', 1, {y: '-75%', ease: Linear.easeNone}))
            .addTo(controllerOne);
        }        

        var controllerOne = new ScrollMagic.Controller();
        if($('.o-wrapper.-two.-b .c-content').length) {
            new ScrollMagic.Scene({
                triggerHook: 1,
                triggerElement: '.o-wrapper.-two.-b',
                duration: $('.o-wrapper.-two.-b').height()
            })
            .setTween(TweenMax.to('.o-wrapper.-two.-b .c-content', 1, {y: '-50%', ease: Linear.easeNone}))
            .addTo(controllerOne);
        }

        var controllerTwo = new ScrollMagic.Controller();
        if($('.o-wrapper.-two.-b .c-content').length) {
            new ScrollMagic.Scene({
                triggerHook: 0.5,
                triggerElement: '.o-wrapper.-two.-b',
                duration: $('.o-wrapper.-two.-b').height() + 110
            })
            .setTween(TweenMax.to('.o-wrapper.-two.-b .c-content', 1, {y: '-70%', ease: Linear.easeNone}))
            .addTo(controllerTwo);
        }                


            var controllerThree = new ScrollMagic.Controller();
        if($('.o-wrapper.-two.-a .c-content').length) {
            new ScrollMagic.Scene({
                triggerHook: 0,
                triggerElement: '.-version-zero',
                duration: $('.-version-zero').height()
            })
  .setTween('.c-txt-image.-version-zero .-first', {y: "15%", ease: Linear.easeNone})
  .addTo(controllerThree);
        }     

            var controllerFour = new ScrollMagic.Controller();
        if($('.o-wrapper.-two.-b .c-content').length) {
            new ScrollMagic.Scene({
                triggerHook: 0,
                triggerElement: '.c-image-txt.-version-zero',
                duration: $('.c-image-txt.-version-zero').height()
            })
  .setTween('.c-image-txt.-version-zero .-second', {y: "15%", ease: Linear.easeNone})
  .addTo(controllerFour);
        }     

        

//         var scrollMagicController = new ScrollMagic.Controller();

// $('.c-btn_div .-first').each(function() {
//   var currentElem = this;

//   var tweenButton = new TimelineMax().from(currentElem, 0.1, {
//     y: '100%',
//   });
//   var scene = new ScrollMagic.Scene({
//       triggerElement: currentElem,
//       triggerHook: 'onEnter',
//       offset: 100,
//       duration: currentElem,
//       ease: Power0.easeInOut
//     })
//     .setTween(tweenButton)
//     .addTo(scrollMagicController);
// });


// $('.c-btn_div .-second').each(function() {
//   var currentElem = this;

//   var tweenButton = new TimelineMax().from(currentElem, 0.1, {
//     x: '-100%'
//   });
//   var scene = new ScrollMagic.Scene({
//       triggerElement: currentElem,
//       triggerHook: 'onEnter',
//       offset: 100,
//       duration: currentElem,
//       ease: Power0.easeInOut
//     })
//     .setTween(tweenButton)
//     .addTo(scrollMagicController);
// });


// $('.c-btn_div .-third').each(function() {
//   var currentElem = this;

//   var tweenButton = new TimelineMax().from(currentElem, 0.1, {
//     y: '-100%'
//   });
//   var scene = new ScrollMagic.Scene({
//       triggerElement: currentElem,
//       triggerHook: 'onEnter',
//       offset: 100,
//       duration: currentElem,
//       ease: Power0.easeInOut
//     })
//     .setTween(tweenButton)
//     .addTo(scrollMagicController);
// });

// $('.c-btn_div .-four').each(function() {
//   var currentElem = this;

//   var tweenButton = new TimelineMax().from(currentElem, 0.1, {
//     x: '100%'
//   });
//   var scene = new ScrollMagic.Scene({
//       triggerElement: currentElem,
//       triggerHook: 'onEnter',
//       offset: 100,
//       duration: currentElem,
//       ease: Power0.easeInOut
//     })
//     .setTween(tweenButton)
//     .addTo(scrollMagicController);
// });

}());



$("#c-testimonials_image").stick_in_parent({
    offset_top:174,
    sticky_class:"c-element-fixed"
});

// JQUERY
$('.c-accordion_title').on('click', function() {
$(this).next('.c-accordion_content_wrap').slideToggle(400);
$(this).toggleClass('-js-accordion-active')
}) 



if($('c-testimonials_form').length) {
     $(function() {
       window.emojiPicker = new EmojiPicker({
         emojiable_selector: '[data-emojiable=true]',
         assetsPath: 'https://humain-avant-tout.agencezel.dev/assets/img/emoji/',
         popupButtonClasses: 'fa fa-smile-o'
       });
     });

              var connection = window.navigator.connection    ||
                         window.navigator.mozConnection ||
                         null;
        if (connection === null) {
           document.getElementById('ni-unsupported').classList.remove('hidden');
        } else if ('metered' in connection) {
           document.getElementById('nio-supported').classList.remove('hidden');
           [].slice.call(document.getElementsByClassName('old-api')).forEach(function(element) {
              element.classList.remove('hidden');
           });
 
           var bandwidthValue = document.getElementById('b-value');
           var meteredValue = document.getElementById('m-value');
 
           connection.addEventListener('change', function (event) {
              bandwidthValue.innerHTML = connection.bandwidth;
              meteredValue.innerHTML = (connection.metered ? '' : 'not ') + 'metered';
           });
           connection.dispatchEvent(new Event('change'));
        } else {
           var typeValue = document.getElementById('t-value');
           [].slice.call(document.getElementsByClassName('new-api')).forEach(function(element) {
              element.classList.remove('hidden');
           });
 
           connection.addEventListener('typechange', function (event) {
              typeValue.innerHTML = connection.type;
           });
           connection.dispatchEvent(new Event('typechange'));
        }

}



            $(window).on('resize', function() {
if($(window).innerWidth() >= 1280 ) {
            TweenLite.to($('.c-emergency_label'), 0.3, {
              right: -42,
              opacity:1,
              ease: Sine.easeOut, 
              delay:5
            });                      
            } else {
            TweenLite.to($('.c-emergency_label'), 0.3, {
              right: -55,
              opacity:1,
              ease: Sine.easeOut, 
              delay:5
            });               
            }  
})

// $('.no-barba').on('click', function() {
//      TweenLite.to($('.c-page_transition'), 0.0, {
//               top: '100vh',
//             });
//             TweenLite.to($('.c-page_transition'), 0.3, {
//               top: '0',
//               ease: Sine.easeOut, 
//             });
//             TweenLite.to($('.c-image_transition'), 0.0, {
//               ease: Sine.easeOut, 
//               marginTop:'120px',
//               opacity:1,
//               zIndex:23456
//             });

//             TweenLite.to($('.c-image_transition'), 0.3, {
//               ease: Sine.easeOut, 
//               opacity:1,
//               marginTop:0,              
//             });
//             TweenLite.to($('#Artboard'), 0.0, {
//               ease: Sine.easeOut, 
//               stroke:'#FFF'
// });

// })


 $(function() {
        $('.lazy').Lazy();
    });

$('.c-sidebar_item.-emergency a').hover(function() {
  $('body').toggleClass('-js-emergency');
})

$(document).ready(function() {
    $('.fb-share').click(function(e) {
        e.preventDefault();
        window.open($(this).attr('href'), 'fbShareWindow', 'height=450, width=550, top=' + ($(window).height() / 2 - 275) + ', left=' + ($(window).width() / 2 - 225) + ', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');
        return false;
    });
});

          
        },

      /* ==============================================================
        #ON LEAVE
        ============================================================== */

          onLeave: function() {
              // A new Transition toward a new page has just started.
        },

      /* ==============================================================
        #ON LEAVE COMPLETED
        ============================================================== */

          onLeaveCompleted: function() {

          }

    });
/* ==================================================================
      #INIT PAGE 
      ================================================================== */     

      // Don't forget to init the view!
      page.init();

      $(document).ready(function() {
          Barba.Pjax.start();
      })

  /* ==================================================================
      #TRANSITION
      ================================================================== */ 

      /* ==============================================================
        #BARBA TRANSITION
        ============================================================== */

        var FadeTransition = Barba.BaseTransition.extend({

            start: function() {
                Promise
                  .all([this.newContainerLoading, this.fadeOut()])
                  .then(this.fadeIn.bind(this));
            },

            fadeOut: function() {
            TweenLite.to($('.c-page_transition'), 0.0, {
              top: '100vh',
            });
            TweenLite.to($('.c-page_transition'), 0.5, {
              top: '0',
              ease: Sine.easeOut, 
            });
            TweenLite.to($('.c-image_transition'), 0.0, {
              ease: Sine.easeOut, 
              marginTop:'120px',
              opacity:1,
              zIndex:23456
            });

            TweenLite.to($('.c-image_transition'), 0.5, {
              ease: Sine.easeOut, 
              opacity:1,
              marginTop:0,              
            });

var logo = new Vivus('load', {
  type: 'async',
  duration: 75,
  animTimingFunction: Vivus.EASE,
  start: 'autostart'
});
            TweenLite.to($('#Artboard'), 0.0, {
              ease: Sine.easeOut, 
              stroke:'#FFF'
});


       return $(this.oldContainer).animate({ opacity: 1 }, 1000).promise();

               

            },

            fadeIn: function() {
                var _this = this;
                var $el = $(this.newContainer);
                $(function() {});
                _this.done();
            }

        });

        Barba.Pjax.getTransition = function() {
            return FadeTransition;
        };

    /* ==================================================================
        #INIT STATE CHANGE
      ================================================================== */

      Barba.Dispatcher.on('initStateChange', function(currentStatus) {



      })
/* ==================================================================
        #TRANSITION COMPLETED
      ================================================================== */   

      Barba.Dispatcher.on('transitionCompleted', function(currentStatus, prevStatus) {
/* ==================================================================
            #TRANSITION
          ================================================================== */


            TweenLite.to($('.c-title_top'), 0.5, {
              opacity:1,
              marginBottom:0,
              zIndex:9999,
              ease: Sine.easeOut, 
              delay: 0.2, 
            }); 


            TweenLite.to($('.c-title_bottom'), 0.5, {
              opacity:1,
              marginTop:0,
              zIndex:9999,
              ease: Sine.easeOut, 
              delay: 0.2, 
            });               
            TweenLite.to($('.c-title_text'), 0.5, {
              opacity:1,
              zIndex:9999,
              ease: Sine.easeOut, 
              delay: 0.4, 
            });  

            TweenLite.to($('.c-page_transition'), 0.5, {
              top: '-100vh',
              ease: Sine.easeOut, 
            });


            TweenLite.to($('.c-image_transition'), 0.25, {
              ease: Sine.easeOut, 
              opacity:0,
              marginTop:'-120px',
               zIndex: '-1'  
            });

            TweenLite.to($('.c-sidebar'), 0.3, {
              right: 0,
              ease: Sine.easeOut, 
              delay:0.75
            });
 

           
if($(window).innerWidth() >= 1280 ) {
            TweenLite.to($('.c-emergency_label'), 0.3, {
              right: -42,
              opacity:1,
              ease: Sine.easeOut, 
              delay:5
            });                
            TweenLite.to($('.c-emergency_label'), 0.3, {
              right: 54,
              opacity:1,
              
                            ease: Sine.easeOut, 
              delay:0.75
            });                   
            } else {
            TweenLite.to($('.c-emergency_label'), 0.3, {
              right: -55,
              opacity:1,
              ease: Sine.easeOut, 
              delay:5
            });   
            TweenLite.to($('.c-emergency_label'), 0.3, {
              right: 40,
              opacity:1,
              
                            ease: Sine.easeOut, 
              delay:0.75
            });                          
            }  

           



      })  


 (function _(a,b,c,d,e){var f=window.console;if(window[c])return;if(!window.JSON)return;var g=window[c]={__buffer:{replay:function(){var a=this,b=function(d){var b=window[c];a.calls[d][0].split(".").forEach(function(a){return b=b[a]});b.apply(null,a.calls[d][1])};for(var d=0;d<this.calls.length;d++)b(d);this.calls=[]},calls:[],opts:null},getUserID:function(){return""},getAuthResponse:function(){return null},getAccessToken:function(){return null},init:function(a){g.__buffer.opts=a}};for(var b=0;b<d.length;b++){f=d[b];if(f in g)continue;var h=f.split("."),i=h.pop(),j=g;for(var k=0;k<h.length;k++)j=j[h[k]]||(j[h[k]]={});j[i]=function(a){if(a==="init")return;return function(){g.__buffer.calls.push([a,Array.prototype.slice.call(arguments)])}}(f)}k=a;h=/Chrome\/(\d+)/.exec(navigator.userAgent);h&&Number(h[1])>=55&&"assign"in Object&&"findIndex"in[]&&(k+="&ua=modern_es6");j=document.createElement("script");j.src=k;j.async=!0;e&&(j.crossOrigin="anonymous");i=document.getElementsByTagName("script")[0];i.parentNode&&i.parentNode.insertBefore(j,i)})("https:\/\/connect.facebook.net\/fr_CA\/sdk.js?hash=eb854bb36b11e5d0f15ca21c2026c015", 1554433319, "FB", ["AppEvents.EventNames","AppEvents.ParameterNames","AppEvents.activateApp","AppEvents.clearAppVersion","AppEvents.clearUserID","AppEvents.getAppVersion","AppEvents.getUserID","AppEvents.logEvent","AppEvents.logPageView","AppEvents.logPurchase","AppEvents.setAppVersion","AppEvents.setUserID","AppEvents.updateUserProperties","Canvas.Plugin.showPluginElement","Canvas.Plugin.hidePluginElement","Canvas.Prefetcher.addStaticResource","Canvas.Prefetcher.setCollectionMode","Canvas.getPageInfo","Canvas.scrollTo","Canvas.setAutoGrow","Canvas.setDoneLoading","Canvas.setSize","Canvas.setUrlHandler","Canvas.startTimer","Canvas.stopTimer","Event.subscribe","Event.unsubscribe","XFBML.parse","addFriend","api","getAccessToken","getAuthResponse","getLoginStatus","getUserID","init","login","logout","publish","share","ui"], true);      