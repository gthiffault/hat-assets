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


if($('#form').length) {
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
                $('.c-form_confirmation').slideDown();
                $('#form').find("input[type=text], textarea, select, input[type=email], input[type=select], input[type=radiobutton],input[type=file] ").val("");
            } else {
                // response.error will be an object containing any validation errors that occurred, indexed by field name
                // e.g. response.error.fromName => ['From Name is required']
            }
          }
        }
    });
    });


}



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



if($('.c-testimonials_form').length) {
     $(function() {
       window.emojiPicker = new EmojiPicker({
         emojiable_selector: '[data-emojiable=true]',
         assetsPath: 'https://humain-avant-tout.agencezel.dev/assets/img/emoji/',
         popupButtonClasses: 'fa fa-smile-o'
        });
        // Finds all elements with `emojiable_selector` and converts them to rich emoji input fields
        // You may want to delay this step if you have dynamically created input fields that appear later in the loading process
        // It can be called as many times as necessary; previously converted input fields will not be converted again
        window.emojiPicker.discover();
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