requirejs.config({
	baseUrl: "js",
	paths: {
		"jquery": "jquery-1.11.0.min",
		"jqueryui": "jquery-ui-1.11.1.custom.min",
		"jquery.domline": "jquery.domline.min"
	},
	
	shim: {
			"jqueryui": {
				export: "$",
				deps: ['jquery']
			},
			"notify.min": {
				export: "$",
				deps: ['jquery']
			},
			"jquery.domline": {
				export: "$",
				deps: ['jquery']
			}
		}
});

require(["jquery", "vex.dialog.min", "imagesloaded.pkgd.min", "jquery.domline", "jqueryui", "jquery.layout-latest", "notify.min", "TOC", "CardManager"], function ($, dialog, imagesLoaded) {
	var pageLayout = $("body").layout({
										applyDefaultStyles: true, resizable: false, slidable: false, closable: false,
										spacing_open: 0, spacing_closed: 0,
										west__size: "50%",
										east__initHidden: true,
										south__size: "82",
									});
	
	pageLayout.panes.north.css( { border: "none", padding: 0 } );
	pageLayout.panes.center.css( { border: "none", padding: 0 } );
	pageLayout.panes.west.css( { border: "none" } );
	pageLayout.panes.east.css( { border: "none", padding: 0 } );
	pageLayout.panes.south.css( { border: "none", padding: 0, overflow: "hidden" } );

	// recalculate layout after padding changes	
	pageLayout.resizeAll();
	
	dialog.defaultOptions.className = 'vex-theme-flat-attack';
	
	var toc = 
		[
			{
				title: "Creating Aliases",
				html: "CreatingAliases.html",
				"watch": {
					html: "CreatingAliases-watchit/index.html",
					completed: false,
					keys: [
								{ slide: 1, step: 1 },
								{ slide: 2, step: 2 },
								{ slide: 3, step: 3, sub: "#part1" },
								{ slide: 4, step: 3, sub: "#part2" },
								{ slide: 5, step: 3, sub: "#part3" },
								{ slide: 6, step: 4 },
								{ slide: 7, step: 5 },
							]
				},
				"try": {
					html: "CreatingAliases-tryit/index.html",
					completed: false,
					keys: [
								{ slide: 1, step: 1 },
								{ slide: 2, step: 2 },
								{ slide: 3, step: 3, sub: "#part1" },
								{ slide: 4, step: 3, sub: "#part2" },
								{ slide: 5, step: 3, sub: "#part3" },
								{ slide: 6, step: 4 },
								{ slide: 7, step: 5 },
							]
				}
			},
			{
				title: "Working with Files",
				html: "WorkingWithFiles.html",
				"watch": {
					html: "WorkingWithFiles-watch/index.html",
					completed: false,
					keys: [
								{ slide: 1, step: 1 },
								{ slide: 2, step: 2 },
								{ slide: 3, step: 3, sub: "#part1" },
								{ slide: 4, step: 3, sub: "#part2" },
								{ slide: 5, step: 4, sub: "#part1" },
								{ slide: 6, step: 4, sub: "#part2" },
							]
				},
				"try": {
					html: "WorkingWithFiles-try/index.html",
					completed: false,
					keys: [
								{ slide: 1, step: 1 },
								{ slide: 2, step: 2 },
								{ slide: 3, step: 3, sub: "#part1" },
								{ slide: 4, step: 3, sub: "#part2" },
								{ slide: 5, step: 4, sub: "#part1" },
								{ slide: 6, step: 4, sub: "#part2" },
							]
				}
			},
		];
	
	var AD_SPACING = 30, AD_TRANSITION = 1500, AD_DELAY = 8000;
	
	var currentIndex = 1;
	var currentType = "";
	
	var table_of_contents = new TOC($("body"));
	
	var card_manager = new CardManager(table_of_contents.getBackground());
	table_of_contents.getElement().bind("sized", function () { card_manager.setWidth(table_of_contents.getTOCWidth()); });
	card_manager.getElement().bind("showLesson", showLesson);
	
	var cp, cp_events;
	var captivateMapping = [];
	
	var started = false;
	var shownHelp = false;
	var fromSearch = false;
	
	var currentAd = undefined;
	var inAd = false;
	
	var autoScroll = true;
	
	var frame = $("iframe");
	
	positionAds();
	
	$(document).tooltip();
	
	$(window).resize(onWindowResize);
	
	$("#watchit").click(playWatchIt);
	$("#tryit").click(playTryIt);
	
	$("#back").click(onPreviousCaptivate);
	$("#pause").click(onPauseCaptivate);
	$("#stop").click(onStopCaptivate);
	$("#next").click(onNextCaptivate);
	$("#auto-scroll-id").change(onChangeAutoScroll);
	
	$("#toc-button").click(onClickTOC);
	
	$("#toc-searchtext").on("input", onSearchTOC);
	
	$(table_of_contents.getElement()).bind("selected", onShowChapter);
	
	$(".left-message").click(onClickMessage);
	
	$(".ad").hover(onAdHoverIn, onAdHoverOut);
	$(".ad").click(onClickAd);
	
	$(window).keydown(onKeyDown);
	
	scrollToNextAd();
	
	imagesLoaded(document, onImagesLoaded);
	
	if (location.search != "") {
		fromSearch = true;
		loadContents(0, "Creating Aliases");
	}
	
	function onImagesLoaded () {
		$("#screen-cover").css("background-color", "rgba(0, 0, 0, .7)");

		var h1 = $("#buy-now").outerHeight();
		var h2 = $("#buy-now-container").outerHeight();
		var w = $("#buy-now-container").width();
		var p = Math.floor(((h2 - h1) * .5) / w * 100);
		
		$("#buy-now").css("margin-top", p + "%");
		
		$("#buy-now").addClass("animated flipInX").css("display", "block");
		
		setTimeout(function () {
			$("#caption").addClass("animated lightSpeedIn").css("visibility", "visible");
		}, 1500);
		
		$("#buy-now").click(function () {
			$("#screen-cover").addClass("animated fadeOut");
			$("#buy-now-container").addClass("animated flipOutX");
			setTimeout(beginIntro, 500);
		});
	}
	
	function beginIntro () {
		$("#screen-cover").hide();
		$("#buy-now-container").hide();
		
		if (!fromSearch) {
			showLeftMessage("#left-message-intro", true);
			
			setTimeout(function () { drawLines(); }, 1500);
		} else if (fromSearch) {
			showLeftMessage("#left-message-help", true);
			shownHelp = true;
		}
	}
	
	function drawLines () {
		var elem1 = $("#popular");
		var bounds1 = elem1[0].getBoundingClientRect();
		var pt1 = { x: bounds1.left + bounds1.width * .5, y: bounds1.top + bounds1.height };
		var popularX = bounds1.left + bounds1.width * .5;

		var elem2 = $("#bottom-bar");
		var bounds2 = elem2[0].getBoundingClientRect();
		var pt2 = { x: bounds1.left + bounds1.width * .5, y: bounds2.top };
		
		var options = { lineWidth: 4, lineColor: "#FFEB5F" };
				
		$.line(pt1, pt2, options);
		
		elem1 = $("#search");
		bounds1 = elem1[0].getBoundingClientRect();
		pt1 = { x: bounds1.left + bounds1.width * .5, y: bounds1.top + bounds1.height };
		var searchX = bounds1.left + bounds1.width * .5;
		
		elem2 = $("#left-message-intro");
		var bounds3 = elem2[0].getBoundingClientRect();
			
		pt2 = { x: bounds1.left + bounds1.width * .5, y: (bounds3.top + bounds3.height + bounds2.top) * .5 };

		$.line(pt1, pt2, options);
		
		if (searchX > popularX) {
		
			var elem3 = $("#content-pane");
			var bounds4 = elem3[0].getBoundingClientRect();
		
			pt1 = { x: bounds4.left + bounds4.width, y: pt2.y };
			
			$.line(pt2, pt1, options);
		
			elem1 = $("#left-message-intro");
			bounds1 = elem1[0].getBoundingClientRect();
			elem2 = $("#nav-container");
			bounds2 = elem2[0].getBoundingClientRect();
		
			pt2 = { x: pt1.x, y: (bounds1.top + bounds2.top) * .5 };
		
			$.line(pt1, pt2, options);
		
			elem1 = $("#toc-button");
			bounds1 = elem1[0].getBoundingClientRect();
			pt1 = { x: bounds1.left + bounds1.width * .5, y: bounds1.top + bounds1.height };
		
			$.line(pt2, { x: pt1.x, y: pt2.y }, options);
			$.line({ x: pt1.x, y: pt2.y }, pt1, options);
		} else {
			elem1 = $("#toc-button");
			bounds1 = elem1[0].getBoundingClientRect();
			pt1 = { x: bounds1.left + bounds1.width * .5, y: bounds1.top + bounds1.height };
		
			$.line(pt2, { x: pt1.x, y: pt2.y }, options);
			$.line({ x: pt1.x, y: pt2.y }, pt1, options);
		}
	}
	
	function eraseLines () {
		$(".jquery-line").remove();
	}
	
	function checkForCaptivate () {
		if (window.frames[0].cpAPIInterface) {
			cp = window.frames[0].cpAPIInterface;
			window.cp = cp;
			cp_events = window.frames[0].cpAPIEventEmitter;
			onCaptivateLoaded();
		} else {
			setTimeout(checkForCaptivate, 100);
		}
	}
	
	function onCaptivateLoaded () {
		// NOTE: this doesn't seem to fire from within an iFrame:
		cp_events.addEventListener("CPAPI_MOVIESTART", function () { console.log("movie started!"); });

		cp_events.addEventListener("CPAPI_SLIDEENTER", onSlideEntered);
		cp_events.addEventListener("CPAPI_MOVIESTOP", onMovieStop);
	}

	function onWindowResize (event) {
		pushContentDownForTitle();
		
		showLeftMessage("#left-message-intro", false);
		
		if ($("#left-message-intro").is(":visible")) {
			setTimeout(function () { eraseLines(); drawLines(); }, 250);
		}
	}
	
	function pushContentDownForTitle () {
		console.log($("#big-title").outerHeight());
		console.log($(".content").offset().top);
		var h = $("#big-title").outerHeight() - $(".content").offset().top - $("#content-pane").scrollTop();
		
		$(".content").css("padding-top", h);
	}
	
	function showLeftMessage (id, animate) {
		animate = animate == undefined ? true : animate;
		
		if (animate) {
			$(id).removeClass("animated rollIn").css({ display: "block" });
		}
		
		$(id).position({ my: "center center", at: "center center", of: $(id).parent(), collision: "none" });
		
		if (animate) {
			$(id).addClass("animated rollIn");
		}
	}
	
	function onSlideEntered (event) {
		if (!autoScroll) return;
		
		var slide = event.Data.slideNumber;
		
		console.log("slide " + slide);
		
		var centerPoint = $(".ui-layout-west").height() * .5;
		
		for (var i = 0; i < captivateMapping.length; i++) {
			if (captivateMapping[i].slide == slide) {
				var step = captivateMapping[i].step;
				var sub = captivateMapping[i].sub;
				var number = $(".number span:contains('" + step + "')");
				var stepDOM = number.parents(".step");
				
				$(".current").removeClass("current");
				
				var gotoDOM;
				
				if (sub) {
					gotoDOM = stepDOM.find(sub);
				} else {
					gotoDOM = stepDOM.find("p");
				}
				
				gotoDOM.addClass("current");
				
				var a = $(".ui-layout-west").scrollTop();
				var t = gotoDOM.offset().top;
				var b = (a + t) - centerPoint;
				$(".ui-layout-west").animate({ scrollTop: b }, 2000);
				
				break;
			}
		}
		
		/*
		// NOTE: to prevent autoplaying
		if (event.Data.slideNumber == 1 && !started) {
			cp.pause();
		
			dialog.buttons.YES.text = 'Watch It';
			dialog.alert({
				message: "I am ready to <b>Create an Alias</b>.",
				callback: function (value) {
					cp.play();
					started = true;
				}
			});
		}
		*/
	}
	
	function onMovieStop () {
		var slide = getCurrentSlide();
		
		if (slide == getNumberOfSlides()) {
			onLessonComplete();
		}
	}
	
	function getCurrentSlide () {
		return cp.getCurrentSlideIndex();
	}
	
	// TODO: is there a Captivate method for this?
	function getNumberOfSlides () {
		return captivateMapping.length;
	}
	
	function onLessonComplete () {
		setTimeout(showSuccessMessage, 1000);
	}
	
	function showSuccessMessage () {
		var audio = $("#lesson-complete-audio")[0];
		audio.play();

		toc[currentIndex][currentType].completed = true;
		
		/*
		var targetSelector = "#captivate-holder iframe";
		
		var target = $(targetSelector);
		
		var check = $("#success-box");
		
		var size = Math.min(target.width() * .5, target.height() * .5);
		
		check.width(size).height(size);
		
		// TODO: this doesn't work the second time
		check.position( { my: "center top", at: "center top", of: target, collision: "none" } );
	
		check.show("slow");
		*/
		
		showCaptivateControls(false, true);
	}
	
	function showCaptivateControls (show, showWatchOrTry) {
		if (show) {
			$("#watch-or-try-holder").hide("highlight");
			$(".control-bar").show("blind");
			$("#bottom-bar").hide("blind");
		} else {
			$("#watch-or-try-holder").removeClass("animated");
			$("#watch-or-try-holder").css("display", "none");
			
			$("#watchit-check").prop("checked",  toc[currentIndex]["watch"].completed);
			$("#tryit-check").prop("checked",  toc[currentIndex]["try"].completed);
			
			if (showWatchOrTry) {
				setTimeout(function () {
					$("#watch-or-try-holder").addClass("animated");
				}, 0);
			
				setTimeout(function () {
					$("#watch-or-try-holder").css("transform", "scale(6)");
					$("#watch-or-try-holder").css("display", "block");
				
					setTimeout(function () {
						$("#watch-or-try-holder").css("transform", "scale(1)");
					}, 0);
				}, 2000);
			}
			
			$(".control-bar").hide("blind");
			$("#bottom-bar").show("blind");
		}
	}
	
	function setCaptivateMapping (keys) {
		captivateMapping = keys;
	}
	
	function removeCaptivate () {
		$("#captivate-holder iframe").remove();
	}
	
	function loadCaptivate (url) {
		removeCaptivate();
		
		var iframe = $("<iframe>").addClass("tutorial").attr({ frameborder: 0, src: url });
		
		$("#captivate-holder").append(iframe);
	}
		
	function playWatchIt () {
		hideHints();
		$(".left-message").css("display", "none");
		eraseLines();
		
//		var check = $("#success-box");
//		check.hide();
		
		currentType = "watch";
		
		var item = toc[currentIndex];
		
		loadCaptivate(item.watch.html);
		
		var keys = item.watch.keys;
				
		setCaptivateMapping(keys);
		
		checkForCaptivate();
		
		showCaptivateControls(true);
	}
	
	function playTryIt () {
		hideHints();
		$(".left-message").css("display", "none");
		eraseLines();
		
//		var check = $("#success-box");
//		check.hide();

		currentType = "try";

		var item = toc[currentIndex];
		
		loadCaptivate(item.try.html);

		var keys = item.try.keys;
				
		setCaptivateMapping(keys);
		
		checkForCaptivate();

		showCaptivateControls(true);		
	}
	
	function onPreviousCaptivate () {
		cp.previous();
	}
	
	function onPauseCaptivate () {
		if ($("#pause").hasClass("paused")) {
			cp.play();
			
			$("#pause").removeClass("paused");
		} else {
			cp.pause();
		
			$("#pause").addClass("paused");
		}
	}
	
	function onStopCaptivate () {
		cp.pause();
		
		removeCaptivate();
		
		$(".current").removeClass("current");
		
		showCaptivateControls(false, true);
	}
	
	function onNextCaptivate () {
		cp.next();
	}
	
	function onChangeAutoScroll () {
		autoScroll = $("#auto-scroll-id").prop("checked");
	}
	
	function hideHints () {
		$(".notifyjs-container").trigger("notify-hide");
	}
	
	function showHint (hint) {
		switch (hint) {
			case "watch or try buttons":
//				$("#watch-or-try-holder #watch-or-try").notify(message, { autoHide: false, elementPosition: "top center", className: "info" });
				break;
		}
	}
	
	function loadContents (index, title, watch_or_try) {
		$(".left-message").css("display", "none");
		eraseLines();
		
		currentIndex = index;
		
		var item = toc[currentIndex];
		$(".content").load(item.html, onLoaded);
		
		$("#big-title p").text(title);
		
		$("#big-title").hide();
		$(".content-holder").hide();
		$("#content-pane").scrollTop(0);
		
		setTimeout(function () {			
			$(".content-holder").show("drop", { direction: "right" });
			$("#big-title").css("display", "block");
			$("#big-title").addClass("animated rotateInDownLeft");
			
			if (!fromSearch && !shownHelp && watch_or_try == undefined) {
				showLeftMessage("#left-message-help", true);
				shownHelp = true;
			}			
			
			pushContentDownForTitle();
		}, 500);
		
		showCaptivateControls(false, watch_or_try == undefined);
	}
	
	function onLoaded () {
		$(".step").click(onClickStep);
	}
	
	function onClickStep (event) {
		var slide;
		
		var t = $(event.target);
		var subpart = getSubpart(t);
		var slide = getSlideFromSubpart(subpart);
		if (slide) {
			slide = slide - 1;
		} else {
			var thisStep = $(event.currentTarget);
			var number = thisStep.find(".number").text();
			slide = getSlideFromStepNumber(number);
			if (slide) {
				slide = slide - 1;
			}
		}
		
		$("iframe")[0].contentWindow.cpCmndGotoSlideAndResume = slide;
	}
	
	function getSlideFromStepNumber (num) {
		for (var i = 0; i < captivateMapping.length; i++) {
			if (captivateMapping[i].step == num) {
				return captivateMapping[i].slide;
			}
		}
		return undefined;
	}
	
	function getSubpart (el) {
		while (el && !el.hasClass("step")) {
			var id = el.attr("id");
			if (id) return id;
			el = el.parent();
		}
	}
	
	function getSlideFromSubpart (sub) {
		for (var i = 0; i < captivateMapping.length; i++) {
			if (captivateMapping[i].sub == "#" + sub) {
				return captivateMapping[i].slide;
			}
		}
		return undefined;
	}
	
	function onClickTOC () {
		table_of_contents.toggle();
	}
	
	function onShowChapter (event) {
		var li = $(event.target);
				
		card_manager.showCards( { chapter: li.index() } );
	}
	
	function showLesson (event, index, title, watch_or_try) {
		if (table_of_contents.showing)
			table_of_contents.toggle();
		
		loadContents(index % 2, title, watch_or_try);
		
		switch (watch_or_try) {
			case "watch":
				playWatchIt();
				break;
			case "try":
				playTryIt();
				break;
		}
	}
	
	function onSearchTOC (event) {
		table_of_contents.show();
		
		var term = $(event.currentTarget).val();
		
		table_of_contents.searchChapters(term);
		card_manager.searchCards(term);
	}
	
	function onKeyDown (event) {
		if (event.keyCode == 27) {
			table_of_contents.hide();
		}
	}
	
	function positionAds () {
		var ads = $(".ad");
		
		ads.clone().appendTo(".ad-bar");
		
		ads = $(".ad");
		
		var x = 0;
		
		for (var i = 0; i < ads.length; i++) {
			var ad = ads.eq(i);
			ad.css({ left: x, top: 8 });
			x += ad.outerWidth() + AD_SPACING;
		}	
	}
	
	function scrollToNextAd () {
		if (!inAd && !table_of_contents.showing && !$(".control-bar").is(":visible")) {
			var animate = true;
		
			var half_n = Math.floor($(".ad").length * .5);
		
			if (currentAd == undefined) {
				currentAd = half_n;
				animate = false;
			}
		
			var w = $(".ad-bar").parent().width();
		
			var desired_left = getMiddleOfCurrentAd();

			// if the edge of the last ad is about to come on-screen, jump us to its first occurrence
			var ads = $(".ad");
			var last_ad = ads.eq(ads.length - 1);
			var x = last_ad.position().left + desired_left;
			if (x < w) {
				currentAd -= half_n + 1;
			
				var jump_left = getMiddleOfCurrentAd();
				$(".ad-bar").css({ left: jump_left });
			
				currentAd++;
			
				desired_left = getMiddleOfCurrentAd();
			}				
		
			if (animate) {
				$(".ad-bar").animate({ left: desired_left }, AD_TRANSITION, "easeInOutCubic");
			} else {
				$(".ad-bar").css({ left: desired_left });
			}
		
			currentAd++;
		}
		
		setTimeout(scrollToNextAd, AD_DELAY);
	}
	
	function getMiddleOfCurrentAd () {
		var ad = $(".ad").eq(currentAd);
		
		var w = $(".ad-bar").parent().width();

		var middle_of_next_ad = ad.position().left + ad.width() * .5 + AD_SPACING;
		var middle_of_screen = w * .5;
		
		var desired_left = middle_of_screen - middle_of_next_ad;
		
		return desired_left;		
	}
	
	function onAdHoverIn () {
		inAd = true;
	}
	
	function onAdHoverOut () {
		inAd = false;
	}
	
	function onClickAd (event) {
		var title = $(event.currentTarget).text();
		showLesson(event, 0, title);
	}
	
	function onClickMessage (event) {
		$(event.currentTarget).removeClass("animated rollIn").addClass("animated zoomOutDown");
		eraseLines();
	}
});