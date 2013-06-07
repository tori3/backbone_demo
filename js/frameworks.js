/**
 * Model
 */
var frameworkModel = Backbone.Model.extend({

	default: function() {
		return {
			"name": "",
			"logo": "",
			"star": 0,
			"fork": 0
		};
	}

});

/**
 * Collection
 */
var frameworkCollection = Backbone.Collection.extend({

	model: frameworkModel,
	url: './data/frameworks.json',

	sortKey: "star",
	order: -1,

	comparator: function(model) {
		return parseInt(model.get(this.sortKey),10) * this.order;
	},

	changeOrder: function() {
		this.order = this.order * -1;
	}

});

/**
 * View
 */
var frameworkView = Backbone.View.extend({

	tagName: "tr",

	events: {
		"keydown .inputName": "changeName"
	},

	initialize: function() {
		this.tmpl = _.template($("#frameworkTmpl").text());
	},

	render: function() {
		this.$el.html(this.tmpl(this.model.toJSON()));
		return this;
	},

	changeName: function(e) {
		this.model.set("name", e.currentTarget.value);
	}

});

/**
 * List View 
 */
var frameworkListView = Backbone.View.extend({

	el: "#frameworkList",

	initialize: function() {
		// event listener
		this.listenTo(this.model, "sync", $.proxy(this.sync,this));
		this.listenTo(this.model, "sort", $.proxy(this.sort,this));
	},

	sort: function() {
		this.$el.empty();
		this.renderList();
	},

	sync: function() {
		this.renderList();
	},

	renderList: function() {
		var self = this,
			fragment = document.createDocumentFragment();

		this.model.each(function(m) {
			fragment.appendChild(new frameworkView({model: m}).render().el);
		});
		this.$el.append(fragment);
	}

});


/**
 * Graph View 
 */
var Graph = Backbone.View.extend({

	el: "#grach",

	initialize: function() {
		// event listener
		this.listenTo(this.model, "reset", $.proxy(this.reset,this));
		this.listenTo(this.model, "change", $.proxy(this.change,this));
		this.throttleReset = _.throttle($.proxy(this.reset,this), 200);
	},

	reset: function() {

		var legend = [],
			value = [];

		this.model.each(function(m) {
			legend.push(m.get("name"));
			value.push(m.get("star"));
		});

		// gRaphael.js
		this.r = Raphael("graph");
		this.pie = this.r.piechart(200, 180, 100, value,
		{
			legend: legend,
			legendpos: "west"
		});
        this.pie.hover(function () {
            this.sector.stop();
            this.sector.scale(1.1, 1.1, this.cx, this.cy);

            if (this.label) {
                this.label[0].stop();
                this.label[0].attr({ r: 7.5 });
                this.label[1].attr({ "font-weight": 800 });
            }
        }, function () {
            this.sector.animate({ transform: 's1 1 ' + this.cx + ' ' + this.cy }, 500, "bounce");

            if (this.label) {
                this.label[0].animate({ r: 5 }, 500, "bounce");
                this.label[1].attr({ "font-weight": 400 });
            }
        });
	},

	change: function(e) {
		this.throttleReset();
	}

});


/**
 * Controler 
 */
var ControllerView = Backbone.View.extend({

	el: "#container",

	events: {
		"click .sortBy" : "sortBy",
		"click .switchGraph" : "switchGraph"
	},

	initialize: function() {

		this.collection = new frameworkCollection();

		// graph view
		var graph = new Graph({
			model: this.collection
		});

		// list view
		var frameworkList = new frameworkListView({
			model: this.collection
		});

		// fetch database
		this.collection.fetch({reset: true});
	},

	sortBy: function(e) {
		this.collection.changeOrder();
		this.collection.sort();
	}

});

/** 
var router = new Backbone.Router.extend({

});

 */


