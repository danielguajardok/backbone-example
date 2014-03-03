﻿(function(a){a.extend(a.fn,{validate:function(c){if(!this.length){c&&c.debug&&window.console&&console.warn("nothing selected, can't validate, returning nothing");return}var b=a.data(this[0],"validator");if(b){return b}b=new a.validator(c,this[0]);a.data(this[0],"validator",b);if(b.settings.onsubmit){this.find("input, button").filter(".cancel").click(function(){b.cancelSubmit=true});if(b.settings.submitHandler){this.find("input, button").filter(":submit").click(function(){b.submitButton=this})}this.submit(function(d){if(b.settings.debug){d.preventDefault()}function e(){if(b.settings.submitHandler){if(b.submitButton){var f=a("<input type='hidden'/>").attr("name",b.submitButton.name).val(b.submitButton.value).appendTo(b.currentForm)}b.settings.submitHandler.call(b,b.currentForm);if(b.submitButton){f.remove()}return false}return true}if(b.cancelSubmit){b.cancelSubmit=false;return e()}if(b.form()){if(b.pendingRequest){b.formSubmitted=true;return false}return e()}else{b.focusInvalid();return false}})}return b},valid:function(){if(a(this[0]).is("form")){return this.validate().form()}else{var b=true;var c=a(this[0].form).validate();this.each(function(){b&=c.element(this)});return b}},removeAttrs:function(d){var c={},b=this;a.each(d.split(/\s/),function(f,e){c[e]=b.attr(e);b.removeAttr(e)});return c},rules:function(e,g){var c=this[0];if(e){var j=a.data(c.form,"validator").settings;var h=j.rules;var f=a.validator.staticRules(c);switch(e){case"add":a.extend(f,a.validator.normalizeRule(g));h[c.name]=f;if(g.messages){j.messages[c.name]=a.extend(j.messages[c.name],g.messages)}break;case"remove":if(!g){delete h[c.name];return f}var b={};a.each(g.split(/\s/),function(l,k){b[k]=f[k];delete f[k]});return b}}var d=a.validator.normalizeRules(a.extend({},a.validator.metadataRules(c),a.validator.classRules(c),a.validator.attributeRules(c),a.validator.staticRules(c)),c);if(d.required){var i=d.required;delete d.required;d=a.extend({required:i},d)}return d}});a.extend(a.expr[":"],{blank:function(b){return !a.trim(""+b.value)},filled:function(b){return !!a.trim(""+b.value)},unchecked:function(b){return !b.checked}});a.validator=function(c,b){this.settings=a.extend({},a.validator.defaults,c);this.currentForm=b;this.init()};a.validator.format=function(c,b){if(arguments.length==1){return function(){var d=a.makeArray(arguments);d.unshift(c);return a.validator.format.apply(this,d)}}if(arguments.length>2&&b.constructor!=Array){b=a.makeArray(arguments).slice(1)}if(b.constructor!=Array){b=[b]}a.each(b,function(e,d){c=c.replace(new RegExp("\\{"+e+"\\}","g"),d)});return c};a.extend(a.validator,{defaults:{messages:{},groups:{},rules:{},errorClass:"error",validClass:"valid",errorElement:"label",focusInvalid:true,errorContainer:a([]),errorLabelContainer:a([]),onsubmit:true,ignore:[],ignoreTitle:false,onfocusin:function(b){this.lastActive=b;if(this.settings.focusCleanup&&!this.blockFocusCleanup){this.settings.unhighlight&&this.settings.unhighlight.call(this,b,this.settings.errorClass,this.settings.validClass);this.errorsFor(b).hide()}},onfocusout:function(b){if(!this.checkable(b)&&(b.name in this.submitted||!this.optional(b))){this.element(b)}},onkeyup:function(b){if(b.name in this.submitted||b==this.lastElement){this.element(b)}},onclick:function(b){if(b.name in this.submitted){this.element(b)}else{if(b.parentNode.name in this.submitted){this.element(b.parentNode)}}},highlight:function(c,d,b){a(c).addClass(d).removeClass(b)},unhighlight:function(c,d,b){a(c).removeClass(d).addClass(b)}},setDefaults:function(b){a.extend(a.validator.defaults,b)},messages:{required:"This field is required.",remote:"Please fix this field.",email:"Please enter a valid email address.",url:"Please enter a valid URL.",date:"Please enter a valid date.",dateISO:"Please enter a valid date (ISO).",number:"Please enter a valid number.",digits:"Please enter only digits.",creditcard:"Please enter a valid credit card number.",equalTo:"Please enter the same value again.",accept:"Please enter a value with a valid extension.",maxlength:a.validator.format("Please enter no more than {0} characters."),minlength:a.validator.format("Please enter at least {0} characters."),rangelength:a.validator.format("Please enter a value between {0} and {1} characters long."),range:a.validator.format("Please enter a value between {0} and {1}."),max:a.validator.format("Please enter a value less than or equal to {0}."),min:a.validator.format("Please enter a value greater than or equal to {0}.")},autoCreateRanges:false,prototype:{init:function(){this.labelContainer=a(this.settings.errorLabelContainer);this.errorContext=this.labelContainer.length&&this.labelContainer||a(this.currentForm);this.containers=a(this.settings.errorContainer).add(this.settings.errorLabelContainer);this.submitted={};this.valueCache={};this.pendingRequest=0;this.pending={};this.invalid={};this.reset();var b=(this.groups={});a.each(this.settings.groups,function(f,e){a.each(e.split(/\s/),function(h,g){b[g]=f})});var d=this.settings.rules;a.each(d,function(f,e){d[f]=a.validator.normalizeRule(e)});function c(e){var f=a.data(this[0].form,"validator");f.settings["on"+e.type]&&f.settings["on"+e.type].call(f,this[0])}a(this.currentForm).delegate("focusin focusout keyup",":text, :password, :file, select, textarea",c).delegate("click",":radio, :checkbox, select, option",c);if(this.settings.invalidHandler){a(this.currentForm).bind("invalid-form.validate",this.settings.invalidHandler)}},form:function(){this.checkForm();a.extend(this.submitted,this.errorMap);this.invalid=a.extend({},this.errorMap);if(!this.valid()){a(this.currentForm).triggerHandler("invalid-form",[this])}this.showErrors();return this.valid()},checkForm:function(){this.prepareForm();for(var c=0,b=(this.currentElements=this.elements());b[c];c++){this.check(b[c])}return this.valid()},element:function(c){c=this.clean(c);this.lastElement=c;this.prepareElement(c);this.currentElements=a(c);var b=this.check(c);if(b){delete this.invalid[c.name]}else{this.invalid[c.name]=true}if(!this.numberOfInvalids()){this.toHide=this.toHide.add(this.containers)}this.showErrors();return b},showErrors:function(c){if(c){a.extend(this.errorMap,c);this.errorList=[];for(var b in c){this.errorList.push({message:c[b],element:this.findByName(b)[0]})}this.successList=a.grep(this.successList,function(d){return !(d.name in c)})}this.settings.showErrors?this.settings.showErrors.call(this,this.errorMap,this.errorList):this.defaultShowErrors()},resetForm:function(){if(a.fn.resetForm){a(this.currentForm).resetForm()}this.submitted={};this.prepareForm();this.hideErrors();this.elements().removeClass(this.settings.errorClass)},numberOfInvalids:function(){return this.objectLength(this.invalid)},objectLength:function(d){var b=0;for(var c in d){b++}return b},hideErrors:function(){this.addWrapper(this.toHide).hide()},valid:function(){return this.size()==0},size:function(){return this.errorList.length},focusInvalid:function(){if(this.settings.focusInvalid){try{a(this.findLastActive()||this.errorList.length&&this.errorList[0].element||[]).filter(":visible").focus()}catch(b){}}},findLastActive:function(){var b=this.lastActive;return b&&a.grep(this.errorList,function(c){return c.element.name==b.name}).length==1&&b},elements:function(){var c=this,b={};return a([]).add(this.currentForm.elements).filter(":input").not(":submit, :reset, :image, [disabled]").not(this.settings.ignore).filter(function(){!this.name&&c.settings.debug&&window.console&&console.error("%o has no name assigned",this);if(this.name in b||!c.objectLength(a(this).rules())){return false}b[this.name]=true;return true})},clean:function(b){return a(b)[0]},errors:function(){return a(this.settings.errorElement+"."+this.settings.errorClass,this.errorContext)},reset:function(){this.successList=[];this.errorList=[];this.errorMap={};this.toShow=a([]);this.toHide=a([]);this.currentElements=a([])},prepareForm:function(){this.reset();this.toHide=this.errors().add(this.containers)},prepareElement:function(b){this.reset();this.toHide=this.errorsFor(b)},check:function(f){f=this.clean(f);if(this.checkable(f)){f=this.findByName(f.name)[0]}var d=a(f).rules();var b=false;for(method in d){var h={method:method,parameters:d[method]};try{var c=a.validator.methods[method].call(this,f.value.replace(/\r/g,""),f,h.parameters);if(c=="dependency-mismatch"){b=true;continue}b=false;if(c=="pending"){this.toHide=this.toHide.not(this.errorsFor(f));return}if(!c){this.formatAndAdd(f,h);return false}}catch(g){this.settings.debug&&window.console&&console.log("exception occured when checking element "+f.id+", check the '"+h.method+"' method",g);throw g}}if(b){return}if(this.objectLength(d)){this.successList.push(f)}return true},customMetaMessage:function(d,b){if(!a.metadata){return}var c=this.settings.meta?a(d).metadata()[this.settings.meta]:a(d).metadata();return c&&c.messages&&c.messages[b]},customMessage:function(c,d){var b=this.settings.messages[c];return b&&(b.constructor==String?b:b[d])},findDefined:function(){for(var b=0;b<arguments.length;b++){if(arguments[b]!==undefined){return arguments[b]}}return undefined},defaultMessage:function(c,b){return this.findDefined(this.customMessage(c.name,b),this.customMetaMessage(c,b),!this.settings.ignoreTitle&&c.title||undefined,a.validator.messages[b],"<strong>Warning: No message defined for "+c.name+"</strong>")},formatAndAdd:function(c,d){var b=this.defaultMessage(c,d.method),e=/\$?\{(\d+)\}/g;if(typeof b=="function"){b=b.call(this,d.parameters,c)}else{if(e.test(b)){b=jQuery.format(b.replace(e,"{$1}"),d.parameters)}}this.errorList.push({message:b,element:c});this.errorMap[c.name]=b;this.submitted[c.name]=b},addWrapper:function(b){if(this.settings.wrapper){b=b.add(b.parent(this.settings.wrapper))}return b},defaultShowErrors:function(){for(var c=0;this.errorList[c];c++){var d=this.errorList[c];this.settings.highlight&&this.settings.highlight.call(this,d.element,this.settings.errorClass,this.settings.validClass);this.showLabel(d.element,d.message)}if(this.errorList.length){this.toShow=this.toShow.add(this.containers)}if(this.settings.success){for(var c=0;this.successList[c];c++){this.showLabel(this.successList[c])}}if(this.settings.unhighlight){for(var c=0,b=this.validElements();b[c];c++){this.settings.unhighlight.call(this,b[c],this.settings.errorClass,this.settings.validClass)}}this.toHide=this.toHide.not(this.toShow);this.hideErrors();this.addWrapper(this.toShow).show()},validElements:function(){return this.currentElements.not(this.invalidElements())},invalidElements:function(){return a(this.errorList).map(function(){return this.element})},showLabel:function(d,c){var b=this.errorsFor(d);if(b.length){b.removeClass().addClass(this.settings.errorClass);b.attr("generated")&&b.html(c)}else{b=a("<"+this.settings.errorElement+"/>").attr({"for":this.idOrName(d),generated:true}).addClass(this.settings.errorClass).html(c||"");if(this.settings.wrapper){b=b.hide().show().wrap("<"+this.settings.wrapper+"/>").parent()}if(!this.labelContainer.append(b).length){this.settings.errorPlacement?this.settings.errorPlacement(b,a(d)):b.insertAfter(d)}}if(!c&&this.settings.success){b.text("");typeof this.settings.success=="string"?b.addClass(this.settings.success):this.settings.success(b)}this.toShow=this.toShow.add(b)},errorsFor:function(c){var b=this.idOrName(c);return this.errors().filter(function(){return a(this).attr("for")==b})},idOrName:function(b){return this.groups[b.name]||(this.checkable(b)?b.name:b.id||b.name)},checkable:function(b){return/radio|checkbox/i.test(b.type)},findByName:function(b){var c=this.currentForm;return a(document.getElementsByName(b)).map(function(e,d){return d.form==c&&d.name==b&&d||null})},getLength:function(b,c){switch(c.nodeName.toLowerCase()){case"select":return a("option:selected",c).length;case"input":if(this.checkable(c)){return this.findByName(c.name).filter(":checked").length}}return b.length},depend:function(b,c){return this.dependTypes[typeof b]?this.dependTypes[typeof b](b,c):true},dependTypes:{"boolean":function(b,c){return b},"string":function(b,c){return !!a(b,c.form).length},"function":function(b,c){return b(c)}},optional:function(b){return !a.validator.methods.required.call(this,a.trim(b.value),b)&&"dependency-mismatch"},startRequest:function(b){if(!this.pending[b.name]){this.pendingRequest++;this.pending[b.name]=true}},stopRequest:function(c,b){this.pendingRequest--;if(this.pendingRequest<0){this.pendingRequest=0}delete this.pending[c.name];if(b&&this.pendingRequest==0&&this.formSubmitted&&this.form()){a(this.currentForm).submit();this.formSubmitted=false}else{if(!b&&this.pendingRequest==0&&this.formSubmitted){a(this.currentForm).triggerHandler("invalid-form",[this]);this.formSubmitted=false}}},previousValue:function(b){return a.data(b,"previousValue")||a.data(b,"previousValue",{old:null,valid:true,message:this.defaultMessage(b,"remote")})}},classRuleSettings:{required:{required:true},email:{email:true},url:{url:true},date:{date:true},dateISO:{dateISO:true},dateDE:{dateDE:true},number:{number:true},numberDE:{numberDE:true},digits:{digits:true},creditcard:{creditcard:true}},addClassRules:function(c,b){c.constructor==String?this.classRuleSettings[c]=b:a.extend(this.classRuleSettings,c)},classRules:function(d){var c={};var b=a(d).attr("class");b&&a.each(b.split(" "),function(){if(this in a.validator.classRuleSettings){a.extend(c,a.validator.classRuleSettings[this])}});return c},attributeRules:function(e){var d={};var c=a(e);for(method in a.validator.methods){var b=c.attr(method);if(b){d[method]=b}}if(d.maxlength&&/-1|2147483647|524288/.test(d.maxlength)){delete d.maxlength}return d},metadataRules:function(c){if(!a.metadata){return{}}var b=a.data(c.form,"validator").settings.meta;return b?a(c).metadata()[b]:a(c).metadata()},staticRules:function(d){var b={};var c=a.data(d.form,"validator");if(c.settings.rules){b=a.validator.normalizeRule(c.settings.rules[d.name])||{}}return b},normalizeRules:function(b,c){a.each(b,function(f,e){if(e===false){delete b[f];return}if(e.param||e.depends){var d=true;switch(typeof e.depends){case"string":d=!!a(e.depends,c.form).length;break;case"function":d=e.depends.call(c,c);break}if(d){b[f]=e.param!==undefined?e.param:true}else{delete b[f]}}});a.each(b,function(e,d){b[e]=a.isFunction(d)?d(c):d});a.each(["minlength","maxlength","min","max"],function(){if(b[this]){b[this]=Number(b[this])}});a.each(["rangelength","range"],function(){if(b[this]){b[this]=[Number(b[this][0]),Number(b[this][1])]}});if(a.validator.autoCreateRanges){if(b.min&&b.max){b.range=[b.min,b.max];delete b.min;delete b.max}if(b.minlength&&b.maxlength){b.rangelength=[b.minlength,b.maxlength];delete b.minlength;delete b.maxlength}}if(b.messages){delete b.messages}return b},normalizeRule:function(c){if(typeof c=="string"){var b={};a.each(c.split(/\s/),function(){b[this]=true});c=b}return c},addMethod:function(b,c,d){a.validator.methods[b]=c;a.validator.messages[b]=d!=undefined?d:a.validator.messages[b];if(c.length<3){a.validator.addClassRules(b,a.validator.normalizeRule(b))}},methods:{required:function(b,d,c){if(!this.depend(c,d)){return"dependency-mismatch"}switch(d.nodeName.toLowerCase()){case"select":var e=a(d).val();return e&&e.length>0;case"input":if(this.checkable(d)){return this.getLength(b,d)>0}default:return a.trim(b).length>0}},remote:function(b,f,c){if(this.optional(f)){return"dependency-mismatch"}var d=this.previousValue(f);if(!this.settings.messages[f.name]){this.settings.messages[f.name]={}}d.originalMessage=this.settings.messages[f.name].remote;this.settings.messages[f.name].remote=d.message;c=typeof c=="string"&&{url:c}||c;if(d.old!==b){d.old=b;var e=this;this.startRequest(f);var g={};g[f.name]=b;a.ajax(a.extend(true,{url:c,mode:"abort",port:"validate"+f.name,dataType:"json",data:g,success:function(h){e.settings.messages[f.name].remote=d.originalMessage;var k=h===true;if(k){var j=e.formSubmitted;e.prepareElement(f);e.formSubmitted=j;e.successList.push(f);e.showErrors()}else{var l={};var i=(d.message=h||e.defaultMessage(f,"remote"));l[f.name]=a.isFunction(i)?i(b):i;e.showErrors(l)}d.valid=k;e.stopRequest(f,k)}},c));return"pending"}else{if(this.pending[f.name]){return"pending"}}return d.valid},minlength:function(b,d,c){return this.optional(d)||this.getLength(a.trim(b),d)>=c},maxlength:function(b,d,c){return this.optional(d)||this.getLength(a.trim(b),d)<=c},rangelength:function(b,d,c){var e=this.getLength(a.trim(b),d);return this.optional(d)||(e>=c[0]&&e<=c[1])},min:function(b,d,c){return this.optional(d)||b>=c},max:function(b,d,c){return this.optional(d)||b<=c},range:function(b,d,c){return this.optional(d)||(b>=c[0]&&b<=c[1])},email:function(b,c){return this.optional(c)||/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(b)},url:function(b,c){return this.optional(c)||/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(b)},date:function(b,c){return this.optional(c)||!/Invalid|NaN/.test(new Date(b))},dateISO:function(b,c){return this.optional(c)||/^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(b)},number:function(b,c){return this.optional(c)||/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(b)},digits:function(b,c){return this.optional(c)||/^\d+$/.test(b)},creditcard:function(b,e){if(this.optional(e)){return"dependency-mismatch"}if(/[^0-9-]+/.test(b)){return false}var f=0,c=0,h=false;b=b.replace(/\D/g,"");for(var d=b.length-1;d>=0;d--){var g=b.charAt(d);var c=parseInt(g,10);if(h){if((c*=2)>9){c-=9}}f+=c;h=!h}return(f%10)==0},accept:function(b,d,c){c=typeof c=="string"?c.replace(/,/g,"|"):"png|jpe?g|gif";return this.optional(d)||b.match(new RegExp(".("+c+")$","i"))},equalTo:function(b,e,c){var d=a(c).unbind(".validate-equalTo").bind("blur.validate-equalTo",function(){a(e).valid()});return b==d.val()}}});a.format=a.validator.format})(jQuery);(function(b){var c=b.ajax;var a={};b.ajax=function(e){e=b.extend(e,b.extend({},b.ajaxSettings,e));var d=e.port;if(e.mode=="abort"){if(a[d]){a[d].abort()}return(a[d]=c.apply(this,arguments))}return c.apply(this,arguments)}})(jQuery);(function(a){a.each({focus:"focusin",blur:"focusout"},function(b,c){a.event.special[c]={setup:function(){if(a.browser.msie){return false}this.addEventListener(b,a.event.special[c].handler,true)},teardown:function(){if(a.browser.msie){return false}this.removeEventListener(b,a.event.special[c].handler,true)},handler:function(d){arguments[0]=a.event.fix(d);arguments[0].type=c;return a.event.handle.apply(this,arguments)}}});a.extend(a.fn,{delegate:function(c,b,d){return this.bind(c,function(e){var f=a(e.target);if(f.is(b)){return d.apply(f,arguments)}})},triggerEvent:function(b,c){return this.triggerHandler(b,[a.event.fix({type:b,target:c})])}})})(jQuery);