/**
 * jQuery Form Builder Plugin
 * Copyright (c) 2009 Mike Botsko, Botsko.net LLC (http://www.botsko.net)
 * http://www.botsko.net/blog/2009/04/jquery-form-builder-plugin/
 * Originally designed for AspenMSM, a CMS product from Trellis Development
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * Copyright notice and license must remain intact for legal use
 */
(function($){
	$.fn.formbuilder = function(options) {
		
		// Extend the configuration options with user-provided
		var defaults = {
			save_url: false,
			load_url: false,
			save_method: false,
			load_method: false
		};
		var opts = $.extend(defaults, options);

		var last_id = 0 ;
		var ul_obj ;

		// Wrapper for adding a new field
		var appendNewField = function(type, values, options, required){

			field = '';
			field_type = type;

			if(typeof(values) == 'undefined'){
				values = '';
			}
			if( typeof( required ) == 'undefined' ) {
				required = true ;
			}

			switch(type){
				case 'input_text':
					appendTextInput(values, required);
					break;
				case 'textarea':
					appendTextarea(values, required);
					break;
				case 'checkbox':
					appendCheckboxGroup(values, options, required);
					break;
				case 'radio':
					appendRadioGroup(values, options, required);
					break;
				case 'select':
					appendSelectList(values, options, required);
					break;
				case 'sectionheader':
					appendSectionHeader(values) ;
					break ;
				case 'fileupload':
					appendFileUpload(values, required) ;
					break ;
			}
		}

		// single line input type="text"
		var appendTextInput = function(values, required){

			field += '<label>Label:</label>';
			field += '<input class="fld-title" id="title-'+last_id+'" type="text" value="'+values+'" />';
			help = '';

			appendFieldLi('Text Field', field, required, help);

		}

		// multi-line textarea
		var appendTextarea = function(values, required){

			field += '<label>Label:</label>';
			field += '<input type="text" value="'+values+'" />';
			help = '';

			appendFieldLi('Paragraph Field', field, required, help);

		}

		// adds a checkbox element
		var appendCheckboxGroup = function(values, options, required){

			var title = '';
			if(typeof(options) == 'object'){
				title = options[0];
			}

			field += '<div class="chk_group">';
			field += '<div class="frm-fld"><label>Title:</label>';
			field += '<input type="text" name="title" value="'+title+'" /></div>';
			field += '<div class="false-label">Select Options</div>';
			field += '<div class="fields">';

			if(typeof(values) == 'object'){
				for(c in values){
					field += checkboxFieldHtml(values[c]);
				}
			} else {
				field += checkboxFieldHtml('');
			}

			field += '<div class="add-area"><a href="#" class="add add_ck">Add</a></div>';
			field += '</div>';
			field += '</div>';

			help = '';
			appendFieldLi('Multiple Choice (Select Multiple)', field, required, help);

			$('.add_ck').live('click', function(){
				$(this).parent().before( checkboxFieldHtml() );
				return false;
			});
		}

		// adds a section header
		var appendSectionHeader = function(values) {
			field += '<div class="frm-fld">' ;
			field += '<label>Label:</label>' ;
			field += '<input type="text" value="'+values['title']+'" />' ;
			field += '</div>' ;
			field += '<div class="frm-fld">' ;
			field += '<label>Paragraph:</label>' ;
			field += '<textarea name="sectionheader-paragraph">'+values['paragraph']+'</textarea>' ;
			field += '</div>' ;

			help = '' ;
			required = null ;

			appendFieldLi('Section Header', field, required, help) ;
		}

		// adds a file upload option
		var appendFileUpload = function(values, required) {
			field += '<label>Label:</label>' ;
			field += '<input type="text" value="'+values+'" />' ;

			help = '' ;

			appendFieldLi('File Upload', field, required, help) ;
		}

		// Checkbox field html, since there may be multiple
		var checkboxFieldHtml = function(values){

			var checked = false;

			if(typeof(values) == 'object'){
				var value = values[0];
				checked = values[1] == 'false' ? false : true;
			} else {
				var value = '';
			}

			field = '';
			field += '<div>';
			field += '<input type="checkbox"'+(checked ? ' checked="checked"' : '')+' /><input type="text" value="'+value+'" />';
			field += '<a href="#" class="remove" title="Are you sure you want to remove this checkbox?">Remove</a>';
			field += '</div>';

			return field;

		}

		// adds a radio element
		var appendRadioGroup = function(values, options, required){

			var title = '';
			if(typeof(options) == 'object'){ title = options[0]; }

			field += '<div class="rd_group">';
			field += '<div class="frm-fld"><label>Title:</label>';
			field += '<input type="text" name="title" value="'+title+'" /></div>';
			field += '<div class="false-label">Select Options</div>';
			field += '<div class="fields">';

			if(typeof(values) == 'object'){
				for(c in values){
					field += radioFieldHtml(values[c], 'frm-'+last_id+'-fld');
				}
			} else {
				field += radioFieldHtml('', 'frm-'+last_id+'-fld');
			}

			field += '<div class="add-area"><a href="#" class="add add_rd">Add</a></div>';
			field += '</div>';
			field += '</div>';
			help = '';

			appendFieldLi('Multiple Choice (Select One)', field, required, help);

			$('.add_rd').live('click', function(){
				$(this).parent().before( radioFieldHtml(false, $(this).parents('.frm-holder').attr('id')) );
				return false;
			});
		}

		// Radio field html, since there may be multiple
		var radioFieldHtml = function(values, name){

			var checked = false;

			if(typeof(values) == 'object'){
				var value = values[0];
				checked = values[1] == 'false' ? false : true;
			} else {
				var value = '';
			}

			field = '';
			field += '<div>';
			field += '<input type="radio"'+(checked ? ' checked="checked"' : '')+' name="radio_'+name+'" /><input type="text" value="'+value+'" />';
			field += '<a href="#" class="remove" title="Are you sure you want to remove this radio button option?">Remove</a>';
			field += '</div>';

			return field;

		}

		// adds a select/option element
		var appendSelectList = function(values, options, required){

			var multiple = false;
			var title = '';
			if(typeof(options) == 'object'){
				title = options[0];
				multiple = options[1] == 'true' ? true : false;
			}

			field += '<div class="opt_group">';
			field += '<div class="frm-fld"><label>Title:</label>';
			field += '<input type="text" name="title" value="'+title+'" /></div>';
			field += '';
			field += '<div class="false-label">Select Options</div>';
			field += '<div class="fields">';
			field += '<input type="checkbox" name="multiple"'+(multiple ? 'checked="checked"' : '')+'><label class="auto">Allow Multiple Selections</label>';

			if(typeof(values) == 'object'){
				for(c in values){
					field += selectFieldHtml(values[c], multiple);
				}
			} else {
				field += selectFieldHtml('', multiple);
			}

			field += '<div class="add-area"><a href="#" class="add add_opt">Add</a></div>';
			field += '</div>';
			field += '</div>';
			help = '';

			appendFieldLi('Select List', field, required, help);

			$('.add_opt').live('click', function(){
				$(this).parent().before( selectFieldHtml('', multiple) );
				return false;
			});
		}

		// Select field html, since there may be multiple
		var selectFieldHtml = function(values, multiple){
			if(multiple){
				return checkboxFieldHtml(values);
			} else {
				return radioFieldHtml(values);
			}
		}


		// Appends the new field markup to the editor
		var appendFieldLi = function(title, field_html, required, help){

			var li = '';
			li += '<li id="frm-'+last_id+'-item" class="'+field_type+'">';
			li += '<div class="legend">' ;
			li += 	'<a id="frm-'+last_id+'" class="toggle-form" href="#">Hide</a> ';
			li += 	'<strong id="txt-title-'+last_id+'">'+title+'</strong>';
			li += 	'<span class="question-number">#'+last_id+'</span>';
			li += '</div>';
			li += '<div id="frm-'+last_id+'-fld" class="frm-holder">';
			li += '<div class="frm-elements">';
			if( required != null && typeof(required) != 'undefined') {
				li += '<div class="frm-fld"><label for="required-'+last_id+'">Required?</label>';
				li += $.fn.formbuilder.buildRequiredMenu(null, required) ;
//					li += '<input class="required" type="checkbox" value="1" name="required-'+last_id+'" id="required-'+last_id+'"'+(required ? ' checked="checked"' : '')+' />';
				li += '</div>';
			}
			li += field;
			li += '</div>';
			li += '<a id="del_'+last_id+'" class="del-button delete-confirm" href="#" title="Are you sure you want to delete this form section?"><span>Delete</span></a>'
			li += '</div>';
			li += '</li>';

			$(ul_obj).append(li);
			$('#frm-'+last_id+'-item').hide();
			$('#frm-'+last_id+'-item').animate({opacity: 'show', height: 'show'}, 'slow');

			last_id++;
		}


		return this.each(function() {
//			var ul_obj 		= this;
			ul_obj = this;
			var field 		= '';
			var field_type 	= '';
//			var last_id 	= 1;
			var jsonData = null ;

			$(ul_obj).html('');

			var loadFormSpecs = function( jsonData ) {
				var values = '' ;
				var options = false ;
				var required = false ;
				var theField ;
				var itemKey ;

				if( jsonData != null ) {
					for( var i = 0; i < jsonData.length; i++ ) {
						theField = jsonData[i] ;
						// checkbox
						if( theField['class'] == 'checkbox' ) {
							options = new Array ;
							options[0] = theField['title'] ;
							values = new Array ;
							for( itemKey in theField['values'] ) {
								values[itemKey] = new Array(2) ;
								values[itemKey][0] = theField['values'][itemKey]['value'] ;
								values[itemKey][1] = theField['values'][itemKey]['default'] ;
							}
						}

						// radio
						else if( theField['class'] == 'radio' ) {
							options = new Array ;
							options[0] = theField['title'] ;
							values = new Array ;
							for( itemKey in theField['values'] ) {
								values[itemKey] = new Array(2) ;
								values[itemKey][0] = theField['values'][itemKey]['value'] ;
								values[itemKey][1] = theField['values'][itemKey]['default'] ;
							}
						}

						// select
						else if( theField['class'] == 'select' ) {
							options = new Array ;
							options[0] = theField[ 'title' ] ;
							options[1] = theField[ 'multiple' ] ;
							values = new Array ;
							for( itemKey in theField['values'] ) {
								values[itemKey] = new Array(2) ;
								values[itemKey][0] = theField['values'][itemKey]['value'] ;
								values[itemKey][1] = theField['values'][itemKey]['default'] ;
							}
						}

						// file upload
						else if( theField['class'] == 'fileupload' ) {
							values = theField['values'] ;
						}

						// section header
						else if( theField['class'] == 'sectionheader' ) {
							values = new Array ;
							values['title'] = theField['title'] ;
							values['paragraph'] = theField['paragraph'] ;
						}

						// textarea
						else if( theField['class'] == 'textarea' ) {
							values = theField['values'] ;
						}

						// plain text field
						else {
							values = theField['values'] ;
						}

						appendNewField( theField['class'], values, options, theField['required'] );
					}

				}
				$.fn.formbuilder.updateSequentialData($(ul_obj)) ;
			} ;


			// load existing form data
			if( opts.load_method !== false ) {
				jsonData = opts.load_method() ;
				loadFormSpecs( jsonData ) ;
			} else if(opts.load_url){
				$.ajax({
					type: "GET",
					dataType: 'json',
					url: opts.load_url,
					success: function( jsonData ) {
						loadFormSpecs( jsonData ) ;
					}
				}) ;
			}
			

			// set the form save action
			$(this).after($('<button id="save-form" type="submit" name="submit">Save</button>').click(function(){
				if( opts.save_method === false ) {
					save();
				} else {
					opts.save_method() ;
				}
				return false;
			}));
			
			// Create form control select box and add into the editor
			var select = '';
			select += '<option value="0">Add New Field...</option>';
			select += '<option value="input_text">Text</option>';
			select += '<option value="textarea">Paragraph</option>';
			select += '<option value="checkbox">Multiple Choice (Select Multiple)</option>';
			select += '<option value="radio">Multiple Choice (Select One)</option>';
			select += '<option value="select">Select List</option>';
			select += '<option value="fileupload">File Upload</option>' ;
			select += '<option value="sectionheader">Section Header</option>' ;
			$(this).before('<select name="field_control_top" class="field_control">'+select+'</select>');
			$(this).after('<select name="field_control_bot" class="field_control">'+select+'</select>');
			$('.field_control').change(function(){
				appendNewField($(this).val());
				$(this).val(0).blur();
				$().scrollTo($('#frm-'+(last_id-1)+'-item'), 800);
				return false;
			});	
			
			
									
			// handle field delete links
			$('.remove').live('click', function(){
				$(this).parent('div').animate({opacity: 'hide', height: 'hide', marginBottom: '0px'}, 'fast', function () {
					$(this).remove();
				});
				return false;
			});
			
			// handle field display/hide
			$('.toggle-form').live('click', function(){
				var target = $(this).attr("id");
				if($(this).html() == 'Hide'){
					$(this).removeClass('open').addClass('closed').html('Show');
					$('#' + target + '-fld').animate({opacity: 'hide', height: 'hide'}, 'slow');
					return false;
				}
				if($(this).html() == 'Show'){
					$(this).removeClass('closed').addClass('open').html('Hide');
					$('#' + target + '-fld').animate({opacity: 'show', height: 'show'}, 'slow');
					return false;
				}
				return false;
			});
			
			// handle delete confirmation
			$('.delete-confirm').live('click', function() {
				var delete_id = $(this).attr("id").replace(/del_/, '');
				if(confirm( $(this).attr('title') )){
					$('#frm-'+delete_id+'-item').animate({opacity: 'hide', height: 'hide', marginBottom: '0px'}, 'slow', function () {
						$(this).remove();
					});
				}
				return false;
			});
			
			// handle changes to required menus
			$('select.question-required').live('change', function() {
				$(this).attr('_required', $(this).val()) ;
			}) ;
			
			// saves the serialized data to the server 
			var save = function(){
				if(opts.save_url){
					$.ajax({
						type: "POST",
						url: opts.save_url,
						data: $(ul_obj).serializeFormList(),
						success: function(xml){ 
							// console.log(xml);
						}
					});
				}
			}
		});
	};
	
	$.fn.formbuilder.updateSequentialData = function(formbuilder_el) {
		var index = 1 ;
		formbuilder_el.find('li').each( function() {
			// re-number the question
			$(this).find('span.question-number').html('#' + index) ;
			index++ ;
			
			var currentRequiredValue = $(this).find('select.question-required').attr('_required') ;
//			console.log( currentRequiredValue ) ;
			$(this).find('select.question-required').replaceWith( $.fn.formbuilder.buildRequiredMenu( $(this), currentRequiredValue )); 
			
		}) ;
	}
	
	$.fn.formbuilder.buildRequiredMenu = function( li_obj, required ) {
		var selectMenu = '<select class="question-required" _required="'+required+'">' ;

		selectMenu += '<option value="1"' + 
						((required == 'true' || required == '1') ? ' selected="selected"' : '' ) + 
						'>Yes</option>' ;
		selectMenu += '<option value="0"' + 
						((required == 'false' || required == '0') ? ' selected="selected"' : '' ) + 
						'>No</option>' ;

		// go through the previous items and add the options for any multiple choice responses to this
		
		$(li_obj).prevAll('li.radio').each( function() {
			var questionNumberOneBased = $(this).find('.question-number').html().replace('#','') ;
			var questionNumberZeroBased = parseInt( questionNumberOneBased ) - 1 ;
			var questionLabel = 'Q' + questionNumberOneBased + ' = ' ;
			var questionValue = '_' + questionNumberZeroBased + '_eq_' ;
			$(this).find('div.fields input[type="text"]').each( function() {
				var pattern = /\W/ ;
				var menuLabel = questionLabel + $(this).val() ;
				var menuValue = (questionValue + $(this).val()).replace(pattern, '_') ;
				menuValue = menuValue.replace(/ /g,'');
				menuValue = menuValue.replace('=','_eq_') ;
				selectMenu += '<option value="' + menuValue + '"' + (required == menuValue ? ' selected="selected"' : '')+ '>' + menuLabel + '</option>' ;
			}) ;
		}) ;
		
		
		selectMenu += '</select>' ;
		return selectMenu ;
	}
})(jQuery);

/**
 * jQuery Form Builder List Serialization Plugin
 * Copyright (c) 2009 Mike Botsko, Botsko.net LLC (http://www.botsko.net)
 * Originally designed for AspenMSM, a CMS product from Trellis Development
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * Copyright notice and license must remain intact for legal use
 * Modified from the serialize list plugin
 * http://www.botsko.net/blog/2009/01/jquery_serialize_list_plugin/
 */
(function($){
	$.fn.serializeFormList = function(options) {
		// Extend the configuration options with user-provided
		var defaults = {
			prepend: 'ul',
			is_child: false,
			attributes: ['class']
		};
		var opts = $.extend(defaults, options);
		var serialStr 	= '';
		
		if(!opts.is_child){ opts.prepend = '&'+opts.prepend; }
		
		// Begin the core plugin
		this.each(function() {
			var ul_obj = this;

			var li_count 	= 0;
			$(this).children().each(function(){
				
				for(att in opts.attributes){
					serialStr += opts.prepend+'['+li_count+']['+opts.attributes[att]+']='+escape($(this).attr(opts.attributes[att]));
					
					// append the form field values
					if(opts.attributes[att] == 'class'){
						
//						serialStr += opts.prepend+'['+li_count+'][required]='+escape($('#'+$(this).attr('id')+' input.required').attr('checked'));
						serialStr += opts.prepend+'['+li_count+'][required]='+escape($('#'+$(this).attr('id')+' select.question-required option:selected').val());
					
						switch($(this).attr(opts.attributes[att])){
							case 'sectionheader':
								serialStr += opts.prepend+'['+li_count+'][title]='+escape($('#'+$(this).attr('id')+' input[type=text]').val());
								serialStr += opts.prepend+'['+li_count+'][paragraph]='+escape($('#'+$(this).attr('id')+' textarea').val());
								break ;
							case 'input_text':
								serialStr += opts.prepend+'['+li_count+'][values]='+escape($('#'+$(this).attr('id')+' input[type=text]').val());
								break;
							case 'textarea':
								serialStr += opts.prepend+'['+li_count+'][values]='+escape($('#'+$(this).attr('id')+' input[type=text]').val());
								break;
							case 'fileupload':
								serialStr += opts.prepend+'['+li_count+'][values]='+escape($('#'+$(this).attr('id')+' input[type=text]').val());
								break ;
							case 'checkbox':
								var c = 1;
								$('#'+$(this).attr('id')+' input[type=text]').each(function(){
									
									if($(this).attr('name') == 'title'){
										serialStr += opts.prepend+'['+li_count+'][title]='+escape($(this).val());
									} else {
										serialStr += opts.prepend+'['+li_count+'][values]['+c+'][value]='+escape($(this).val());
										serialStr += opts.prepend+'['+li_count+'][values]['+c+'][default]='+$(this).prev().attr('checked');
									}
									c++;
								});
								break;
							case 'radio':
								var c = 1;
								$('#'+$(this).attr('id')+' input[type=text]').each(function(){
									if($(this).attr('name') == 'title'){
										serialStr += opts.prepend+'['+li_count+'][title]='+escape($(this).val());
									} else {
										serialStr += opts.prepend+'['+li_count+'][values]['+c+'][value]='+escape($(this).val());
										serialStr += opts.prepend+'['+li_count+'][values]['+c+'][default]='+$(this).prev().attr('checked');
									}
									c++;
								});
								break;
							case 'select':
								var c = 1;
								
								serialStr += opts.prepend+'['+li_count+'][multiple]='+$('#'+$(this).attr('id')+' input[name=multiple]').attr('checked');
								
								$('#'+$(this).attr('id')+' input[type=text]').each(function(){
									
									if($(this).attr('name') == 'title'){
										serialStr += opts.prepend+'['+li_count+'][title]='+escape($(this).val());
									} else {
										serialStr += opts.prepend+'['+li_count+'][values]['+c+'][value]='+escape($(this).val());
										serialStr += opts.prepend+'['+li_count+'][values]['+c+'][default]='+$(this).prev().attr('checked');
									}
									c++;
								});
							break;
						}
					}
				}
				li_count++;
			});
		});
		return(serialStr);
	};
})(jQuery);


// this is for handling dependent questions...

$(document).ready( function() {
	var initialRun = true ;
	var updateDependencies = function() {
		var newVal = $(this).val() ;
		var radioIndex = $(this).attr('id').replace(/(_\d+_).*/, '$1') ;
		var matchingClass = radioIndex + 'eq_' + newVal.replace(/\W/, '_') ; // need to me sure an

		// clear the "required" class from all applicable elements
		// TODO: make this more robust. There is potential for users to name fields in such a way
		// that this could generate false positives.

		if( !initialRun ) {
			$('form.frm-bldr li[class*="'+radioIndex+'eq_"]').removeClass('required') ;
		}

		// add the "required" class to anything meeting this specific criteria
		if( $(this).attr("checked") ) {
			$('form.frm-bldr li.'+matchingClass).addClass('required') ;
		}
	}

	$('form.frm-bldr input[type="radio"]').each( updateDependencies ) ;

	initialRun = false ;
	$('form.frm-bldr input[type="radio"]').change( updateDependencies ) ;



}) ;



