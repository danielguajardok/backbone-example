var App = {
	Models: {},
	Collections: {},
	Views: {},
	Instances: {},
	Variables: {},
}

App.Models.Client = Backbone.Model.extend({

});

App.Collections.Clients = Backbone.Collection.extend({
	url: 'http://demo.apidone.com/clientes',
	model: App.Models.Client
});

App.Views.Clients = Backbone.View.extend({
	el: '.sidebar',
	initialize: function(){
		this.collection.on("reset", this.render, this);
	},
	render: function(){
		var self = this;
		this.collection.each(function(obj){
			var client = new App.Views.Client({model: obj});
			$('ul',self.el).append(client.render().el);
		});
	}
});

App.Views.Client = Backbone.View.extend({
	tagName: 'li',
	render: function(){
		$(this.el).html(this.model.get('nombre'));
		return this
	},
	events: {
		"click": "displayCliente"
	},
	displayCliente: function(){
		$('.main').html(this.model.get('nombre'));
	}
});


App.Instances.clientsCollection = new App.Collections.Clients();
App.Instances.clientsView = new App.Views.Clients({collection: App.Instances.clientsCollection});
App.Instances.clientsCollection.fetch({reset: true});

