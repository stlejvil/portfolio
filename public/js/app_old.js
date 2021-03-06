// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs

var borderSize;
var arnaudImgHeight;
var imgBottom;
var waypointOffset;
var borderBottom;
var h2M;
var pageSpeed = 600;
var nextScroll;
var prevScroll = 0;
var afterSlideLoadBug = 0;	// To prevent afterSlideLoad to load twice
var imgHeight = [];
var lasturl = "";
var imgDisplayed = 0;
var infosR = 0;

$(document).ready(function() {

	h2M = $('#infos article h2 span').css('margin-left');	// stock de la valeur du margin-left des h2

	$('#fullpage').fullpage({
		// Navigation
		anchors: ['home'],
		// Scrolling
		loopHorizontal: false,
		css3: true,
		scrollOverflow: true,
		// scrollOverflowOptions: {
		// 	scrollbars: true,
		// 	mouseWheel: true,
		// 	hideScrollbars: false,
		// 	fadeScrollbars: false
		// },
		// fixedElements: '.borderTop, .borderBottom',
		// normalScrollElements: '.borderTop, .borderBottom',
		// paddingBottom: 80,
		// Design
		controlArrows: false,
		// Accessibility
		keyboardScrolling: true,
		// Events
		'afterRender': function() {
			// console.log('afterRender');

			borders();

			var duration = '300';

			$('#gallery > img').each(function(i){
				var id = '#';
				id += this.id.slice(0, -2);
				id += 'nfo';

				imgHeight.push({
					'id' : id,
					'height' : []
				});
				imgHeight[i].height.push(this.height);
			});
			
			for (var i = 1; i < imgHeight.length; i++) {
				imgHeight[i].height = parseInt(imgHeight[i].height) + parseInt(imgHeight[i-1].height);
			};


			// console.log($('.fp-scroller').css('transform', 'translateY'));
			// $('.iScrollVerticalScrollbar').on('update', function() {
			// 	console.log($('.fp-scroller').scrollHeight);
			// });
			// var myScroll = new IScroll('.fp-scrollable', {
			// 	mouseWheel: true,
			// 	scrollbars: true
			// });
			// console.log($('.iScrollLoneScrollbar .iScrollIndicator'));
			var myScroll = $('.fp-scrollable');
			myScroll.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
				console.log(this);
			});

			var a = 0;	// Nouvelle index
			var b = a;	// Ancien index
			var c = 70;	// offset pour switcher les infos 

			// $('.fp-scrollable').slimScroll().on('slimscrolling', function currentScroll(e, pos){
				var pos = 0;
				switch (true) {
					case (pos < imgHeight[0].height-c) :
						a = 0; // Accueil
					break;
					case (pos > imgHeight[0].height-c) && (pos < imgHeight[1].height-c) :
						a = 1; // Pannopaille
					break;
					case (pos > imgHeight[1].height-c) && (pos < imgHeight[2].height-c) :
						a = 2; // LME - Static
					break;
					case (pos > imgHeight[2].height-c) && (pos < imgHeight[3].height-c) :
						a = 3; // LME - Shop
					break;
					case (pos > imgHeight[3].height-c) && (pos < imgHeight[4].height-c) :
						a = 4; // LME - Newsletters
					break;
					case (pos > imgHeight[4].height-c) && (pos < imgHeight[5].height-c) :
						a = 5; // LME - Contest
					break;
					case (pos > imgHeight[5].height-c) && (pos < imgHeight[6].height-c) :
						a = 6; // LME - Truck
					break;
					case (pos > imgHeight[6].height-c) && (pos < imgHeight[7].height-c) :
						a = 7; // LME - Banners
					break;
					case (pos > imgHeight[7].height-c) && (pos < imgHeight[8].height-c) :
						a = 8; // Aïku
					break;
					case (pos > imgHeight[8].height-c) && (pos < imgHeight[9].height-c) :
						a = 9; // OldPortfolio
					break;
					case (pos > imgHeight[9].height-c) && (pos < imgHeight[10].height-c) :
						a = 10; // Aïki
					break;
					case (pos > imgHeight[10].height-c) && (pos < imgHeight[11].height-c) :
						a = 11; // Musivation
					break;
					case (pos > imgHeight[11].height-c) && (pos < imgHeight[12].height-c) :
						a = 12; // Bohren
					break;
					case (pos > imgHeight[12].height-c) :
						a = 13; // Whourkr
					break;
				}
				// console.log(a);
				if (b != a) {
					b = a;

					$.each( imgHeight, function(i) {
						$(imgHeight[i].id).hide();
						$('#infos ul').hide();
					});

					imgDisplayed = b;

					keysAllowed();

					$(imgHeight[b].id).stop().fadeToggle( duration, 'linear' );
					$('#infos ul').stop().fadeIn( duration, 'linear' );

					if (b == 0) {											// Si on est sur la première image

						$('#infos ul').hide();

						nextScroll = parseInt(imgHeight[0].height);
						prevScroll = 0;

					} else {

						$('#infos ul').show();

						nextScroll = parseInt(imgHeight[b].height);

						if (b == 1) {										// Si on est sur la seconde image
							prevScroll = 0;
						} else {											
							prevScroll = parseInt(imgHeight[b-2].height);
						};

					};
					// console.log('nextScroll : '+nextScroll);
					// console.log('prevScroll : '+prevScroll);

				};
			// });
		},
		'afterResize': function() {
			// console.log('afterResize');
		},
		'afterSlideLoad': function( anchorLink, index, slideAnchor, slideIndex ) {

			// console.log('afterSlideLoad');

			afterSlideLoadBug++;

			if (afterSlideLoadBug > 1) {

				$.fn.fullpage.setKeyboardScrolling(true);

				keysAllowed();

				if(index == 1 && slideIndex == 1) {		// Au chargement de la mainPage
					// $('.fp-scrollable').slimScroll().on('slimscrolling');
					// $('.slimScrollBar').show();
					// $('#infos').css({'width' : '25vw'});
					// $('#detailsContent').empty();
					$('#contactIcon').off('click').click(function() {
						$.fn.fullpage.moveSlideLeft();
					});
					$('#arnaudInfo p a').off('click').click(function() {
						$.fn.fullpage.moveSlideLeft();
					});
					for (var i = $('#gallery > img').length - 1; i >= 1; i--) {		// Toutes les images sont cliquables sauf la première
						$($('#gallery > img')[i]).off('click').click(function() {
							console.log($(this).attr('id'));
							// $('.fp-scrollable').slimScroll({ scrollTo: nextScroll });
							// $.fn.fullpage.moveSlideRight();
						})
					};
					$('.bgArrow').off('click').click(function() {
						$.fn.fullpage.moveSlideRight();
					})
				};

				if(index == 1 && slideIndex == 0) {		// Au chargement de la contactPage
					
					$('#contactIcon').off('click').click(function() {
						$.fn.fullpage.moveSlideRight();
					});
				};

				if(index == 1 && slideIndex == 2) {	// Au chargement de la detailsPage
					// $('#infos').css({'position' : 'fixed'});
					// slickDetails();
					$('.single-item').slick();
					// $('.bgArrow').off('click');
					$('.bgArrow').off('click').click(function() {
						$.fn.fullpage.moveSlideLeft();
					})
				};
			};
		},
		'onSlideLeave': function( anchorLink, index, slideIndex, direction ) {

			// console.log('onSlideLeave');

			// if ( $('.fp-controlArrow').css('border-width') != '0px') {
			// 	$('.fp-controlArrow').css({'border-width' : 0});
			// 	$('.fp-controlArrow').hide();
			// 	// console.log('arrows is hidden');
			// };

			if (afterSlideLoadBug > 0) {

				var windowW = $(window).width();
				var infosW = $('#infos').width();
				var galleryW = $('#gallery').width();
				
				var infosM = parseInt($('#infos').css('margin-right'));

				var infoDisplayed = '#';
				infoDisplayed += $('#infos article:visible').attr('id').slice(0, -4);

				$(document).off( 'keydown' );

				if(index == 1 && slideIndex == 1 && direction == 'right'){	// De la mainPage à detailsPage

					$(infoDisplayed+'Details').fadeToggle(pageSpeed);
					// $('#detailsContent').load('details.html '+infoDisplayed+'Details');
					var detailsFile = infoDisplayed.substring(1);
						detailsFile += 'Details.html';
					$('#detailsContent').load('details/'+detailsFile+' '+infoDisplayed+'Details');
					// $('#contactIcon').css({'position' : 'absolute'});
					infosR = $('#infos').css('right');
					// var infoVW = 25/windowW;
					// console.log(infosR);
					// $('#infos').css({'right': infosM + galleryW});
					$(infoDisplayed+'Info').find('p').fadeToggle(0);
					var infosGalleryPos = infosM + galleryW
					// $('.slimScrollBar').hide();
					$('#infos ul li .toggleGo').toggle(0);
					$('#infos ul li .toggleBack').toggle(0);
					$('#infos').delay(0).animate({'right': infosGalleryPos }, pageSpeed, 'swing', function() {$('#infos ul li .bgArrow').data('index', '2');});
					$('#infos article h2 span').delay(0).animate({'margin-left': 0 }, pageSpeed, 'swing');
					
				};

				if(index == 1 && slideIndex == 2 && direction == 'left') {	// De detailsPage à la mainPage

					$(infoDisplayed+'Details').fadeToggle(pageSpeed);
					$(infoDisplayed+'Info').find('p').fadeToggle(0);

					// var infosR = $('#infos').css('right');
					// var infoVW = 25/windowW;
					// console.log(infosR);
					// $('#infos').css({'right' : infosM*2 + galleryW });
					$('#infos ul li .toggleGo').toggle(0);
					$('#infos ul li .toggleBack').toggle(0);
					$('#infos').delay(0).animate({'right': infosR }, pageSpeed, 'swing', function() {$('#infos ul li .bgArrow').data('index', '3'); $('#contactIcon').css({'position' : 'absolute'});});
					$('#infos article h2 span').delay(0).animate({'margin-left': h2M }, pageSpeed, 'swing');
				};

				if(index == 1 && slideIndex == 1 && direction == 'left') {	// De la mainPage à contactPage

					// $('.borderBottom').removeClass('fixed');
					// $('.borderBottom').css({'height' : borderSize});

					// $('.slimScrollBar').hide();
					// $('#infos').css({'position' : 'absolute'});
					$('#contactContent').fadeToggle(pageSpeed);
					$('#contactIcon').css({'position' : 'fixed'});

				};

				if(index == 1 && slideIndex == 0 && direction == 'right') {	// De contactPage à la mainPage

					// $('.borderBottom').addClass('fixed');
					// $('.borderBottom').css({'height' : borderBottom});

					$('#contactContent').fadeToggle(pageSpeed);
					$('#contactIcon').css({'position' : 'absolute'});
				};
			};
		},
	});
	// $(document).foundation();
});

$(window).resize( function () {
	
	// console.log('resize');
	borders();

});

function borders() {

	borderSize = $('#gallery').css('padding-top'); 		// Taille de la bordure
	arnaudImgHeight = $('#arnaudImg').height();			// Taille de la première image
	imgBottom = arnaudImgHeight + parseInt(borderSize);	// Addition des deux tailles pour connaître le bas de l'image
	
	nextScroll = arnaudImgHeight;

	var windowHeight = $(window).height();				// Taille de l'écran

	// Calcul du borderBottom
	if ( windowHeight > arnaudImgHeight + parseInt(borderSize) * 2 ) {	// Si l'image ne dépasse pas l'écran
		// borderBottom = windowHeight - imgBottom + 1; 					// La bordure ira juste dessous l'image (+1 = Chrome Fix)
		borderBottom = windowHeight - imgBottom; 						// La bordure ira juste dessous l'image
		borderBottom += 'px';
	} else {
		borderBottom = borderSize;										// Si l'image dépasse de l'écran, la bordure aura sa taille minimale
	};

	// $('.borderBottom').css({'margin-top' : borderBottom,
	// 						'border-width' : '0 0 '+ borderBottom, });	// On pousse la bordure en bas et on lui applique sa taille
	$('.borderBottom').css({'height' : borderBottom});
	// var scrollFix = parseInt(borderBottom);								// Fix pour que la dernière image ne soit pas coupé par la bordure du bas

	$('#gallery').css({'padding-bottom' : borderBottom});
	$.fn.fullpage.reBuild();

	// if (parseInt($('#gallery img:last-child').css('margin-bottom')) == '0') {
	// 	$('#gallery img:last-child').css({'margin-bottom' : scrollFix});	
	// } else {
		// $('#gallery img:last-child').css({'margin-bottom' : scrollFix - parseInt(borderSize)});
	// };
};

function keysAllowed() {
	// console.log('s = '+imgDisplayed);
	var id = $('.fp-slidesContainer').children('.active').attr('id');
	$(document).off( 'keydown' );
	$(document).on( 'keydown', function(e){
		switch (id) {
			case 'contactPage':
				if (e.which == 39) {		// Droite
						$.fn.fullpage.moveSlideRight();
				};
			break;
			case 'mainPage':
				switch (e.which) {
					case 38:				// Haut
						// $('.fp-scrollable').slimScroll({ scrollTo: prevScroll });
					break;
					case 40:				// Bas
						// $('.fp-scrollable').slimScroll({ scrollTo: nextScroll });
					break;
					case 37:				// Gauche
						$.fn.fullpage.moveSlideLeft();
					break;
					case 39:				// Droite
						if (imgDisplayed > 0) {
							$.fn.fullpage.moveSlideRight();
						};
					break;
				};
			break;
			case 'detailsPage':
				if (e.which == 37) {		// Gauche
						$.fn.fullpage.moveSlideLeft();
				};
			break;
		};
	});
};

// function slickDetails() {
// 	$('.single-item').slick();
// 	// console.log($('.single-item'));
// };