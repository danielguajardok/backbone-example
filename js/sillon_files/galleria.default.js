﻿Galleria.requires(1.25,"This version of Default theme requires Galleria 1.2.5 or later");(function(a){Galleria.addTheme({name:"default",author:"Galleria",css:"galleria.default.css",defaults:{transition:"slide",thumbCrop:"height",_toggleInfo:true},init:function(d){this.addElement("info-link","info-close");this.append({"info":["info-link","info-close"]});var c=this.$("info-link,info-close,info-text"),e=Galleria.TOUCH,b=e?"touchstart":"click";this.$("loader,counter").show().css("opacity",1);if(!e){this.addIdleState(this.get("image-nav-left"),{left:-50});this.addIdleState(this.get("image-nav-right"),{right:-50});this.addIdleState(this.get("counter"),{opacity:0})}if(d._toggleInfo===true){c.bind(b,function(){c.toggle()})}else{c.show();this.$("info-link, info-close").hide()}this.bind("thumbnail",function(f){if(!e){a(f.thumbTarget).css("opacity",0.6).parent().hover(function(){a(this).not(".active").children().stop().fadeTo(100,1)},function(){a(this).not(".active").children().stop().fadeTo(400,0.6)});if(f.index===this.getIndex()){a(f.thumbTarget).css("opacity",1)}}else{a(f.thumbTarget).css("opacity",this.getIndex()?1:0.6)}});this.bind("loadstart",function(f){if(!f.cached){this.$("loader").show().fadeTo(200,0.4)}this.$("info").toggle(this.hasInfo());a(f.thumbTarget).css("opacity",1).parent().siblings().children().css("opacity",0.6)});this.bind("loadfinish",function(f){this.$("loader").fadeOut(200)})}})}(jQuery));