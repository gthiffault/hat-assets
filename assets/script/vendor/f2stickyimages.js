$("#c-testimonials_image").stick_in_parent({
	offset_top:124,
	sticky_class:"c-element-fixed"
});

// JQUERY
$('.c-accordion_title').on('click', function() {
$(this).next('.c-accordion_content_wrap').slideToggle(400);
$(this).toggleClass('-js-accordion-active')
}) 

      // $(function() {
      //   // Initializes and creates emoji set from sprite sheet
      //   window.emojiPicker = new EmojiPicker({
      //     emojiable_selector: '[data-emojiable=true]',
      //     assetsPath: 'https://humain-avant-tout.agencezel.dev/assets/img/emoji/',
      //     popupButtonClasses: 'fa fa-smile-o'
      //   });
      //   // Finds all elements with `emojiable_selector` and converts them to rich emoji input fields
      //   // You may want to delay this step if you have dynamically created input fields that appear later in the loading process
      //   // It can be called as many times as necessary; previously converted input fields will not be converted again
      //   window.emojiPicker.discover();
      // });

      //          var connection = window.navigator.connection    ||
      //                     window.navigator.mozConnection ||
      //                     null;
      //    if (connection === null) {
      //       document.getElementById('ni-unsupported').classList.remove('hidden');
      //    } else if ('metered' in connection) {
      //       document.getElementById('nio-supported').classList.remove('hidden');
      //       [].slice.call(document.getElementsByClassName('old-api')).forEach(function(element) {
      //          element.classList.remove('hidden');
      //       });
 
      //       var bandwidthValue = document.getElementById('b-value');
      //       var meteredValue = document.getElementById('m-value');
 
      //       connection.addEventListener('change', function (event) {
      //          bandwidthValue.innerHTML = connection.bandwidth;
      //          meteredValue.innerHTML = (connection.metered ? '' : 'not ') + 'metered';
      //       });
      //       connection.dispatchEvent(new Event('change'));
      //    } else {
      //       var typeValue = document.getElementById('t-value');
      //       [].slice.call(document.getElementsByClassName('new-api')).forEach(function(element) {
      //          element.classList.remove('hidden');
      //       });
 
      //       connection.addEventListener('typechange', function (event) {
      //          typeValue.innerHTML = connection.type;
      //       });
      //       connection.dispatchEvent(new Event('typechange'));
      //    }