// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs

var project;
var _slideIndex = 0;
var flag = 1;

$(document).ready(function() {
	// $('.single-item').slick();
	$('#fullpage').fullpage({

		// Navigation
		// anchors: ['home'],
		// slidesNavigation: false,

		// Scrolling
		// autoScrolling: false,
		loopHorizontal: false,
		// scrollOverflow: true,
		// scrollOverflowOptions: {
		// 	scrollbars: true,
		// 	mouseWheel: true,
		// 	hideScrollbars: false,
		// 	fadeScrollbars: false
		// },
		// normalScrollElements: '.borderTop, .borderBottom',

		// Accessibility
		keyboardScrolling: true,

		// Design
		controlArrows: false,
		verticalCentered: false,
		// paddingTop: 80,
		// paddingBottom: 80,
		// fixedElements: '.borderTop, .borderBottom, #contactIcon, #github',
		fixedElements: '.projectAbstract',

		// Events
		onLeave: function(index, nextIndex, direction) {
			// console.log('index : '+index);
			// console.log('nextIndex : '+nextIndex);
			// console.log('direction : '+direction);

			$('.projectAbstract').removeClass('active');
			project = $('.fp-section:nth-child('+nextIndex+')').attr('data-anchor');
			$('#'+project+'Info').addClass('active');

			if (index == 2 && nextIndex == 1) {
				_slideIndex = 1;
			} else if (index == 1 && nextIndex == 2) {
				_slideIndex = 0;
			};

			if (nextIndex > 1 && flag == 0) {
				flag++;
				$.fn.fullpage.moveTo(nextIndex, _slideIndex);
			};
			
			disallowKeyboard();

		},
		afterLoad: function(anchorLink, index) {
			// console.log('anchorLink : '+anchorLink);
			// console.log('index : '+index);

			if (anchorLink == 'home') {
				if ($('#homeInfo').hasClass('active') == true) {
					_slideIndex = 1;
				};
			}
			flag = 0;
			keysAllowed(index, _slideIndex);
		},
		'afterRender': function() {
			// console.log('afterRender');
			$('.single-item').slick();
		},
		'afterResize': function() {
			// console.log('afterResize');
		},
		'afterSlideLoad': function( anchorLink, index, slideAnchor, slideIndex ) {
			// console.log('anchorLink : '+anchorLink);
			// console.log('index : '+index);
			// console.log('slideAnchor : '+slideAnchor);
			// console.log('slideIndex : '+slideIndex);

			keysAllowed(index, slideIndex);
			
		},
		'onSlideLeave': function( anchorLink, index, slideIndex, direction ) {
			// console.log('anchorLink : '+anchorLink);
			// console.log('index : '+index);
			// console.log('slideIndex : '+slideIndex);
			// console.log('direction : '+direction);

			disallowKeyboard();

			if(index > 1 && direction == 'right') {	// Au chargement de la detailsPage
				$('.projectAbstract').addClass('detailed').onCSSTransitionEnd( function() {
					$('.projectAbstract').hide();
				});
				$('.projectDetails').addClass('detailed');
			};
			if(index > 1 && direction == 'left') {	// Au chargement de la projectPage
				$('.projectAbstract').show();
				$('.projectAbstract').removeClass('detailed').onCSSTransitionEnd( function() {
					$('.projectAbstract').show();
				});
				$('.projectDetails').removeClass('detailed');
			};
			if(index == 1 && direction == 'left') {	// Au chargement de la contactPage
				$('.projectAbstract').show();
				$('.projectAbstract').removeClass('fixed detailed active').onCSSTransitionEnd( function() {
					$('.projectAbstract').show();
				});

			}
			if(index == 1 && direction == 'right') {	// Au chargement de la mainPage
				$('.projectAbstract').addClass('fixed');
				$('.projectAbstract:eq(0)').addClass('active');
			}
		},
	});
	// $(document).foundation();
});

// $(window).resize( function () {
// 	console.log('resize');
// });

function keysAllowed(index, slideIndex) {
	// console.log('index : '+index);
	// console.log('slideIndex : '+slideIndex);

	if (index > 1) {
		_slideIndex = slideIndex;
	};

	disallowKeyboard();

	if (index == 1 && slideIndex == 0) {		// Au chargement de la contactPage
		$.fn.fullpage.setAllowScrolling(true);
		$.fn.fullpage.setKeyboardScrolling(true, 'right');
	} else if (index == 1 && slideIndex == 1) {	// Au chargement de la mainPage
		$.fn.fullpage.setAllowScrolling(true, 'down, left');
		$.fn.fullpage.setKeyboardScrolling(true, 'down, left');
	} else if (index > 1 && slideIndex == 0) {	// Au chargement de la projectPage
		$.fn.fullpage.setAllowScrolling(true, 'up, right, down');
		$.fn.fullpage.setKeyboardScrolling(true, 'up, right, down');
	} else if (index == 2 && slideIndex == 1) {	// Au chargement de la 1ère detailsPage
		$.fn.fullpage.setAllowScrolling(true, 'down, left');
		$.fn.fullpage.setKeyboardScrolling(true, 'down, left');
	} else if (index > 1 && slideIndex == 1) {	// Au chargement de la detailsPage
		$.fn.fullpage.setAllowScrolling(true, 'up, down, left');
		$.fn.fullpage.setKeyboardScrolling(true, 'up, down, left');
	};
};
function disallowKeyboard() {
	$.fn.fullpage.setAllowScrolling(false, 'up, right, down, left');
	$.fn.fullpage.setKeyboardScrolling(false, 'up, right, down, left');
}