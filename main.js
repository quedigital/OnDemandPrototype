requirejs.config({
	baseUrl: "js",
	paths: {
		"jquery": "jquery-1.11.0.min",
		"jqueryui": "jquery-ui-1.11.1.custom.min",
	},
	
	shim: {
			"jqueryui": {
				export: "$",
				deps: ['jquery']
			},
			"notify.min": {
				export: "$",
				deps: ['jquery']
			}
		}
});

require(["jquery", "vex.dialog.min", "jqueryui", "jquery.layout-latest", "notify.min", "TOC", "CardManager"], function ($, dialog) {
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
		
	var currentIndex = 1;
	var currentType = "";
	
//	loadContents();	
	
	var table_of_contents = new TOC($("body"));
	
	var card_manager = new CardManager(table_of_contents.getBackground());
	table_of_contents.getElement().bind("sized", function () { card_manager.setWidth(table_of_contents.getTOCWidth()); });
	card_manager.getElement().bind("showLesson", showLesson);
	
	var cp, cp_events;
	var captivateMapping = [];
	
	var started = false;	
	
	var frame = $("iframe");
	
	$(document).tooltip();
	
	$(window).resize(onWindowResize);
	
	$("#watchit").click(playWatchIt);
	$("#tryit").click(playTryIt);
	
	$("#back").click(onPreviousCaptivate);
	$("#pause").click(onPauseCaptivate);
	$("#stop").click(onStopCaptivate);
	$("#next").click(onNextCaptivate);
	
	$("#toc-button").click(onClickTOC);
	
	$("#toc-searchtext").on("input", onSearchTOC);
	
	$(table_of_contents.getElement()).bind("selected", onShowChapter);
	
	$(window).keydown(onKeyDown);
	
//	showHint("watch or try buttons");
	
	function checkForCaptivate () {
		if (window.frames[0].cpAPIInterface) {
			cp = window.frames[0].cpAPIInterface;
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
	}
	
	function pushContentDownForTitle () {
		var h = $("#big-title").outerHeight() - $(".content").offset().top - $("#content-pane").scrollTop();
		
		$(".content").css("padding-top", h);
	}
	
	function onSlideEntered (event) {
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
		
		showCaptivateControls(false);
	}
	
	function showCaptivateControls (show) {
		if (show) {
			$("#watch-or-try-holder").hide("highlight");
			$(".control-bar").show("blind");
			$("#bottom-bar").hide("blind");
		} else {
			$("#watch-or-try-holder").removeClass("animated");
			$("#watch-or-try-holder").css("display", "none");
			
			$("#watchit-check").prop("checked",  toc[currentIndex]["watch"].completed);
			$("#tryit-check").prop("checked",  toc[currentIndex]["try"].completed);
			
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
			
			$(".control-bar").hide("blind");
			$("#bottom-bar").show("blind");
		}
	}
	
	window.showCaptivateControls = showCaptivateControls;
	
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
		
		showCaptivateControls(false);
	}
	
	function onNextCaptivate () {
		cp.next();
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
	
	function loadContents (index, title) {
		currentIndex = index;
		
		var item = toc[currentIndex];
		$(".content").load(item.html);
		
		$("#big-title p").text(title);
		
		$("#big-title").hide();
		$(".content-holder").hide();
		$("#content-pane").scrollTop(0);
		
		setTimeout(function () {
			$(".content-holder").show("drop", { direction: "right" });
			$("#big-title").css("display", "block");
			$("#big-title").addClass("animated rotateInDownLeft");
		}, 500);
		
		showCaptivateControls(false);

		pushContentDownForTitle();
	}
	
	function onClickTOC () {
		table_of_contents.toggle();
	}
	
	function onShowChapter (event) {
		var li = $(event.target);
				
		card_manager.showCards( { chapter: li.index() } );
	}
	
	function showLesson (event, index, title, watch_or_try) {
		table_of_contents.toggle();
		
		loadContents(index % 2, title);
		
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
});