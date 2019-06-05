//****************************************************************************//
    //TESTIMONIALS - COMMENTS
//****************************************************************************//

if($('body').hasClass('pageslug-testimonialsList')) {




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
            {access_token:'EAAHWLrDxevoBAOznMiW6uOpBgFQ8TsZAQW9BczbAqZBQSudLJyIRkvINQdzDZC5ZCy5yWvisjorZC2YgDI15N6Kec6zm8HSE7W1fZBKybGwaZAHE5PLA2X7kgL1O3D6yVzOsQZAvG0h2vfMZBcBBIz7uJTMzPNV9C6aOAuF94MOuifuAjBm5oYzAm2vlRNyUD6CPyHx52A8eZAjDBoyvB0s5sTesmsPqwNXzdNA6NTlmOpxgZDZD',
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


$('.c-comments_toggle').on('click', function() {
    $('.c-comments').slideToggle(400);
    $(this).toggleClass('-js-visibles-comments');
})