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

$('html').removeClass('-js-transition-menu');
$('html').removeClass('-js-menu-active');
              TweenLite.to($('.barba-container'), 0, {

                  opacity: 1

              });  

              $('html,body').animate({scrollTop:0},100);

        },

      /* ==============================================================
          #ON ENTER COMPLETED
        ============================================================== */

        onEnterCompleted: function() {

// OO - Class - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)
// Based on http://ejohn.org/blog/simple-javascript-inheritance/
// which is based on implementations by Prototype / base2

;(function(){
  var global = this, initialize = true
  var referencesSuper = /xyz/.test(function(){ xyz }) ? /\b__super__\b/ : /.*/

  /**
   * Shortcut for Class.extend()
   *
   * @param  {hash} props
   * @return {function}
   * @api public
   */

  Base = function(props){
    if (this == global)
      return Base.extend(props)  
  }
  
  // --- Version
  
  // Base.version = '1.2.0'
  
  /**
   * Create a new class.
   *
   *   User = Class({
   *     init: function(name){
   *       this.name = name
   *     }
   *   })
   *
   * Classes may be subclassed using the .extend() method, and
   * the associated superclass method via this.__super__().
   *
   *   Admin = User.extend({
   *     init: function(name, password) {
   *       this.__super__(name)
   *       // or this.__super__.apply(this, arguments)
   *       this.password = password
   *     }
   *   })
   *
   * @param  {hash} props
   * @return {function}
   * @api public
   */
  
  Base.extend = function(props) {
    var __super__ = this.prototype
    
    initialize = false
    var prototype = new this
    initialize = true

    function Base() {
      if (initialize && this.init)
        this.init.apply(this, arguments)
    }
    
    function extend(props) {
      for (var key in props)
        if (props.hasOwnProperty(key))
          Base[key] = props[key]
    }
    
    Base.include = function(props) {
      for (var name in props)
        if (name == 'include')
          if (props[name] instanceof Array)
            for (var i = 0, len = props[name].length; i < len; ++i)
              Base.include(props[name][i])
          else
            Base.include(props[name])
        else if (name == 'extend')
          if (props[name] instanceof Array)
            for (var i = 0, len = props[name].length; i < len; ++i)
              extend(props[name][i])
          else
            extend(props[name])
        else if (props.hasOwnProperty(name))
          prototype[name] = 
            typeof props[name] == 'function' &&
            typeof __super__[name] == 'function' &&
            referencesSuper.test(props[name]) ?
              (function(name, fn){
                return function() {
                  this.__super__ = __super__[name]
                  return fn.apply(this, arguments)
                }
              })(name, props[name])
            : props[name]
    }
    
    Base.include(props)
    Base.prototype = prototype
    Base.constructor = Base
    Base.extend = arguments.callee
    
    return Base
  }
})()

// ==========================================================================

// Comments Plugin for Craft CMS
// Author: Verbb - https://verbb.io/

// ==========================================================================

// @codekit-prepend "_base.js"

Comments = {};

Comments.translations = {};

Comments.Base = Base.extend({
    addClass: function(el, className) {
        if (el.classList) {
            el.classList.add(className);
        } else {
            el.className += ' ' + className;
        }
    },
    removeClass: function(el, className) {
        if (el.classList) {
            el.classList.remove(className);
        } else {
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    },
    toggleClass: function(el, className) {
        if (el.classList) {
            el.classList.toggle(className);
        } else {
            var classes = el.className.split(' ');
            var existingIndex = classes.indexOf(className);

            if (existingIndex >= 0) {
                classes.splice(existingIndex, 1);
            } else {
                classes.push(className);
            }

            el.className = classes.join(' ');
        }
    },
    createElement: function(html) {
        var el = document.createElement('div');
        el.innerHTML =  html;
        return el.firstChild;
    },
    serialize: function(form) {
        var qs = [];
        var elements = form.querySelectorAll("input, select, textarea");

        Array.prototype.forEach.call(elements, function(value, index) {
            qs.push(encodeURIComponent(value.name) + "=" + encodeURIComponent(value.value));
        });

        // Add CSRF to each request
        qs.push(encodeURIComponent(Comments.csrfTokenName) + "=" + encodeURIComponent(Comments.csrfToken));

        return qs.join('&');
    },
    serializeObject: function(json) {
        var qs = Object.keys(json).map(function(key) { 
            return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
        });

        // Add CSRF to each request
        qs.push(encodeURIComponent(Comments.csrfTokenName) + "=" + encodeURIComponent(Comments.csrfToken));

        return qs.join('&');
    },
    ajax: function(url, settings) {
        settings = settings || {};

        var xhr = new XMLHttpRequest();
        xhr.open(settings.method || 'GET', url, true);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        xhr.onreadystatechange = function (state) {
            if (xhr.readyState === 4) {
                var response = JSON.parse(xhr.responseText);

                if (xhr.status === 200 && settings.success) {
                    if (response.errors) {
                        settings.error(response);
                    } else {
                        settings.success(response);
                    }
                } else if (xhr.status != 200 && settings.error) {
                    if (response.error) {
                        response = [[response.error]];
                    }

                    settings.error(response);
                }
            }
        };

        xhr.send(settings.data || '');
    },
    addListener: function($element, event, func, useCapture) {
        if ($element) {
            $element.addEventListener(event, func.bind(this), useCapture || true);
        }
    },
    remove: function($element) {
        if ($element) {
            $element.parentNode.removeChild($element);
        }
    },
    clearNotifications: function($element) {
        var $elements = $element.querySelectorAll('.cc-e, [data-role="notice"], [data-role="errors"]');

        if ($elements) {
            Array.prototype.forEach.call($elements, function(el, i) {
                el.innerHTML = '';
            });
        }
    },
    setNotifications: function(type, $element, content) {
        if (content && $element) {
            if (type === 'error') {
                var errors = content.errors || content;

                Object.keys(errors).forEach(function(key) {
                    $element.querySelector('[data-role="errors"]').innerHTML = errors[key][0];
                });
            } else if (type === 'validation') {
                Object.keys(content).forEach(function(key) {
                    $element.querySelector('[name="fields[' + key + ']"]').nextElementSibling.innerHTML = content[key][0];
                });
            } else {
                $element.querySelector('[data-role="notice"]').innerHTML = content;
            }
        }
    },
    checkCaptcha: function(data, callback) {
        // Only trigger if reCAPTCHA enabled
        if (!Comments.recaptchaEnabled) {
            return callback(data, this);
        }

        // Check for reCAPTCHA
        grecaptcha.execute(Comments.recaptchaKey, { action: 'commentForm' }).then(function(token) {
            // Append value to the form and proceed
            data += '&g-recaptcha-response=' + token;

            return callback(data, this);
        });
    },
    postForm: function(e, url, callback) {
        var $form = e.target;
        var data = this.serialize($form);
        var $btn = $form.querySelector('[type="submit"]');

        this.clearNotifications($form);
        this.addClass($btn, 'loading');

        this.checkCaptcha(data, function(data) {
            this.ajax(Comments.baseUrl + url, {
                method: 'POST',
                data: data,
                success: function(xhr) {
                    this.removeClass($btn, 'loading');

                    if (xhr.notice) {
                        this.setNotifications('notice', $form, xhr.notice);
                    }

                    if (xhr.success) {
                        callback(xhr);
                    } else {
                        this.setNotifications('validation', $form, xhr.errors);
                    }
                }.bind(this),
                error: function(xhr) {
                    this.removeClass($btn, 'loading');
                    this.setNotifications('validation', $form, xhr.errors);
                }.bind(this)
            });
        }.bind(this));
    },
    t: function(key) {
        return (Comments.translations.hasOwnProperty(key)) ? Comments.translations[key] : '';
    },
});

Comments.Instance = Comments.Base.extend({
    comments: {},

    init: function(id, settings) {
        var $container = document.querySelector(id);
        var $comments = $container.querySelectorAll('[data-role="comment"]');

        // Setup some global variables
        Comments.baseUrl = settings.baseUrl + '/comments/comments/';
        Comments.csrfTokenName = settings.csrfTokenName;
        Comments.csrfToken = settings.csrfToken;
        Comments.translations = settings.translations;
        Comments.recaptchaEnabled = settings.recaptchaEnabled;
        Comments.recaptchaKey = settings.recaptchaKey;

        this.$commentsContainer = $container.querySelector('[data-role="comments"]');
        this.$baseForm = $container.querySelector('[data-role="form"]');

        this.addListener(this.$baseForm, 'submit', this.onSubmit, false);

        // Create classes for each comment item
        for (var i = 0; i < $comments.length; i++) {
            var id = $comments[i].getAttribute('data-id');

            this.comments[id] = new Comments.Comment(this, $comments[i]);
        }
    },

    onSubmit: function(e) {
        e.preventDefault();

        this.postForm(e, 'save', function(xhr) {
            if (xhr.html) {
                var $html = this.createElement(xhr.html);
                var $newComment = this.$commentsContainer.insertBefore($html, this.$commentsContainer.firstChild);

                this.comments[xhr.id] = new Comments.Comment(this, $html);

                // Clear all inputs
                (this.$baseForm.querySelector('[name="fields[name]"]') || {}).value = '';
                (this.$baseForm.querySelector('[name="fields[email]"]') || {}).value = '';
                (this.$baseForm.querySelector('[name="fields[comment]"]') || {}).value = '';

                // Scroll to the new comment
                location.hash = '#comment-' + xhr.id;
            }

            // If a comment was successfully submitted but under review
            if (xhr.success) {
                // Clear all inputs
                (this.$baseForm.querySelector('[name="fields[name]"]') || {}).value = '';
                (this.$baseForm.querySelector('[name="fields[email]"]') || {}).value = '';
                (this.$baseForm.querySelector('[name="fields[comment]"]') || {}).value = '';
            }

        }.bind(this));
    },
});

Comments.Comment = Comments.Base.extend({
    init: function(instance, $element) {
        this.instance = instance;
        this.$element = $element;
        this.commentId = $element.getAttribute('data-id');
        this.siteId = $element.getAttribute('data-site-id');

        this.$replyContainer = $element.querySelector(':scope > [data-role="wrap-content"] > [data-role="reply"]');
        this.$repliesContainer = $element.querySelector(':scope > [data-role="wrap-content"] > [data-role="replies"]');

        // Make sure we restrict event-binding to the immediate container of this comment
        // Otherwise, we risk binding events multiple times on reply comments, nested within this comment
        var $contentContainer = $element.querySelector(':scope > [data-role="wrap-content"] > [data-role="content"]');

        // Actions
        this.$replyBtn = $contentContainer.querySelector('[data-action="reply"]');

        this.$editBtn = $contentContainer.querySelector('[data-action="edit"]');
        this.$deleteBtn = $contentContainer.querySelector('[data-action="delete"]');
        this.$flagBtn = $contentContainer.querySelector('[data-action="flag"]');
        
        this.$upvoteBtn = $contentContainer.querySelector('[data-action="upvote"]');
        this.$downvoteBtn = $contentContainer.querySelector('[data-action="downvote"]');

        // Additional classes
        this.replyForm = new Comments.ReplyForm(this);
        this.editForm = new Comments.EditForm(this);

        // Add event listeners
        this.addListener(this.$replyBtn, 'click', this.reply);
        
        this.addListener(this.$editBtn, 'click', this.edit);
        this.addListener(this.$deleteBtn, 'click', this.delete);
        this.addListener(this.$flagBtn, 'click', this.flag);

        this.addListener(this.$upvoteBtn, 'click', this.upvote);
        this.addListener(this.$downvoteBtn, 'click', this.downvote);
    },

    reply: function(e) {
        e.preventDefault();

        if (this.replyForm.isOpen) {
            this.$replyBtn.innerHTML = this.t('reply');
            this.replyForm.closeForm();
        } else {
            this.$replyBtn.innerHTML = this.t('close');
            this.replyForm.openForm();
        }
    },

    edit: function(e) {
        e.preventDefault();

        if (this.editForm.isOpen) {
            this.$editBtn.innerHTML = this.t('edit');
            this.editForm.closeForm();
        } else {
            this.$editBtn.innerHTML = this.t('close');
            this.editForm.openForm();
        }
    },

    delete: function(e) {
        e.preventDefault();

        this.clearNotifications(this.$element);

        if (confirm(this.t('delete-confirm')) == true) {
            this.ajax(Comments.baseUrl + 'trash', {
                method: 'POST',
                data: this.serializeObject({ commentId: this.commentId, siteId: this.siteId }),
                success: function(xhr) {
                    this.$element.parentNode.removeChild(this.$element);
                }.bind(this),
                error: function(errors) {
                    this.setNotifications('error', this.$element, errors);
                }.bind(this),
            });
        }
    },

    flag: function(e) {
        e.preventDefault();

        this.clearNotifications(this.$element);

        this.ajax(Comments.baseUrl + 'flag', {
            method: 'POST',
            data: this.serializeObject({ commentId: this.commentId, siteId: this.siteId }),
            success: function(xhr) {
                this.toggleClass(this.$flagBtn.parentNode, 'has-flag');

                if (xhr.notice) {
                    console.log(xhr.notice)
                    this.setNotifications('notice', this.$element, xhr.notice);
                }
            }.bind(this),
            error: function(errors) {
                this.setNotifications('error', this.$element, errors);
            }.bind(this),   
        });
    },

    upvote: function(e) {
        e.preventDefault();

        this.ajax(Comments.baseUrl + 'vote', {
            method: 'POST',
            data: this.serializeObject({ commentId: this.commentId, siteId: this.siteId, upvote: true }),
            success: function(xhr) {
                this.vote(true);
            }.bind(this),
            error: function(errors) {
                this.setNotifications('error', this.$element, errors);
            }.bind(this),
        });
    },

    downvote: function(e) {
        e.preventDefault();

        this.ajax(Comments.baseUrl + 'vote', {
            method: 'POST',
            data: this.serializeObject({ commentId: this.commentId, siteId: this.siteId, downvote: true }),
            success: function(xhr) {
                this.vote(false);
            }.bind(this),
            error: function(errors) {
                this.setNotifications('error', this.$element, errors);
            }.bind(this),
        });
    },

    vote: function(up) {
        var $like = this.$element.querySelector('[data-role="likes"]');
        var count = parseInt($like.textContent, 10);
        
        if (!count) {
            count = 0;
        }

        if (up) {
            count++;
        } else {
            count--;
        }

        if (count === 0) {
            count = '';
        }
        
        $like.textContent = count;
    },
});


Comments.ReplyForm = Comments.Base.extend({
    isOpen: false,

    init: function(comment) {
        this.comment = comment;
        this.instance = comment.instance;
        this.$element = comment.$element;
        this.$container = comment.$replyContainer;
        this.$repliesContainer = comment.$repliesContainer;
    },

    setFormHtml: function(comment) {
        var form = this.instance.$baseForm.cloneNode(true);

        // Clear errors and info
        this.clearNotifications(form);

        // Clear all inputs
        (form.querySelector('[name="fields[name]"]') || {}).value = '';
        (form.querySelector('[name="fields[email]"]') || {}).value = '';
        (form.querySelector('[name="fields[comment]"]') || {}).innerHTML = '';

        // Set the value to be the id of comment we're replying to
        (form.querySelector('input[name="newParentId"]') || {}).value = this.comment.commentId;

        this.$container.innerHTML = form.outerHTML;
    },

    openForm: function(comment) {
        this.setFormHtml(comment);

        this.isOpen = true;

        this.addListener(this.$container.querySelector('[role="form"]'), 'submit', this.onSubmit, false);
    },

    closeForm: function() {
        this.$container.innerHTML = '';

        this.isOpen = false;
    },

    onSubmit: function(e) {
        e.preventDefault();

        this.postForm(e, 'save', function(xhr) {
            if (xhr.html) {
                var $newComment = this.createElement(xhr.html);

                // Remove the form (empty the container)
                this.remove(this.$container.firstChild);

                // Prepend it to the original comment
                this.$repliesContainer.insertBefore($newComment, this.$repliesContainer.firstChild);

                this.instance.comments[xhr.id] = new Comments.Comment(this.instance, $newComment);

                this.comment.$replyBtn.innerHTML = this.t('reply')

                this.isOpen = false;
            }

            // If a comment was successfully submitted but under review
            if (xhr.success) {
                // Clear all inputs
                (this.$container.querySelector('[name="fields[name]"]') || {}).value = '';
                (this.$container.querySelector('[name="fields[email]"]') || {}).value = '';
                (this.$container.querySelector('[name="fields[comment]"]') || {}).value = '';
            }
        }.bind(this));
    },
});


Comments.EditForm = Comments.Base.extend({
    isOpen: false,

    init: function(comment) {
        this.comment = comment;
        this.instance = comment.instance;
        this.$element = comment.$element;
        this.$container = comment.$replyContainer;

        this.$comment = this.$element.querySelector('[data-role="message"]');
        this.commentText = this.$comment.innerHTML.replace(/<[^>]+>/g, '').trim();
    },

    setFormHtml: function() {
        var form = this.instance.$baseForm.cloneNode(true);

        // Clear errors and info
        this.clearNotifications(form);

        // Remove some stuff
        this.remove(form.querySelector('[name="fields[name]"]'));
        this.remove(form.querySelector('[name="fields[email]"]'));
        this.remove(form.querySelector('.cc-i-figure'));

        // Clear and update
        form.querySelector('[name="fields[comment]"]').innerHTML = this.commentText;
        form.querySelector('.cc-f-btn').innerHTML = this.t('save');

        // Set the value to be the id of comment we're replying to
        (form.querySelector('input[name="commentId"]') || {}).value = this.comment.commentId;

        this.$comment.innerHTML = form.outerHTML;
    },

    openForm: function() {
        this.setFormHtml();

        this.isOpen = true;

        this.addListener(this.$comment.querySelector('[role="form"]'), 'submit', this.onSubmit, false);
    },

    closeForm: function() {
        var $comment = this.$element.querySelector('[data-role="message"]');
        
        $comment.innerHTML = this.commentText.replace(/\n/g, '<br>');

        this.isOpen = false;
    },

    onSubmit: function(e) {
        e.preventDefault();

        this.postForm(e, 'save', function(xhr) {
            var $comment = this.$element.querySelector('[data-role="message"]');
            var commentText = this.$element.querySelector('[name="fields[comment]"]').value;
            
            $comment.innerHTML = '<p>' + commentText.replace(/\n/g, '<br>\n') + '</p>';

            this.comment.editForm = new Comments.EditForm(this.comment);

            this.comment.$editBtn.innerHTML = this.t('edit');

            this.isOpen = false;
        }.bind(this));
    },
});


$(window).resize(function() {
  if($(window).innerWidth() >= 1024) {
    $('html').removeClass('-js-menu-active');
    $('.hamburger').removeClass('is-active');
    $('.c-emergency_mobile_ul').slideUp();
  }
})
  

$('.c-header_navigation_mobile ul li a').on('click', function() {
    $('html').addClass('-js-transition-menu');
    $('.hamburger').removeClass('is-active');    
})
  
  // Look for .hamburger
  var hamburger = document.querySelector(".hamburger");
  // On click
  hamburger.addEventListener("click", function() {
    // Toggle class "is-active"
    hamburger.classList.toggle("is-active");
    // Do something else, like open/close menu
    $('html').toggleClass('-js-menu-active');
  });

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


    (function _(a,b,c,d,e){var f=window.console;if(window[c])return;if(!window.JSON)return;var g=window[c]={__buffer:{replay:function(){var a=this,b=function(d){var b=window[c];a.calls[d][0].split(".").forEach(function(a){return b=b[a]});b.apply(null,a.calls[d][1])};for(var d=0;d<this.calls.length;d++)b(d);this.calls=[]},calls:[],opts:null},getUserID:function(){return""},getAuthResponse:function(){return null},getAccessToken:function(){return null},init:function(a){g.__buffer.opts=a}};for(var b=0;b<d.length;b++){f=d[b];if(f in g)continue;var h=f.split("."),i=h.pop(),j=g;for(var k=0;k<h.length;k++)j=j[h[k]]||(j[h[k]]={});j[i]=function(a){if(a==="init")return;return function(){g.__buffer.calls.push([a,Array.prototype.slice.call(arguments)])}}(f)}k=a;h=/Chrome\/(\d+)/.exec(navigator.userAgent);h&&Number(h[1])>=55&&"assign"in Object&&"findIndex"in[]&&(k+="&ua=modern_es6");j=document.createElement("script");j.src=k;j.async=!0;e&&(j.crossOrigin="anonymous");i=document.getElementsByTagName("script")[0];i.parentNode&&i.parentNode.insertBefore(j,i)})("https:\/\/connect.facebook.net\/fr_CA\/sdk.js?hash=eb854bb36b11e5d0f15ca21c2026c015", 1554433319, "FB", ["AppEvents.EventNames","AppEvents.ParameterNames","AppEvents.activateApp","AppEvents.clearAppVersion","AppEvents.clearUserID","AppEvents.getAppVersion","AppEvents.getUserID","AppEvents.logEvent","AppEvents.logPageView","AppEvents.logPurchase","AppEvents.setAppVersion","AppEvents.setUserID","AppEvents.updateUserProperties","Canvas.Plugin.showPluginElement","Canvas.Plugin.hidePluginElement","Canvas.Prefetcher.addStaticResource","Canvas.Prefetcher.setCollectionMode","Canvas.getPageInfo","Canvas.scrollTo","Canvas.setAutoGrow","Canvas.setDoneLoading","Canvas.setSize","Canvas.setUrlHandler","Canvas.startTimer","Canvas.stopTimer","Event.subscribe","Event.unsubscribe","XFBML.parse","addFriend","api","getAccessToken","getAuthResponse","getLoginStatus","getUserID","init","login","logout","publish","share","ui"], true);
    var array = [];
    var postID = '/432264780512618_' + $('.c-testimonials_id').text();

$.ajax(
            {
                url: '//connect.facebook.net/en_US/sdk.js',
                dataType: 'script',
                cache: true,
                success:function(script, textStatus, jqXHR)
                {

        FB.init({
            appId            : '516971002166010',
            autoLogAppEvents : true,
            xfbml            : true,
            version          : 'v3.2'
        });
     }
});        
        FB.api(
            postID,
            'GET',
            {access_token:'EAAHWLrDxevoBAG6ZBDpR5yCSfTUKh092CoQdEqrZANhQfzF7ZCrCJ0clZA2KtHpw2xnqJtzPZC3c7NZB8UUW3YNHFfMBRGZCui2A0mxTS0ZABBU7qdxSvT4ZBA3Buxcn0zSmhKwromtZBlwhMu2y8wsa2iQEZCdpsRt5bJZCHIymqrjJZAVwJR8wGiVLqsYN4pzI7FkAZBBhxcCzobiHjfYkeQhJZCaTwjK64ah97mvKfhHbg2yPQZDZD',
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
    $('#cc-w-164').find('.c-comments').toggleClass('-js-visibles-comments');
})

$('.c-share_toggle').on('click', function() {
    $('.c-share_options').slideToggle(400);
    $(this).toggleClass('-js-visibles-share');
})


$('.-emergency a').on('click', function() {
    $('.c-emergency_info').toggleClass('js-active');
})


      function _toConsumableArray(e){if(Array.isArray(e)){for(var t=0,i=Array(e.length);t<e.length;t++)i[t]=e[t];return i}return Array.from(e)}var _slice=Array.prototype.slice,_slicedToArray=function(){function e(e,t){var i=[],n=!0,r=!1,s=void 0;try{for(var a,o=e[Symbol.iterator]();!(n=(a=o.next()).done)&&(i.push(a.value),!t||i.length!==t);n=!0);}catch(l){r=!0,s=l}finally{try{!n&&o["return"]&&o["return"]()}finally{if(r)throw s}}return i}return function(t,i){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,i);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}();!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t(require("jquery")):"function"==typeof define&&define.amd?define(["jquery"],t):e.parsley=t(e.jQuery)}(this,function(e){"use strict";function t(e,t){return e.parsleyAdaptedCallback||(e.parsleyAdaptedCallback=function(){var i=Array.prototype.slice.call(arguments,0);i.unshift(this),e.apply(t||D,i)}),e.parsleyAdaptedCallback}function i(e){return 0===e.lastIndexOf(I,0)?e.substr(I.length):e}
    function n(){var t=this,i=window||global;e.extend(this,{isNativeEvent:function(e){return e.originalEvent&&e.originalEvent.isTrusted!==!1},fakeInputEvent:function(i){t.isNativeEvent(i)&&e(i.target).trigger("input")},misbehaves:function(i){t.isNativeEvent(i)&&(t.behavesOk(i),e(document).on("change.inputevent",i.data.selector,t.fakeInputEvent),t.fakeInputEvent(i))},behavesOk:function(i){t.isNativeEvent(i)&&e(document).off("input.inputevent",i.data.selector,t.behavesOk).off("change.inputevent",i.data.selector,t.misbehaves)},install:function(){if(!i.inputEventPatched){i.inputEventPatched="0.0.3";for(var n=["select",'input[type="checkbox"]','input[type="radio"]','input[type="file"]'],r=0;r<n.length;r++){var s=n[r];e(document).on("input.inputevent",s,{selector:s},t.behavesOk).on("change.inputevent",s,{selector:s},t.misbehaves)}}},uninstall:function(){delete i.inputEventPatched,e(document).off(".inputevent")}})}var r=1,s={},a={attr:function(e,t,i){var n,r,s,a=new RegExp("^"+t,"i");if("undefined"==typeof i)i={};else for(n in i)i.hasOwnProperty(n)&&delete i[n];if("undefined"==typeof e||"undefined"==typeof e[0])return i;for(s=e[0].attributes,n=s.length;n--;)r=s[n],r&&r.specified&&a.test(r.name)&&(i[this.camelize(r.name.slice(t.length))]=this.deserializeValue(r.value));return i},checkAttr:function(e,t,i){return e.is("["+t+i+"]")},setAttr:function(e,t,i,n){e[0].setAttribute(this.dasherize(t+i),String(n))},generateID:function(){return""+r++},deserializeValue:function(t){var i;try{return t?"true"==t||"false"!=t&&("null"==t?null:isNaN(i=Number(t))?/^[\[\{]/.test(t)?e.parseJSON(t):t:i):t}catch(n){return t}},camelize:function(e){return e.replace(/-+(.)?/g,function(e,t){return t?t.toUpperCase():""})},dasherize:function(e){return e.replace(/::/g,"/").replace(/([A-Z]+)([A-Z][a-z])/g,"$1_$2").replace(/([a-z\d])([A-Z])/g,"$1_$2").replace(/_/g,"-").toLowerCase()},warn:function(){var e;window.console&&"function"==typeof window.console.warn&&(e=window.console).warn.apply(e,arguments)},warnOnce:function(e){s[e]||(s[e]=!0,this.warn.apply(this,arguments))},_resetWarnings:function(){s={}},trimString:function(e){return e.replace(/^\s+|\s+$/g,"")},parse:{date:function z(e){var t=e.match(/^(\d{4,})-(\d\d)-(\d\d)$/);if(!t)return null;var i=t.map(function(e){return parseInt(e,10)}),n=_slicedToArray(i,4),r=(n[0],n[1]),s=n[2],a=n[3],z=new Date(r,s-1,a);return z.getFullYear()!==r||z.getMonth()+1!==s||z.getDate()!==a?null:z},string:function(e){return e},integer:function(e){return isNaN(e)?null:parseInt(e,10)},number:function(e){if(isNaN(e))throw null;return parseFloat(e)},"boolean":function(e){return!/^\s*false\s*$/i.test(e)},object:function(e){return a.deserializeValue(e)},regexp:function(e){var t="";return/^\/.*\/(?:[gimy]*)$/.test(e)?(t=e.replace(/.*\/([gimy]*)$/,"$1"),e=e.replace(new RegExp("^/(.*?)/"+t+"$"),"$1")):e="^"+e+"$",new RegExp(e,t)}},parseRequirement:function(e,t){var i=this.parse[e||"string"];if(!i)throw'Unknown requirement specification: "'+e+'"';var n=i(t);if(null===n)throw"Requirement is not a "+e+': "'+t+'"';return n},namespaceEvents:function(t,i){return t=this.trimString(t||"").split(/\s+/),t[0]?e.map(t,function(e){return e+"."+i}).join(" "):""},difference:function(t,i){var n=[];return e.each(t,function(e,t){i.indexOf(t)==-1&&n.push(t)}),n},all:function(t){return e.when.apply(e,_toConsumableArray(t).concat([42,42]))},objectCreate:Object.create||function(){var e=function(){};return function(t){if(arguments.length>1)throw Error("Second argument not supported");if("object"!=typeof t)throw TypeError("Argument must be an object");e.prototype=t;var i=new e;return e.prototype=null,i}}(),_SubmitSelector:'input[type="submit"], button:submit'},o=a,l={namespace:"data-parsley-",inputs:"input, textarea, select",excluded:"input[type=button], input[type=submit], input[type=reset], input[type=hidden]",priorityEnabled:!0,multiple:null,group:null,uiEnabled:!0,validationThreshold:3,focus:"first",trigger:!1,triggerAfterFailure:"input",errorClass:"parsley-error",successClass:"parsley-success",classHandler:function(e){},errorsContainer:function(e){},errorsWrapper:'<ul class="parsley-errors-list"></ul>',errorTemplate:"<li></li>"},u=function(){this.__id__=o.generateID()};u.prototype={asyncSupport:!0,_pipeAccordingToValidationResult:function(){var t=this,i=function(){var i=e.Deferred();return!0!==t.validationResult&&i.reject(),i.resolve().promise()};return[i,i]},actualizeOptions:function(){return o.attr(this.$element,this.options.namespace,this.domOptions),this.parent&&this.parent.actualizeOptions&&this.parent.actualizeOptions(),this},_resetOptions:function(e){this.domOptions=o.objectCreate(this.parent.options),this.options=o.objectCreate(this.domOptions);for(var t in e)e.hasOwnProperty(t)&&(this.options[t]=e[t]);this.actualizeOptions()},_listeners:null,on:function(e,t){this._listeners=this._listeners||{};var i=this._listeners[e]=this._listeners[e]||[];return i.push(t),this},subscribe:function(t,i){e.listenTo(this,t.toLowerCase(),i)},off:function(e,t){var i=this._listeners&&this._listeners[e];if(i)if(t)for(var n=i.length;n--;)i[n]===t&&i.splice(n,1);else delete this._listeners[e];return this},unsubscribe:function(t,i){e.unsubscribeTo(this,t.toLowerCase())},trigger:function(e,t,i){t=t||this;var n,r=this._listeners&&this._listeners[e];if(r)for(var s=r.length;s--;)if(n=r[s].call(t,t,i),n===!1)return n;return!this.parent||this.parent.trigger(e,t,i)},asyncIsValid:function(e,t){return o.warnOnce("asyncIsValid is deprecated; please use whenValid instead"),this.whenValid({group:e,force:t})},_findRelated:function(){return this.options.multiple?this.parent.$element.find("["+this.options.namespace+'multiple="'+this.options.multiple+'"]'):this.$element}};var d=function(e,t){var i=e.match(/^\s*\[(.*)\]\s*$/);if(!i)throw'Requirement is not an array: "'+e+'"';var n=i[1].split(",").map(o.trimString);if(n.length!==t)throw"Requirement has "+n.length+" values when "+t+" are needed";return n},h=function(e,t,i){var n=null,r={};for(var s in e)if(s){var a=i(s);"string"==typeof a&&(a=o.parseRequirement(e[s],a)),r[s]=a}else n=o.parseRequirement(e[s],t);return[n,r]},p=function(t){e.extend(!0,this,t)};p.prototype={validate:function(t,i){if(this.fn)return arguments.length>3&&(i=[].slice.call(arguments,1,-1)),this.fn(t,i);if(e.isArray(t)){if(!this.validateMultiple)throw"Validator `"+this.name+"` does not handle multiple values";return this.validateMultiple.apply(this,arguments)}var n=arguments[arguments.length-1];if(this.validateDate&&n._isDateInput())return arguments[0]=o.parse.date(arguments[0]),null!==arguments[0]&&this.validateDate.apply(this,arguments);if(this.validateNumber)return!isNaN(t)&&(arguments[0]=parseFloat(arguments[0]),this.validateNumber.apply(this,arguments));if(this.validateString)return this.validateString.apply(this,arguments);throw"Validator `"+this.name+"` only handles multiple values"},parseRequirements:function(t,i){if("string"!=typeof t)return e.isArray(t)?t:[t];var n=this.requirementType;if(e.isArray(n)){for(var r=d(t,n.length),s=0;s<r.length;s++)r[s]=o.parseRequirement(n[s],r[s]);return r}return e.isPlainObject(n)?h(n,t,i):[o.parseRequirement(n,t)]},requirementType:"string",priority:2};var c=function(e,t){this.__class__="ValidatorRegistry",this.locale="en",this.init(e||{},t||{})},f={email:/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i,number:/^-?(\d*\.)?\d+(e[-+]?\d+)?$/i,integer:/^-?\d+$/,digits:/^\d+$/,alphanum:/^\w+$/i,date:{test:function(e){return null!==o.parse.date(e)}},url:new RegExp("^(?:(?:https?|ftp)://)?(?:\\S+(?::\\S*)?@)?(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))(?::\\d{2,5})?(?:/\\S*)?$","i")};f.range=f.number;var m=function(e){var t=(""+e).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);return t?Math.max(0,(t[1]?t[1].length:0)-(t[2]?+t[2]:0)):0},g=function(e,t){return t.map(o.parse[e])},v=function(e,t){return function(i){for(var n=arguments.length,r=Array(n>1?n-1:0),s=1;s<n;s++)r[s-1]=arguments[s];return r.pop(),t.apply(void 0,[i].concat(_toConsumableArray(g(e,r))))}},y=function(e){return{validateDate:v("date",e),validateNumber:v("number",e),requirementType:e.length<=2?"string":["string","string"],priority:30}};c.prototype={init:function(t,i){this.catalog=i,this.validators=e.extend({},this.validators);for(var n in t)this.addValidator(n,t[n].fn,t[n].priority);window.Parsley.trigger("parsley:validator:init")},setLocale:function(e){if("undefined"==typeof this.catalog[e])throw new Error(e+" is not available in the catalog");return this.locale=e,this},addCatalog:function(e,t,i){return"object"==typeof t&&(this.catalog[e]=t),!0===i?this.setLocale(e):this},addMessage:function(e,t,i){return"undefined"==typeof this.catalog[e]&&(this.catalog[e]={}),this.catalog[e][t]=i,this},addMessages:function(e,t){for(var i in t)this.addMessage(e,i,t[i]);return this},addValidator:function(e,t,i){if(this.validators[e])o.warn('Validator "'+e+'" is already defined.');else if(l.hasOwnProperty(e))return void o.warn('"'+e+'" is a restricted keyword and is not a valid validator name.');return this._setValidator.apply(this,arguments)},updateValidator:function(e,t,i){return this.validators[e]?this._setValidator.apply(this,arguments):(o.warn('Validator "'+e+'" is not already defined.'),this.addValidator.apply(this,arguments))},removeValidator:function(e){return this.validators[e]||o.warn('Validator "'+e+'" is not defined.'),delete this.validators[e],this},_setValidator:function(e,t,i){"object"!=typeof t&&(t={fn:t,priority:i}),t.validate||(t=new p(t)),this.validators[e]=t;for(var n in t.messages||{})this.addMessage(n,e,t.messages[n]);return this},getErrorMessage:function(e){var t;if("type"===e.name){var i=this.catalog[this.locale][e.name]||{};t=i[e.requirements]}else t=this.formatMessage(this.catalog[this.locale][e.name],e.requirements);return t||this.catalog[this.locale].defaultMessage||this.catalog.en.defaultMessage},formatMessage:function(e,t){if("object"==typeof t){for(var i in t)e=this.formatMessage(e,t[i]);return e}return"string"==typeof e?e.replace(/%s/i,t):""},validators:{notblank:{validateString:function(e){return/\S/.test(e)},priority:2},required:{validateMultiple:function(e){return e.length>0},validateString:function(e){return/\S/.test(e)},priority:512},type:{validateString:function(e,t){var i=arguments.length<=2||void 0===arguments[2]?{}:arguments[2],n=i.step,r=void 0===n?"any":n,s=i.base,a=void 0===s?0:s,o=f[t];if(!o)throw new Error("validator type `"+t+"` is not supported");if(!o.test(e))return!1;if("number"===t&&!/^any$/i.test(r||"")){var l=Number(e),u=Math.max(m(r),m(a));if(m(l)>u)return!1;var d=function(e){return Math.round(e*Math.pow(10,u))};if((d(l)-d(a))%d(r)!=0)return!1}return!0},requirementType:{"":"string",step:"string",base:"number"},priority:256},pattern:{validateString:function(e,t){return t.test(e)},requirementType:"regexp",priority:64},minlength:{validateString:function(e,t){return e.length>=t},requirementType:"integer",priority:30},maxlength:{validateString:function(e,t){return e.length<=t},requirementType:"integer",priority:30},length:{validateString:function(e,t,i){return e.length>=t&&e.length<=i},requirementType:["integer","integer"],priority:30},mincheck:{validateMultiple:function(e,t){return e.length>=t},requirementType:"integer",priority:30},maxcheck:{validateMultiple:function(e,t){return e.length<=t},requirementType:"integer",priority:30},check:{validateMultiple:function(e,t,i){return e.length>=t&&e.length<=i},requirementType:["integer","integer"],priority:30},min:y(function(e,t){return e>=t}),max:y(function(e,t){return e<=t}),range:y(function(e,t,i){return e>=t&&e<=i}),equalto:{validateString:function(t,i){var n=e(i);return n.length?t===n.val():t===i},priority:256}}};var _={},w=function S(e,t,i){for(var n=[],r=[],s=0;s<e.length;s++){for(var a=!1,o=0;o<t.length;o++)if(e[s].assert.name===t[o].assert.name){a=!0;break}a?r.push(e[s]):n.push(e[s])}return{kept:r,added:n,removed:i?[]:S(t,e,!0).added}};_.Form={_actualizeTriggers:function(){var e=this;this.$element.on("submit.Parsley",function(t){e.onSubmitValidate(t)}),this.$element.on("click.Parsley",o._SubmitSelector,function(t){e.onSubmitButton(t)}),!1!==this.options.uiEnabled&&this.$element.attr("novalidate","")},focus:function(){if(this._focusedField=null,!0===this.validationResult||"none"===this.options.focus)return null;for(var e=0;e<this.fields.length;e++){var t=this.fields[e];if(!0!==t.validationResult&&t.validationResult.length>0&&"undefined"==typeof t.options.noFocus&&(this._focusedField=t.$element,"first"===this.options.focus))break}return null===this._focusedField?null:this._focusedField.focus()},_destroyUI:function(){this.$element.off(".Parsley")}},_.Field={_reflowUI:function(){if(this._buildUI(),this._ui){var e=w(this.validationResult,this._ui.lastValidationResult);this._ui.lastValidationResult=this.validationResult,this._manageStatusClass(),this._manageErrorsMessages(e),this._actualizeTriggers(),!e.kept.length&&!e.added.length||this._failedOnce||(this._failedOnce=!0,this._actualizeTriggers())}},getErrorsMessages:function(){if(!0===this.validationResult)return[];for(var e=[],t=0;t<this.validationResult.length;t++)e.push(this.validationResult[t].errorMessage||this._getErrorMessage(this.validationResult[t].assert));return e},addError:function(e){var t=arguments.length<=1||void 0===arguments[1]?{}:arguments[1],i=t.message,n=t.assert,r=t.updateClass,s=void 0===r||r;this._buildUI(),this._addError(e,{message:i,assert:n}),s&&this._errorClass()},updateError:function(e){var t=arguments.length<=1||void 0===arguments[1]?{}:arguments[1],i=t.message,n=t.assert,r=t.updateClass,s=void 0===r||r;this._buildUI(),this._updateError(e,{message:i,assert:n}),s&&this._errorClass()},removeError:function(e){var t=arguments.length<=1||void 0===arguments[1]?{}:arguments[1],i=t.updateClass,n=void 0===i||i;this._buildUI(),this._removeError(e),n&&this._manageStatusClass()},_manageStatusClass:function(){this.hasConstraints()&&this.needsValidation()&&!0===this.validationResult?this._successClass():this.validationResult.length>0?this._errorClass():this._resetClass()},_manageErrorsMessages:function(t){if("undefined"==typeof this.options.errorsMessagesDisabled){if("undefined"!=typeof this.options.errorMessage)return t.added.length||t.kept.length?(this._insertErrorWrapper(),0===this._ui.$errorsWrapper.find(".parsley-custom-error-message").length&&this._ui.$errorsWrapper.append(e(this.options.errorTemplate).addClass("parsley-custom-error-message")),this._ui.$errorsWrapper.addClass("filled").find(".parsley-custom-error-message").html(this.options.errorMessage)):this._ui.$errorsWrapper.removeClass("filled").find(".parsley-custom-error-message").remove();for(var i=0;i<t.removed.length;i++)this._removeError(t.removed[i].assert.name);for(i=0;i<t.added.length;i++)this._addError(t.added[i].assert.name,{message:t.added[i].errorMessage,assert:t.added[i].assert});for(i=0;i<t.kept.length;i++)this._updateError(t.kept[i].assert.name,{message:t.kept[i].errorMessage,assert:t.kept[i].assert})}},_addError:function(t,i){var n=i.message,r=i.assert;this._insertErrorWrapper(),this._ui.$errorsWrapper.addClass("filled").append(e(this.options.errorTemplate).addClass("parsley-"+t).html(n||this._getErrorMessage(r)))},_updateError:function(e,t){var i=t.message,n=t.assert;this._ui.$errorsWrapper.addClass("filled").find(".parsley-"+e).html(i||this._getErrorMessage(n))},_removeError:function(e){this._ui.$errorsWrapper.removeClass("filled").find(".parsley-"+e).remove()},_getErrorMessage:function(e){var t=e.name+"Message";return"undefined"!=typeof this.options[t]?window.Parsley.formatMessage(this.options[t],e.requirements):window.Parsley.getErrorMessage(e)},_buildUI:function(){if(!this._ui&&!1!==this.options.uiEnabled){var t={};this.$element.attr(this.options.namespace+"id",this.__id__),t.$errorClassHandler=this._manageClassHandler(),t.errorsWrapperId="parsley-id-"+(this.options.multiple?"multiple-"+this.options.multiple:this.__id__),t.$errorsWrapper=e(this.options.errorsWrapper).attr("id",t.errorsWrapperId),t.lastValidationResult=[],t.validationInformationVisible=!1,this._ui=t}},_manageClassHandler:function(){if("string"==typeof this.options.classHandler&&e(this.options.classHandler).length)return e(this.options.classHandler);var t=this.options.classHandler.call(this,this);return"undefined"!=typeof t&&t.length?t:this._inputHolder()},_inputHolder:function(){return!this.options.multiple||this.$element.is("select")?this.$element:this.$element.parent()},_insertErrorWrapper:function(){var t;if(0!==this._ui.$errorsWrapper.parent().length)return this._ui.$errorsWrapper.parent();if("string"==typeof this.options.errorsContainer){if(e(this.options.errorsContainer).length)return e(this.options.errorsContainer).append(this._ui.$errorsWrapper);o.warn("The errors container `"+this.options.errorsContainer+"` does not exist in DOM")}else"function"==typeof this.options.errorsContainer&&(t=this.options.errorsContainer.call(this,this));return"undefined"!=typeof t&&t.length?t.append(this._ui.$errorsWrapper):this._inputHolder().after(this._ui.$errorsWrapper)},_actualizeTriggers:function(){var e,t=this,i=this._findRelated();i.off(".Parsley"),this._failedOnce?i.on(o.namespaceEvents(this.options.triggerAfterFailure,"Parsley"),function(){t._validateIfNeeded()}):(e=o.namespaceEvents(this.options.trigger,"Parsley"))&&i.on(e,function(e){t._validateIfNeeded(e)})},_validateIfNeeded:function(e){var t=this;e&&/key|input/.test(e.type)&&(!this._ui||!this._ui.validationInformationVisible)&&this.getValue().length<=this.options.validationThreshold||(this.options.debounce?(window.clearTimeout(this._debounced),this._debounced=window.setTimeout(function(){return t.validate()},this.options.debounce)):this.validate())},_resetUI:function(){this._failedOnce=!1,this._actualizeTriggers(),"undefined"!=typeof this._ui&&(this._ui.$errorsWrapper.removeClass("filled").children().remove(),this._resetClass(),this._ui.lastValidationResult=[],this._ui.validationInformationVisible=!1)},_destroyUI:function(){this._resetUI(),"undefined"!=typeof this._ui&&this._ui.$errorsWrapper.remove(),delete this._ui},_successClass:function(){this._ui.validationInformationVisible=!0,this._ui.$errorClassHandler.removeClass(this.options.errorClass).addClass(this.options.successClass)},_errorClass:function(){this._ui.validationInformationVisible=!0,this._ui.$errorClassHandler.removeClass(this.options.successClass).addClass(this.options.errorClass)},_resetClass:function(){this._ui.$errorClassHandler.removeClass(this.options.successClass).removeClass(this.options.errorClass)}};var b=function(t,i,n){this.__class__="Form",this.$element=e(t),this.domOptions=i,this.options=n,this.parent=window.Parsley,this.fields=[],this.validationResult=null},F={pending:null,resolved:!0,rejected:!1};b.prototype={onSubmitValidate:function(e){var t=this;if(!0!==e.parsley){var i=this._$submitSource||this.$element.find(o._SubmitSelector).first();if(this._$submitSource=null,this.$element.find(".parsley-synthetic-submit-button").prop("disabled",!0),!i.is("[formnovalidate]")){var n=this.whenValidate({event:e});"resolved"===n.state()&&!1!==this._trigger("submit")||(e.stopImmediatePropagation(),e.preventDefault(),"pending"===n.state()&&n.done(function(){t._submit(i)}))}}},onSubmitButton:function(t){this._$submitSource=e(t.currentTarget)},_submit:function(t){if(!1!==this._trigger("submit")){if(t){var i=this.$element.find(".parsley-synthetic-submit-button").prop("disabled",!1);0===i.length&&(i=e('<input class="parsley-synthetic-submit-button" type="hidden">').appendTo(this.$element)),i.attr({name:t.attr("name"),value:t.attr("value")})}this.$element.trigger(e.extend(e.Event("submit"),{parsley:!0}))}},validate:function(t){if(arguments.length>=1&&!e.isPlainObject(t)){o.warnOnce("Calling validate on a parsley form without passing arguments as an object is deprecated.");var i=_slice.call(arguments),n=i[0],r=i[1],s=i[2];t={group:n,force:r,event:s}}return F[this.whenValidate(t).state()]},whenValidate:function(){var t,i=this,n=arguments.length<=0||void 0===arguments[0]?{}:arguments[0],r=n.group,s=n.force,a=n.event;this.submitEvent=a,a&&(this.submitEvent=e.extend({},a,{preventDefault:function(){o.warnOnce("Using `this.submitEvent.preventDefault()` is deprecated; instead, call `this.validationResult = false`"),i.validationResult=!1}})),this.validationResult=!0,this._trigger("validate"),this._refreshFields();var l=this._withoutReactualizingFormOptions(function(){return e.map(i.fields,function(e){return e.whenValidate({force:s,group:r})})});return(t=o.all(l).done(function(){i._trigger("success")}).fail(function(){i.validationResult=!1,i.focus(),i._trigger("error")}).always(function(){i._trigger("validated")})).pipe.apply(t,_toConsumableArray(this._pipeAccordingToValidationResult()))},isValid:function(t){if(arguments.length>=1&&!e.isPlainObject(t)){o.warnOnce("Calling isValid on a parsley form without passing arguments as an object is deprecated.");var i=_slice.call(arguments),n=i[0],r=i[1];t={group:n,force:r}}return F[this.whenValid(t).state()]},whenValid:function(){var t=this,i=arguments.length<=0||void 0===arguments[0]?{}:arguments[0],n=i.group,r=i.force;this._refreshFields();var s=this._withoutReactualizingFormOptions(function(){return e.map(t.fields,function(e){return e.whenValid({group:n,force:r})})});return o.all(s)},reset:function(){for(var e=0;e<this.fields.length;e++)this.fields[e].reset();this._trigger("reset")},destroy:function(){this._destroyUI();for(var e=0;e<this.fields.length;e++)this.fields[e].destroy();this.$element.removeData("Parsley"),this._trigger("destroy")},_refreshFields:function(){return this.actualizeOptions()._bindFields()},_bindFields:function(){var t=this,i=this.fields;return this.fields=[],this.fieldsMappedById={},this._withoutReactualizingFormOptions(function(){t.$element.find(t.options.inputs).not(t.options.excluded).each(function(e,i){var n=new window.Parsley.Factory(i,{},t);if(("Field"===n.__class__||"FieldMultiple"===n.__class__)&&!0!==n.options.excluded){var r=n.__class__+"-"+n.__id__;"undefined"==typeof t.fieldsMappedById[r]&&(t.fieldsMappedById[r]=n,t.fields.push(n))}}),e.each(o.difference(i,t.fields),function(e,t){t.reset()})}),this},_withoutReactualizingFormOptions:function(e){var t=this.actualizeOptions;this.actualizeOptions=function(){return this};var i=e();return this.actualizeOptions=t,i},_trigger:function(e){return this.trigger("form:"+e)}};var C=function(t,i,n,r,s){var a=window.Parsley._validatorRegistry.validators[i],o=new p(a);e.extend(this,{validator:o,name:i,requirements:n,priority:r||t.options[i+"Priority"]||o.priority,isDomConstraint:!0===s}),this._parseRequirements(t.options)},$=function(e){var t=e[0].toUpperCase();return t+e.slice(1)};C.prototype={validate:function(e,t){var i;return(i=this.validator).validate.apply(i,[e].concat(_toConsumableArray(this.requirementList),[t]))},_parseRequirements:function(e){var t=this;this.requirementList=this.validator.parseRequirements(this.requirements,function(i){return e[t.name+$(i)]})}};var x=function(t,i,n,r){this.__class__="Field",this.$element=e(t),"undefined"!=typeof r&&(this.parent=r),this.options=n,this.domOptions=i,this.constraints=[],this.constraintsByName={},this.validationResult=!0,this._bindConstraints()},E={pending:null,resolved:!0,rejected:!1};x.prototype={validate:function(t){arguments.length>=1&&!e.isPlainObject(t)&&(o.warnOnce("Calling validate on a parsley field without passing arguments as an object is deprecated."),t={options:t});var i=this.whenValidate(t);if(!i)return!0;switch(i.state()){case"pending":return null;case"resolved":return!0;case"rejected":return this.validationResult}},whenValidate:function(){var e,t=this,i=arguments.length<=0||void 0===arguments[0]?{}:arguments[0],n=i.force,r=i.group;if(this.refreshConstraints(),!r||this._isInGroup(r))return this.value=this.getValue(),this._trigger("validate"),(e=this.whenValid({force:n,value:this.value,_refreshed:!0}).always(function(){t._reflowUI()}).done(function(){t._trigger("success")}).fail(function(){t._trigger("error")}).always(function(){t._trigger("validated")})).pipe.apply(e,_toConsumableArray(this._pipeAccordingToValidationResult()))},hasConstraints:function(){return 0!==this.constraints.length},needsValidation:function(e){return"undefined"==typeof e&&(e=this.getValue()),!(!e.length&&!this._isRequired()&&"undefined"==typeof this.options.validateIfEmpty)},_isInGroup:function(t){return e.isArray(this.options.group)?-1!==e.inArray(t,this.options.group):this.options.group===t},isValid:function(t){if(arguments.length>=1&&!e.isPlainObject(t)){o.warnOnce("Calling isValid on a parsley field without passing arguments as an object is deprecated.");var i=_slice.call(arguments),n=i[0],r=i[1];t={force:n,value:r}}var s=this.whenValid(t);return!s||E[s.state()]},whenValid:function(){var t=this,i=arguments.length<=0||void 0===arguments[0]?{}:arguments[0],n=i.force,r=void 0!==n&&n,s=i.value,a=i.group,l=i._refreshed;if(l||this.refreshConstraints(),!a||this._isInGroup(a)){if(this.validationResult=!0,!this.hasConstraints())return e.when();if("undefined"!=typeof s&&null!==s||(s=this.getValue()),!this.needsValidation(s)&&!0!==r)return e.when();var u=this._getGroupedConstraints(),d=[];return e.each(u,function(i,n){var r=o.all(e.map(n,function(e){return t._validateConstraint(s,e)}));if(d.push(r),"rejected"===r.state())return!1}),o.all(d)}},_validateConstraint:function(t,i){var n=this,r=i.validate(t,this);return!1===r&&(r=e.Deferred().reject()),o.all([r]).fail(function(e){n.validationResult instanceof Array||(n.validationResult=[]),n.validationResult.push({assert:i,errorMessage:"string"==typeof e&&e})})},getValue:function(){var e;return e="function"==typeof this.options.value?this.options.value(this):"undefined"!=typeof this.options.value?this.options.value:this.$element.val(),"undefined"==typeof e||null===e?"":this._handleWhitespace(e)},reset:function(){return this._resetUI(),this._trigger("reset")},destroy:function(){this._destroyUI(),this.$element.removeData("Parsley"),this.$element.removeData("FieldMultiple"),this._trigger("destroy")},refreshConstraints:function(){return this.actualizeOptions()._bindConstraints()},addConstraint:function(e,t,i,n){if(window.Parsley._validatorRegistry.validators[e]){var r=new C(this,e,t,i,n);"undefined"!==this.constraintsByName[r.name]&&this.removeConstraint(r.name),this.constraints.push(r),this.constraintsByName[r.name]=r}return this},removeConstraint:function(e){for(var t=0;t<this.constraints.length;t++)if(e===this.constraints[t].name){this.constraints.splice(t,1);break}return delete this.constraintsByName[e],this},updateConstraint:function(e,t,i){return this.removeConstraint(e).addConstraint(e,t,i)},_bindConstraints:function(){for(var e=[],t={},i=0;i<this.constraints.length;i++)!1===this.constraints[i].isDomConstraint&&(e.push(this.constraints[i]),t[this.constraints[i].name]=this.constraints[i]);this.constraints=e,this.constraintsByName=t;for(var n in this.options)this.addConstraint(n,this.options[n],void 0,!0);return this._bindHtml5Constraints()},_bindHtml5Constraints:function(){this.$element.attr("required")&&this.addConstraint("required",!0,void 0,!0),"string"==typeof this.$element.attr("pattern")&&this.addConstraint("pattern",this.$element.attr("pattern"),void 0,!0),"undefined"!=typeof this.$element.attr("min")&&"undefined"!=typeof this.$element.attr("max")?this.addConstraint("range",[this.$element.attr("min"),this.$element.attr("max")],void 0,!0):"undefined"!=typeof this.$element.attr("min")?this.addConstraint("min",this.$element.attr("min"),void 0,!0):"undefined"!=typeof this.$element.attr("max")&&this.addConstraint("max",this.$element.attr("max"),void 0,!0),"undefined"!=typeof this.$element.attr("minlength")&&"undefined"!=typeof this.$element.attr("maxlength")?this.addConstraint("length",[this.$element.attr("minlength"),this.$element.attr("maxlength")],void 0,!0):"undefined"!=typeof this.$element.attr("minlength")?this.addConstraint("minlength",this.$element.attr("minlength"),void 0,!0):"undefined"!=typeof this.$element.attr("maxlength")&&this.addConstraint("maxlength",this.$element.attr("maxlength"),void 0,!0);var e=this.$element.attr("type");return"undefined"==typeof e?this:"number"===e?this.addConstraint("type",["number",{step:this.$element.attr("step")||"1",base:this.$element.attr("min")||this.$element.attr("value")}],void 0,!0):/^(email|url|range|date)$/i.test(e)?this.addConstraint("type",e,void 0,!0):this},_isRequired:function(){return"undefined"!=typeof this.constraintsByName.required&&!1!==this.constraintsByName.required.requirements},_trigger:function(e){return this.trigger("field:"+e)},_handleWhitespace:function(e){return!0===this.options.trimValue&&o.warnOnce('data-parsley-trim-value="true" is deprecated, please use data-parsley-whitespace="trim"'),"squish"===this.options.whitespace&&(e=e.replace(/\s{2,}/g," ")),"trim"!==this.options.whitespace&&"squish"!==this.options.whitespace&&!0!==this.options.trimValue||(e=o.trimString(e)),e},_isDateInput:function(){var e=this.constraintsByName.type;return e&&"date"===e.requirements},_getGroupedConstraints:function(){if(!1===this.options.priorityEnabled)return[this.constraints];for(var e=[],t={},i=0;i<this.constraints.length;i++){var n=this.constraints[i].priority;t[n]||e.push(t[n]=[]),t[n].push(this.constraints[i])}return e.sort(function(e,t){return t[0].priority-e[0].priority}),e}};var V=x,P=function(){this.__class__="FieldMultiple"};P.prototype={addElement:function(e){return this.$elements.push(e),this},refreshConstraints:function(){var t;if(this.constraints=[],this.$element.is("select"))return this.actualizeOptions()._bindConstraints(),this;for(var i=0;i<this.$elements.length;i++)if(e("html").has(this.$elements[i]).length){t=this.$elements[i].data("FieldMultiple").refreshConstraints().constraints;for(var n=0;n<t.length;n++)this.addConstraint(t[n].name,t[n].requirements,t[n].priority,t[n].isDomConstraint)}else this.$elements.splice(i,1);return this},getValue:function(){if("function"==typeof this.options.value)return this.options.value(this);if("undefined"!=typeof this.options.value)return this.options.value;if(this.$element.is("input[type=radio]"))return this._findRelated().filter(":checked").val()||"";if(this.$element.is("input[type=checkbox]")){var t=[];return this._findRelated().filter(":checked").each(function(){t.push(e(this).val())}),t}return this.$element.is("select")&&null===this.$element.val()?[]:this.$element.val()},_init:function(){return this.$elements=[this.$element],this}};var A=function(t,i,n){this.$element=e(t);var r=this.$element.data("Parsley");if(r)return"undefined"!=typeof n&&r.parent===window.Parsley&&(r.parent=n,r._resetOptions(r.options)),"object"==typeof i&&e.extend(r.options,i),r;if(!this.$element.length)throw new Error("You must bind Parsley on an existing element.");if("undefined"!=typeof n&&"Form"!==n.__class__)throw new Error("Parent instance must be a Form instance");return this.parent=n||window.Parsley,
    this.init(i)};A.prototype={init:function(e){return this.__class__="Parsley",this.__version__="2.7.0",this.__id__=o.generateID(),this._resetOptions(e),this.$element.is("form")||o.checkAttr(this.$element,this.options.namespace,"validate")&&!this.$element.is(this.options.inputs)?this.bind("parsleyForm"):this.isMultiple()?this.handleMultiple():this.bind("parsleyField")},isMultiple:function(){return this.$element.is("input[type=radio], input[type=checkbox]")||this.$element.is("select")&&"undefined"!=typeof this.$element.attr("multiple")},handleMultiple:function(){var t,i,n=this;if(this.options.multiple||("undefined"!=typeof this.$element.attr("name")&&this.$element.attr("name").length?this.options.multiple=t=this.$element.attr("name"):"undefined"!=typeof this.$element.attr("id")&&this.$element.attr("id").length&&(this.options.multiple=this.$element.attr("id"))),this.$element.is("select")&&"undefined"!=typeof this.$element.attr("multiple"))return this.options.multiple=this.options.multiple||this.__id__,this.bind("parsleyFieldMultiple");if(!this.options.multiple)return o.warn("To be bound by Parsley, a radio, a checkbox and a multiple select input must have either a name or a multiple option.",this.$element),this;this.options.multiple=this.options.multiple.replace(/(:|\.|\[|\]|\{|\}|\$)/g,""),"undefined"!=typeof t&&e('input[name="'+t+'"]').each(function(t,i){e(i).is("input[type=radio], input[type=checkbox]")&&e(i).attr(n.options.namespace+"multiple",n.options.multiple)});for(var r=this._findRelated(),s=0;s<r.length;s++)if(i=e(r.get(s)).data("Parsley"),"undefined"!=typeof i){this.$element.data("FieldMultiple")||i.addElement(this.$element);break}return this.bind("parsleyField",!0),i||this.bind("parsleyFieldMultiple")},bind:function(t,i){var n;switch(t){case"parsleyForm":n=e.extend(new b(this.$element,this.domOptions,this.options),new u,window.ParsleyExtend)._bindFields();break;case"parsleyField":n=e.extend(new V(this.$element,this.domOptions,this.options,this.parent),new u,window.ParsleyExtend);break;case"parsleyFieldMultiple":n=e.extend(new V(this.$element,this.domOptions,this.options,this.parent),new P,new u,window.ParsleyExtend)._init();break;default:throw new Error(t+"is not a supported Parsley type")}return this.options.multiple&&o.setAttr(this.$element,this.options.namespace,"multiple",this.options.multiple),"undefined"!=typeof i?(this.$element.data("FieldMultiple",n),n):(this.$element.data("Parsley",n),n._actualizeTriggers(),n._trigger("init"),n)}};var M=e.fn.jquery.split(".");if(parseInt(M[0])<=1&&parseInt(M[1])<8)throw"The loaded version of jQuery is too old. Please upgrade to 1.8.x or better.";M.forEach||o.warn("Parsley requires ES5 to run properly. Please include https://github.com/es-shims/es5-shim");var O=e.extend(new u,{$element:e(document),actualizeOptions:null,_resetOptions:null,Factory:A,version:"2.7.0"});e.extend(V.prototype,_.Field,u.prototype),e.extend(b.prototype,_.Form,u.prototype),e.extend(A.prototype,u.prototype),e.fn.parsley=e.fn.psly=function(t){if(this.length>1){var i=[];return this.each(function(){i.push(e(this).parsley(t))}),i}return e(this).length?new A(this,t):void o.warn("You must bind Parsley on an existing element.")},"undefined"==typeof window.ParsleyExtend&&(window.ParsleyExtend={}),O.options=e.extend(o.objectCreate(l),window.ParsleyConfig),window.ParsleyConfig=O.options,window.Parsley=window.psly=O,O.Utils=o,window.ParsleyUtils={},e.each(o,function(e,t){"function"==typeof t&&(window.ParsleyUtils[e]=function(){return o.warnOnce("Accessing `window.ParsleyUtils` is deprecated. Use `window.Parsley.Utils` instead."),o[e].apply(o,arguments)})});var R=window.Parsley._validatorRegistry=new c(window.ParsleyConfig.validators,window.ParsleyConfig.i18n);window.ParsleyValidator={},e.each("setLocale addCatalog addMessage addMessages getErrorMessage formatMessage addValidator updateValidator removeValidator".split(" "),function(t,i){window.Parsley[i]=e.proxy(R,i),window.ParsleyValidator[i]=function(){var e;return o.warnOnce("Accessing the method '"+i+"' through Validator is deprecated. Simply call 'window.Parsley."+i+"(...)'"),(e=window.Parsley)[i].apply(e,arguments)}}),window.Parsley.UI=_,window.ParsleyUI={removeError:function(e,t,i){var n=!0!==i;return o.warnOnce("Accessing UI is deprecated. Call 'removeError' on the instance directly. Please comment in issue 1073 as to your need to call this method."),e.removeError(t,{updateClass:n})},getErrorsMessages:function(e){return o.warnOnce("Accessing UI is deprecated. Call 'getErrorsMessages' on the instance directly."),e.getErrorsMessages()}},e.each("addError updateError".split(" "),function(e,t){window.ParsleyUI[t]=function(e,i,n,r,s){var a=!0!==s;return o.warnOnce("Accessing UI is deprecated. Call '"+t+"' on the instance directly. Please comment in issue 1073 as to your need to call this method."),e[t](i,{message:n,assert:r,updateClass:a})}}),!1!==window.ParsleyConfig.autoBind&&e(function(){e("[data-parsley-validate]").length&&e("[data-parsley-validate]").parsley()});var D=e({}),T=function(){o.warnOnce("Parsley's pubsub module is deprecated; use the 'on' and 'off' methods on parsley instances or window.Parsley")},I="parsley:";e.listen=function(e,n){var r;if(T(),"object"==typeof arguments[1]&&"function"==typeof arguments[2]&&(r=arguments[1],n=arguments[2]),"function"!=typeof n)throw new Error("Wrong parameters");window.Parsley.on(i(e),t(n,r))},e.listenTo=function(e,n,r){if(T(),!(e instanceof V||e instanceof b))throw new Error("Must give Parsley instance");if("string"!=typeof n||"function"!=typeof r)throw new Error("Wrong parameters");e.on(i(n),t(r))},e.unsubscribe=function(e,t){if(T(),"string"!=typeof e||"function"!=typeof t)throw new Error("Wrong arguments");window.Parsley.off(i(e),t.parsleyAdaptedCallback)},e.unsubscribeTo=function(e,t){if(T(),!(e instanceof V||e instanceof b))throw new Error("Must give Parsley instance");e.off(i(t))},e.unsubscribeAll=function(t){T(),window.Parsley.off(i(t)),e("form,input,textarea,select").each(function(){var n=e(this).data("Parsley");n&&n.off(i(t))})},e.emit=function(e,t){var n;T();var r=t instanceof V||t instanceof b,s=Array.prototype.slice.call(arguments,r?2:1);s.unshift(i(e)),r||(t=window.Parsley),(n=t).trigger.apply(n,_toConsumableArray(s))};e.extend(!0,O,{asyncValidators:{"default":{fn:function(e){return e.status>=200&&e.status<300},url:!1},reverse:{fn:function(e){return e.status<200||e.status>=300},url:!1}},addAsyncValidator:function(e,t,i,n){return O.asyncValidators[e]={fn:t,url:i||!1,options:n||{}},this}}),O.addValidator("remote",{requirementType:{"":"string",validator:"string",reverse:"boolean",options:"object"},validateString:function(t,i,n,r){var s,a,o={},l=n.validator||(!0===n.reverse?"reverse":"default");if("undefined"==typeof O.asyncValidators[l])throw new Error("Calling an undefined async validator: `"+l+"`");i=O.asyncValidators[l].url||i,i.indexOf("{value}")>-1?i=i.replace("{value}",encodeURIComponent(t)):o[r.$element.attr("name")||r.$element.attr("id")]=t;var u=e.extend(!0,n.options||{},O.asyncValidators[l].options);s=e.extend(!0,{},{url:i,data:o,type:"GET"},u),r.trigger("field:ajaxoptions",r,s),a=e.param(s),"undefined"==typeof O._remoteCache&&(O._remoteCache={});var d=O._remoteCache[a]=O._remoteCache[a]||e.ajax(s),h=function(){var t=O.asyncValidators[l].fn.call(r,d,i,n);return t||(t=e.Deferred().reject()),e.when(t)};return d.then(h,h)},priority:-1}),O.on("form:submit",function(){O._remoteCache={}}),window.ParsleyExtend.addAsyncValidator=function(){return Utils.warnOnce("Accessing the method `addAsyncValidator` through an instance is deprecated. Simply call `Parsley.addAsyncValidator(...)`"),O.addAsyncValidator.apply(O,arguments)},O.addMessages("en",{defaultMessage:"This value seems to be invalid.",type:{email:"This value should be a valid email.",url:"This value should be a valid url.",number:"This value should be a valid number.",integer:"This value should be a valid integer.",digits:"This value should be digits.",alphanum:"This value should be alphanumeric."},notblank:"This value should not be blank.",required:"This value is required.",pattern:"This value seems to be invalid.",min:"This value should be greater than or equal to %s.",max:"This value should be lower than or equal to %s.",range:"This value should be between %s and %s.",minlength:"This value is too short. It should have %s characters or more.",maxlength:"This value is too long. It should have %s characters or fewer.",length:"This value length is invalid. It should be between %s and %s characters long.",mincheck:"You must select at least %s choices.",maxcheck:"You must select %s choices or fewer.",check:"You must select between %s and %s choices.",equalto:"This value should be the same."}),O.setLocale("en");var q=new n;q.install();var k=O;return k});






                Parsley.addMessages('fr', {
                    defaultMessage: "Cette valeur semble non valide.",
                    type: {
                    email:        "Cette valeur n'est pas un adresse courriel valide.",
                    url:          "Cette valeur n'est pas une URL valide.",
                    number:       "Cette valeur doit être un nombre.",
                    integer:      "Cette valeur doit être un entier.",
                    digits:       "Cette valeur doit être numérique.",
                    alphanum:     "Cette valeur doit être alphanumérique."
                    },
                    notblank:       "Cette valeur ne peut pas être vide.",
                    required:       "Ce champ est requis.",
                    pattern:        "Cette valeur semble non valide.",
                    min:            "Cette valeur ne doit pas être inférieure à %s.",
                    max:            "Cette valeur ne doit pas excéder %s.",
                    range:          "Cette valeur doit être comprise entre %s et %s.",
                    minlength:      "Cette chaîne est trop courte. Elle doit avoir au minimum %s caractères.",
                    maxlength:      "Cette chaîne est trop longue. Elle doit avoir au maximum %s caractères.",
                    length:         "Cette valeur doit contenir entre %s et %s caractères.",
                    mincheck:       "Vous devez sélectionner au moins %s choix.",
                    maxcheck:       "Vous devez sélectionner %s choix maximum.",
                    check:          "Vous devez sélectionner entre %s et %s choix.",
                    equalto:        "Cette valeur devrait être identique."
                });

              window.Parsley.setLocale('fr')
                $(function () {
                    $('#form').parsley().on('form:validate', function (formInstance) {
                        var ok = formInstance.isValid({group: 'block1', force: true}) && formInstance.isValid({group: 'block3', force: true}) && formInstance.isValid({group: 'block2', force: true}) && formInstance.isValid({group: 'email-form', force: true}) && formInstance.isValid({group: 'form-phone', force: true});
                });
              });

$('#form').submit(function(ev) {
    // Prevent the form from actually submitting
    ev.preventDefault();




    // Send it to the server
    $.post({
        url: '/',
        dataType: 'json',
        data: $(this).serialize(),
        success: function(response) {
          if($('#form').parsley().validate() == true) {
            if (response.success) {
                $('#thanks').fadeIn();
                $('#form').find("input[type=text], textarea, select, input[type=email], input[type=select], input[type=radiobutton],input[type=file] ").val("");
            } else {
                // response.error will be an object containing any validation errors that occurred, indexed by field name
                // e.g. response.error.fromName => ['From Name is required']
            }
          }
        }
    });
    });






(function() {


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


$('.c-emergency_mobile_li').on('click', function() {
  $(this).find('.c-emergency_mobile_ul').slideToggle();
})
          
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
              top: '-120vh',
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
              var secondary = new Headroom(document.querySelector(".c-header_navigation_secondary"), {
        tolerance: 5,
        offset : document.getElementById('page').offsetHeight - 86,
        classes: {
          initial: "animated",
          pinned: "slideInDown",
          unpinned: "slideOutUp"
        }
    });

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
    secondary.init();  



      })  


$(document).ready(function() {
if($('.barba-container').hasClass('pageslug-testimonialsList')) {

    (function _(a,b,c,d,e){var f=window.console;if(window[c])return;if(!window.JSON)return;var g=window[c]={__buffer:{replay:function(){var a=this,b=function(d){var b=window[c];a.calls[d][0].split(".").forEach(function(a){return b=b[a]});b.apply(null,a.calls[d][1])};for(var d=0;d<this.calls.length;d++)b(d);this.calls=[]},calls:[],opts:null},getUserID:function(){return""},getAuthResponse:function(){return null},getAccessToken:function(){return null},init:function(a){g.__buffer.opts=a}};for(var b=0;b<d.length;b++){f=d[b];if(f in g)continue;var h=f.split("."),i=h.pop(),j=g;for(var k=0;k<h.length;k++)j=j[h[k]]||(j[h[k]]={});j[i]=function(a){if(a==="init")return;return function(){g.__buffer.calls.push([a,Array.prototype.slice.call(arguments)])}}(f)}k=a;h=/Chrome\/(\d+)/.exec(navigator.userAgent);h&&Number(h[1])>=55&&"assign"in Object&&"findIndex"in[]&&(k+="&ua=modern_es6");j=document.createElement("script");j.src=k;j.async=!0;e&&(j.crossOrigin="anonymous");i=document.getElementsByTagName("script")[0];i.parentNode&&i.parentNode.insertBefore(j,i)})("https:\/\/connect.facebook.net\/fr_CA\/sdk.js?hash=eb854bb36b11e5d0f15ca21c2026c015", 1554433319, "FB", ["AppEvents.EventNames","AppEvents.ParameterNames","AppEvents.activateApp","AppEvents.clearAppVersion","AppEvents.clearUserID","AppEvents.getAppVersion","AppEvents.getUserID","AppEvents.logEvent","AppEvents.logPageView","AppEvents.logPurchase","AppEvents.setAppVersion","AppEvents.setUserID","AppEvents.updateUserProperties","Canvas.Plugin.showPluginElement","Canvas.Plugin.hidePluginElement","Canvas.Prefetcher.addStaticResource","Canvas.Prefetcher.setCollectionMode","Canvas.getPageInfo","Canvas.scrollTo","Canvas.setAutoGrow","Canvas.setDoneLoading","Canvas.setSize","Canvas.setUrlHandler","Canvas.startTimer","Canvas.stopTimer","Event.subscribe","Event.unsubscribe","XFBML.parse","addFriend","api","getAccessToken","getAuthResponse","getLoginStatus","getUserID","init","login","logout","publish","share","ui"], true);
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
            {access_token:'EAAHWLrDxevoBAG6ZBDpR5yCSfTUKh092CoQdEqrZANhQfzF7ZCrCJ0clZA2KtHpw2xnqJtzPZC3c7NZB8UUW3YNHFfMBRGZCui2A0mxTS0ZABBU7qdxSvT4ZBA3Buxcn0zSmhKwromtZBlwhMu2y8wsa2iQEZCdpsRt5bJZCHIymqrjJZAVwJR8wGiVLqsYN4pzI7FkAZBBhxcCzobiHjfYkeQhJZCaTwjK64ah97mvKfhHbg2yPQZDZD',
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
}
});      