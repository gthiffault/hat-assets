if($('body').hasClass('testimonialsList')) {
    (function _(a,b,c,d,e){var f=window.console;f&&Math.floor(new Date().getTime()/1e3)-b>7*24*60*60&&f.warn("The Facebook JSSDK is more than 7 days old.");if(window[c])return;if(!window.JSON)return;var g=window[c]={__buffer:{replay:function(){var a=this,b=function(d){var b=window[c];a.calls[d][0].split(".").forEach(function(a){return b=b[a]});b.apply(null,a.calls[d][1])};for(var d=0;d<this.calls.length;d++)b(d);this.calls=[]},calls:[],opts:null},getUserID:function(){return""},getAuthResponse:function(){return null},getAccessToken:function(){return null},init:function(a){g.__buffer.opts=a}};for(var b=0;b<d.length;b++){f=d[b];if(f in g)continue;var h=f.split("."),i=h.pop(),j=g;for(var k=0;k<h.length;k++)j=j[h[k]]||(j[h[k]]={});j[i]=function(a){if(a==="init")return;return function(){g.__buffer.calls.push([a,Array.prototype.slice.call(arguments)])}}(f)}k=a;h=/Chrome\/(\d+)/.exec(navigator.userAgent);h&&Number(h[1])>=55&&"assign"in Object&&"findIndex"in[]&&(k+="&ua=modern_es6");j=document.createElement("script");j.src=k;j.async=!0;e&&(j.crossOrigin="anonymous");i=document.getElementsByTagName("script")[0];i.parentNode&&i.parentNode.insertBefore(j,i)})("https:\/\/connect.facebook.net\/fr_CA\/sdk.js?hash=eb854bb36b11e5d0f15ca21c2026c015", 1554433319, "FB", ["AppEvents.EventNames","AppEvents.ParameterNames","AppEvents.activateApp","AppEvents.clearAppVersion","AppEvents.clearUserID","AppEvents.getAppVersion","AppEvents.getUserID","AppEvents.logEvent","AppEvents.logPageView","AppEvents.logPurchase","AppEvents.setAppVersion","AppEvents.setUserID","AppEvents.updateUserProperties","Canvas.Plugin.showPluginElement","Canvas.Plugin.hidePluginElement","Canvas.Prefetcher.addStaticResource","Canvas.Prefetcher.setCollectionMode","Canvas.getPageInfo","Canvas.scrollTo","Canvas.setAutoGrow","Canvas.setDoneLoading","Canvas.setSize","Canvas.setUrlHandler","Canvas.startTimer","Canvas.stopTimer","Event.subscribe","Event.unsubscribe","XFBML.parse","addFriend","api","getAccessToken","getAuthResponse","getLoginStatus","getUserID","init","login","logout","publish","share","ui"], true);
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
            {access_token:'EAAHWLrDxevoBAAoztFpQlZBkZBgVc5Hnwx6SW3wA9UQ6m9j8dhl6FDFhIJ4625ZBG8Nk540m4VDDeZCwTLo1Kte3ZCwoynTCZA6D8bMNfQ05PCge8H75fmrmYeKMgEZCIzyxTRe7TZCzEj9agc6JpiA2Dpd8F5WPke7gu0xk2EE6iZC3sfRZCaHkjNnhUoF7wEqiZCj6UMvfdx8IjEMy9UjfU2Nus65BZALJgy7pZB7KvPnMyUwZDZD',
            fields:"comments.limit(10000){message,attachment}"},
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
            if(x > 5) {
                $('.c-comment').append($('<li class="js-hidden">').append(array[x]['message']));
            } else {
                $('.c-comment').append($('<li>').append(array[x]['message']));
            }
        }
        $('.c-comments_view').on('click',function() {
            $('.js-hidden').addClass('-visible')
        })
    },1000);
}