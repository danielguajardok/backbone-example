// Setup

var App = {
	Models: {},
	Collections: {},
	Views: {},
	Instances: {},
	Variables: {},
}

// // Models

App.Models.Client = Backbone.Model.extend({
	defaults: {
		nombre: '',
		rut: '',
		estado: 1
	}
});

// // Collections

App.Collections.Clients = Backbone.Collection.extend({
	model: App.Models.Client,
	url: 'http://demo.apidone.com/clientes'
});

// // Views

App.Views.ClientsList = Backbone.View.extend({
	el: '.clients-list',

	// events: {
	// 	"click .add-client": "addClient"
	// },

	initialize: function() {
		$(this.el).html("");
		this.collection = new App.Collections.Clients();
		this.collection.bind('reset',this.render,this);
		this.collection.bind('add',this.render,this);
		this.collection.fetch();
	},

	render: function() {
		$(this.el).html("");
		var self = this;
		self.collection.each(function(model){
			self.addOne(model);
		});
	},

	addOne: function(model) {
		var view = new App.Views.ClientsListItem({model: model});
		$(this.el).append(view.render().el);
	},

	// addClient: function() {
	// 	console.log("hola");
	// }
});

App.Views.ClientsListItem = Backbone.View.extend({
	tagName: 'li',
	template: _.template($('#tpl-client-list-item').html()),
	events: {
		"click": "selectClient"
	},
	initialize: function(){
		this.model.bind("change",this.render,this);
	},
	render: function() {
		$(this.el).html(this.template(this.model.toJSON()));
		return this;
	},
	selectClient: function(e) {
		$('.clients-list li').removeClass('selected');
		$(e.target).addClass('selected');
		new App.Views.ClientDetails({model: this.model});
	}
});

App.Views.ClientDetails = Backbone.View.extend({
	tagName: 'div',
	template: _.template($('#tpl-client-details').html()),
	initialize: function(){
		this.render();
	},
	render: function() {
		$(this.el).append(this.template(this.model.toJSON()));
		console.log(this.el);
		$('#clients-container .main').html(this.el);
	}
});

App.Views.NewClientView = Backbone.View.extend({
	el: '#nuevo-cliente-container',
	events: {
		"click .add-client": "addClient"
	},
	initialize: function(){
			
	},
	render: function() {
		
	},
	addClient: function() {
		App.Instances.ClientsListView.collection.create({
			nombre: $('#new-client-name').val(),
			rut: $('#new-client-rut').val()
		})
		$('.pane').hide();
        $('#clients-container').show();
        $('.nav li').removeClass('active');
        $('.nav li.clientes').addClass('active');
	}
});

// Router
App.Router = Backbone.Router.extend({

    routes: {
        "": "clientes",
        "facturacion": "facturacion",
        "clientes": "clientes",
        "nuevo-cliente":"nuevoCliente"
    },

    initialize: function () {
        this.clientes();
    },

    clientes: function () {
        $('.pane').hide();
        $('#clients-container').show();
        $('.nav li').removeClass('active');
        $('.nav li.clientes').addClass('active');
        if (!App.Instances.ClientsListView) {
        	App.Instances.ClientsListView = new App.Views.ClientsList();
        } else {
        	App.Instances.ClientsListView.collection.fetch();
        }
    },

    facturacion: function() {
		$('.pane').hide();
		$('#facturacion-container').show();
		$('.nav li').removeClass('active');
        $('.nav li.facturacion').addClass('active');		
    },

    nuevoCliente: function() {
		$('.pane').hide();
		$('#nuevo-cliente-container').show();
		$('.nav li').removeClass('active');
        $('.nav li.nuevo-cliente').addClass('active');    	
		if (!App.Instances.NewClientView) {
        	App.Instances.NewClientView = new App.Views.NewClientView();
        } else {
        	App.Instances.NewClientView.render();
        }        
    }
});

$(function(){
	var router = new App.Router();
	Backbone.history.start();
})