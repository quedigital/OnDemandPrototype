define([], function () {

	TOC = function (container) {
		this.container = container;
		
		this.showing = false;
		this.tocWidth = undefined;
		
		this.toc = $("<div>").addClass("toc");
		
		this.bg = $("<div>").addClass("bg animated").appendTo(this.toc);
		
		var w = this.container.width();
		
		this.bg.css("transform", "translate3d(" + (-w) + "px, 0, 0)");
		
		this.items = $("<div>").attr("id", "items").appendTo(this.toc);
		
		this.message = $("<div>").addClass("message").text("No matching chapters found.").appendTo(this.toc);
		
		this.container.append(this.toc);
		
		var me = this;
		
		this.items.load("toc.html", function () {
			var chapters = me.items.find("li");
			
			chapters.hover(
				function() { $(this).addClass("hover").css("background", $(this).data("solidColor")); },
				function() {
					$(this).removeClass("hover");
					if (!$(this).hasClass("selected")) {
						$(this).css("background", $(this).data("gradientColor"));
					}
				}
			);
			
			chapters.click($.proxy(me.onClickChapter, me));
			
			me.setBackgroundColors();
		});
		
		$(window).resize($.proxy(this.onResizeWindow, this));
	}
	
	TOC.prototype = Object.create(null);
	TOC.prototype.constructor = TOC;
	
	TOC.prototype.getElement = function () {
		return this.toc;
	}

	TOC.prototype.getBackground = function () {
		return this.bg;
	}

	TOC.prototype.onResizeWindow = function () {
		if (!this.showing) {
			this.bg.removeClass("animated");
			
			var w = this.container.width();
		
			this.bg.css("transform", "translate3d(" + (-w) + "px, 0, 0)");
			
			// wait a second to add the class back in (so it doesn't transition)
			// TODO: is this the accepted way of working around this?
			var me = this;
			setTimeout(function () { me.bg.addClass("animated"); }, 0);
		}
	}
	
	TOC.prototype.show = function () {
		if (!this.showing) {
			this.sizeToFitHeight();
			this.sizeToFitMaxWidth();
		
			this.toc.css( { opacity: 1, "pointer-events": "auto" } );
			this.bg.css("transform", "translate3d(0, 0, 0)");
		
			this.showChapters();
		
			this.showing = true;
			
			this.hideMessage();
		}
	}
	
	TOC.prototype.hide = function () {
		if (this.showing) {
			this.toc.css( { "pointer-events": "none" } );
		
			var w = this.container.width();
	
			this.bg.css("transform", "translate3d(" + (-w) + "px, 0, 0)");
		
			this.hideChapters();
		
			this.showing = false;
		}
	}
	
	TOC.prototype.toggle = function () {		
		if (this.showing) this.hide();
		else this.show();
	}
	
	TOC.prototype.setBackgroundColors = function () {
		var chapters = this.items.find("li");
		
		var color = 255;
		var step = Math.ceil(255 / chapters.length);

		$.each(chapters, function (index, ch) {
			var c1 = "white";
			var c2 = "rgb(" + (255 - color) + ", 60, " + color + ")";
			var gradient = "linear-gradient(to bottom, " + c1 + " 30%, " + c2 + " 100%)";
			$(ch).css("background", gradient);
			$(ch).data("gradientColor", gradient);
			$(ch).data("solidColor", c2);
			color -= step;
			if (color < 0) color = 0;
		});
	}
	
	TOC.prototype.sizeToFitHeight = function () {
		var h = this.container.height() - 44;

		var chapters = this.items.find("li");
				
		var lineheight = Math.floor(h / chapters.length);
		
		chapters.css( { "line-height": lineheight + "px", height: lineheight + "px" } );
		this.items.css("font-size", (lineheight * .6) + "px");
		
		this.lineheight = lineheight;
	}
	
	TOC.prototype.sizeToFitMaxWidth = function () {
		var chapters = this.items.find("li");
		
		chapters.css({ display: "block", opacity: 0 });
		
		var max_width = undefined;
		
		$.each(chapters, function (index, ch) {
			var w = $(ch).find("span").outerWidth();
			if (w > max_width || max_width == undefined) {
				max_width = w;
			}			
		});
		
		this.items.width(max_width + 2);
		chapters.width(max_width + 2);
		
		this.tocWidth = max_width + 2;
		
		this.toc.trigger("sized");
	}
	
	TOC.prototype.getTOCWidth = function () {
		return this.tocWidth;
	}
	
	TOC.prototype.showChapters = function () {
		var chapters = this.items.find("li");
		
		$.each(chapters, function (index, ch) {
			$(ch).hide().css("opacity", 1).delay((index + 1) * 75).show("slide", 500);
		});
	}
	
	TOC.prototype.hideChapters = function () {
		var chapters = this.items.find("li");
		
		chapters.delay(200).hide("slide", 250);		
	}
	
	TOC.prototype.setAllToGradient = function () {
		var chapters = this.items.find("li");
		
		$.each(chapters, function (index, item) {
			if (!$(this).hasClass("selected")) {
				$(this).css("background", $(this).data("gradientColor"));
			}
		});
	}
	
	TOC.prototype.onClickChapter = function (event) {		
		this.container.find(".selected").removeClass("selected");
		$(event.currentTarget).addClass("selected");
		
		this.setAllToGradient();
		
		$(event.currentTarget).trigger("selected");
	}
	
	TOC.prototype.hideMessage = function () {
		this.message.css("display", "none");
	}
	
	TOC.prototype.searchChapters = function (term) {
		var chapters = this.items.find("li");
		
		var found = 0;
		
		for (var i = 0; i < chapters.length; i++) {
			var ch = $(chapters[i]);
			var t = ch.text().toLowerCase();
			if (t.indexOf(term.toLowerCase()) != -1) {
				ch.css("height", this.lineheight + "px");
				found++;
			} else {
				ch.css("height", "0");
			}			
		}
		
		this.message.css("display", found ? "none" : "block");
	}
	
	return TOC;
});