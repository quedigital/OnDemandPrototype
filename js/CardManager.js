define(["Helpers"], function (Helpers) {
	var CARD_WIDTH = 200;
	var CARD_HEIGHT = 250;
	
	var NUM_CHAPTERS = 21;
	
	var cardCount = 0;
	
	function getColorForChapter (ch) {
		var step = Math.ceil(255 / NUM_CHAPTERS);

		var color = 255 - (ch * step);
		if (color < 0) color = 0;
		
		return c2 = "rgb(" + (255 - color) + ", 60, " + color + ")";
	}
	
	CardManager = function (container) {
		this.container = container;
		
		this.board = $("<div>").addClass("board").css("display", "none");

		this.message = $("<div>").addClass("message").text("No matching lessons found.").appendTo(this.board);
		
		this.container.append(this.board);
		
		var sections = {
			0: [
					["Starting OS X", ""],
					["Exploring the Finder and Desktop", ""],
					["Using the Mouse or Multi-Touch Gestures", ""],
					["Working with Menus, Toolbars, and Panes", ""],
					["Using Menus for Quick Results", ""],
					["Choosing Dialog Options", ""],
					["Working with Icons", ""],
					["Viewing Windows", ""],
					["Managing Windows", ""],
					["Using the Tab Bar", ""],
					["Using the Sidebar", ""],
				],
			1: [
					["Opening and Viewing Disks", ""],
					["Viewing and Opening Documents", ""],
					["Changing the Window View", ""],
					["Arranging Files and Folders in Icons View", ""],
					["Working with Files and Folders in List View", ""],
					["Viewing Files with Cover Flow View", ""],
					["Working with Files and Folders in Columns View", ""],
					["Viewing Files Using Quick Look", ""],
					["Going to Common or Recent Places", ""],
				],
			2: [
					["Finding Information Using Spotlight", ""],
					["Finding Information in the Spotlight Window", ""],
					["Filtering Spotlight Results", ""],
					["Grouping and Sorting Spotlight Results", ""],
					["Working with Spotlight Results", ""],
				],
			3: [
					["Understanding Finder Preferences", ""],
					["Showing Icons on the Desktop", ""],
					["Customizing the Way Windows Open", ""],
					["Showing or Hiding File Extensions", ""],
					["Customizing Finder Window Views", ""],
					["Customizing the Toolbar", ""],
					["Customizing the Sidebar", ""],
					["Customizing the Dock", ""],
					["Creating Aliases", ""],
					["Customizing Mission Control", ""],
					["Using Simple Finder", ""],
				],
			4: [
					["Understanding System Preferences", ""],
					["Adding or Removing Third-Party System Preferences", ""],
					["Viewing System Preferences", ""],
					["Locking and Unlocking Preference Settings", ""],
					["Changing Appearance Options", ""],
					["Setting Up the Desktop", ""],
					["Setting Up Screen Savers", ""],
					["Setting the Date and Time", ""],
					["Changing Language & Region Options", ""],
					["Changing Text Substitution Options", ""],
					["Saving Energy and Managing Power", ""],
					["Selecting a Startup Disk", ""],
				],
			5: [
					["Getting Apps at the App Store", ""],
					["Downloading and Installing Other Apps", ""],
					["Using OS X Apps", ""],
					["Launching Apps", ""],
					["Opening Apps and Files", ""],
					["Viewing Full Screen Apps", ""],
				],
			6: [
					["Using Toolbars", ""],
					["Displaying and Using the Dock", ""],
					["Displaying and Using Stacks on the Dock", ""],
				],
			7: [
					["Exposing Windows in Mission Control", ""],
					["Grouping Windows in Mission Control", ""],
					["Switching Users", ""],
					["Sleeping, Restarting, and Shutting Down", ""],
				],
			8: [
					["Organizing Files and Folders by Tags", ""],
					["Creating and Renaming Files and Folders", ""],
					["Copying and Moving Files and Folders", ""],
				],
			9: [
					["Using Spring-Loaded Folders", ""],
					["Sharing Files Using Online Services", ""],
					["Deleting and Restoring Files and Folders", ""],
				],
			10: [
					["Getting and Setting File Information", ""],
					["Creating a CD or DVD Using the Finder", ""],
					["Mounting and Ejecting Disks", ""],
				],
			11: [
					["Setting Spotlight Preferences", ""],
					["Searching for Files Using the Find Window", ""],
				],
			12: [
					["Searching for Hard to Find Information", ""],
					["Working with Find Window Results", ""],
				],
			13: [
					["Creating and Using Smart Folders", ""],
					["Getting Help While You Work", ""],
				],
			14: [
					["Getting Help Using Spotlight", ""],
				],
			15: [
					["Changing the Way a CD or DVD Starts", ""],
					["Controlling Sound", ""],
					["Dictating Your Speech", ""],
				],
			16: [
					["Letting Mac Do the Talking", ""],
					["Setting Accessibility Options", ""],
				],
			17: [
					["Setting Accessibility Interacting Options", ""],
					["Having VoiceOver Read from the Screen", ""],
				],
			18: [
					["Getting Started with VoiceOver", ""],
					["Working with VoiceOver", ""],
				],
			19: [
					["Setting VoiceOver Preferences", ""],
				],
			20: [
					["Using VoiceOver Commands", ""],
				],
			21: [
					["Setting Ink Preferences", ""],
				],
		};
		
		this.cards = [];

		for (var ch in sections) {
			var chapter = sections[ch];
			for (var j = 0; j < chapter.length; j++) {
				var color = getColorForChapter(ch);
				var copy = chapter[j][1] == "" ? "Lorem ipsum dolorum est pablum. Lorem ipsum dolorum est pablum. Lorem ipsum dolorum est pablum." : chapter[j][1];
				
				var c = this.addNewCard(ch, j, chapter[j][0], copy, color);
				
				this.cards.push(c);
			}
		}
	}

	CardManager.prototype = Object.create(null);
	CardManager.prototype.constructor = CardManager;
	
	CardManager.prototype.getElement = function () {
		return this.board;
	}
	
	CardManager.prototype.addNewCard = function (chapter, index, title, copy, color) {
		var card = $("<div>").addClass("card");
		card.chapter = chapter;
		card.title = title;
		card.data( { "card-color": color, "card-highlightColor": Helpers.lighterColor(color, .2) } );
		
		if ((cardCount + 2) % 5 == 0 || (cardCount + 5) % 8 == 0) {
			$("<div>").addClass("new-indicator").text("New!").appendTo(card);
		}
		cardCount++;
		
		$("<h1>").text(title).appendTo(card);
		var pholder = $("<div>").addClass("pholder").appendTo(card);
		var p = $("<p>").text(copy).appendTo(pholder);
		
		var buttons = $("<div>").addClass("buttons");
		
		var watch = $("<div>").addClass("button watchit").appendTo(buttons);
		$("<div>").addClass("text").text("Watch It").appendTo(watch);
		$("<div>").addClass("icon fa fa-eye").appendTo(watch);
		
		var tryit = $("<div>").addClass("button tryit").appendTo(buttons);
		$("<div>").addClass("text").text("Try It").appendTo(tryit);
		$("<div>").addClass("icon fa fa-hand-o-left").appendTo(tryit);
		
		buttons.appendTo(card);

		card.hover(	function () {
						$(this).css("z-index", 100);
						$(this).addClass("animated pulse");
						$(this).find("h1").css("background-color", $(this).data("card-highlightColor"));
						var me = this;
						this.expander = setTimeout(function () {
								$(me).find(".pholder").height($(me).find("p").outerHeight());
							}, 1000);						
					},
					function () {
						$(this).css("z-index", "auto");
						$(this).removeClass("animated pulse");
						$(this).find("h1").css("background-color", $(this).data("card-color"));
						var h = $(this).find("h1").outerHeight() + $(this).find(".buttons").outerHeight();
						$(this).find(".pholder").height(CARD_HEIGHT - h);
						clearTimeout(this.expander);
					});
		
		card.click(function (event) { $(event.currentTarget).trigger( "showLesson", [index, title] ); });
		watch.click(function (event) { $(event.currentTarget).trigger( "showLesson", [index, title, "watch"] ); event.stopPropagation(); });
		tryit.click(function (event) { $(event.currentTarget).trigger( "showLesson", [index, title, "try"] ); event.stopPropagation(); });
		
		card.appendTo(this.board);
		
		card.css("display", "none");
		
		return card;
	}
	
	CardManager.prototype.setWidth = function (w) {
		this.reservedWidth = w;
	}
	
	CardManager.prototype.layoutCards = function (options) {
		this.board.css("left", this.reservedWidth);
		
		var w = this.container.width() - this.reservedWidth;
		
		var n = Math.floor(w / (CARD_WIDTH + 10) );
		
		var t = 0;
		if (options.chapter != undefined) {
			for (var i = 0; i < this.cards.length; i++) {
				if (this.cards[i].chapter == options.chapter) t++;
			}
		} else if (options.indices) {
			t = options.indices.length;
		}
		
		var spacing_x = CARD_WIDTH + Math.floor((w - (n * CARD_WIDTH)) / n);
		
		var rows = Math.ceil(t / n);
		var leftover_height = this.container.height() - CARD_HEIGHT * rows;
		var spacing_y = CARD_HEIGHT + Math.floor(leftover_height / rows);
		
		var lastChapter = undefined;
		var ii = 0;
		
		for (var i = 0; i < this.cards.length; i++) {
			var c = this.cards[i];
			if ( (options.chapter != undefined && c.chapter == options.chapter) || (options.indices && options.indices.indexOf(i) != -1) ) {
				var x = (spacing_x - CARD_WIDTH) * .5 + (ii % n) * spacing_x;
				var y = (spacing_y - CARD_HEIGHT) * .5 + Math.floor(ii / n) * spacing_y;
				c.data( { homeX: x, homeY: y } );
				var p = c.find("p");
				var b = c.find(".buttons");
				var pholder = c.find(".pholder");
				var h1 = c.find("h1");
				
				var obj = { p: p, b: b, h: h1, pholder: pholder };
				
				setTimeout($.proxy(sizeCopy, this, obj), 0);
				
				ii++;
			}
		}
	}
	
	function sizeCopy (obj) {
		var h = obj.b.outerHeight() + obj.h.outerHeight();
		obj.pholder.height(CARD_HEIGHT - h);
	}
	
	CardManager.prototype.showCards = function (options) {
		var initialDelay = 0;
		
		for (var i = 0; i < this.cards.length; i++) {
			if (this.cards[i].showing) {
				initialDelay += 30;
			}
		}
		
		this.hideCards(options);
		
		this.layoutCards(options);
		
		var w = this.container.width();
		
		this.board.find(".card").removeClass("animated swing");
		
		var n = 0;
		for (var i = 0; i < this.cards.length; i++) {
			var c = this.cards[i];
			if ( (options.chapter != undefined && c.chapter == options.chapter) || (options.indices && options.indices.indexOf(i) != -1) ) {
				if (!c.showing) {
					c.css("display", "block");
					
					var h1 = c.find("h1");
					h1.css("backgroundColor", c.data("card-color"));
					c.css( { left: w, top: c.data("homeY"), transform: "rotate(-30deg)" } );
			
					c.delay(initialDelay + n * 50).animate( { left: c.data("homeX") }, { duration: 500, done: $.proxy(this.onCardsAppear, this) } );
				
					n++;
				
					c.showing = true;
				} else {
					c.animate( { left: c.data("homeX"), top: c.data("homeY") }, { duration: 500 } );
					this.onCardsAppear( { elem: c } );
				}
			}
		}
		
		this.board.css("display", "block");
	}
	
	CardManager.prototype.onCardsAppear = function (promise) {
		$(promise.elem).addClass("animated swing");
		$(promise.elem).one("webkitAnimationEnd animationend", function () { $(this).removeClass("animated swing").css("transform", "none"); });
	}
	
	CardManager.prototype.hideCards = function (options) {
		var w = this.container.width();
		
		var n = 0;
		
		for (var i = 0; i < this.cards.length; i++) {
			var c = this.cards[i];
			if (c.showing) {
				if ( (options.chapter != undefined && c.chapter != options.chapter) || (options.indices && options.indices.indexOf(i) == -1) ) {
					c[0].rotation = 0;
					c.delay(n * 50).animate( { rotation: 30 }, { step: function (now, fx) { $(this).css("transform", "rotate(" + now + "deg)"); }, duration: 200 } )
								.animate( { left: w }, { duration: 250, done: $.proxy(this.onCardsDisappear, this) } );
					c.showing = false;
					n++;
				}
			}
		}
		
//		setTimeout($.proxy(this.onCardsDisappear, this), n * 50 + 200 + 250);
	}

	CardManager.prototype.onCardsDisappear = function (promise) {
		$(promise.elem).css("display", "none");
	}
	
	CardManager.prototype.searchCards = function (term) {
		var ar = [];
		
		term = term.toLowerCase();
		
		for (var i = 0; i < this.cards.length; i++) {
			var c = this.cards[i];
			if (c.title.toLowerCase().indexOf(term) != -1) {
				ar.push(i);
			}
		}
		
		if (ar.length == 0) $(".board .message").show("blind");
		else $(".board .message").hide("blind");
		
		if (ar.length < 20) {
			this.showCards({ indices: ar });
		}
	}
	
	return CardManager;
});
