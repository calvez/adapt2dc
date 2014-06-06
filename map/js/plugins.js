jQuery.fn.stylechanger = function(options){
	var opts = jQuery.extend({},jQuery.fn.stylechanger.defaults,options);

	function onchange(e){
		opts.layer.fire('style-change',{data:e.currentTarget.value});
	}

	return this.each(function(){
		var $select = jQuery('<select></select>')
		    ,k,i=0;
		for(k in opts.data){
			jQuery('<option></option>')
						.val(k)
						.text(opts.data[k].name)
						.appendTo($select)
			;
			i++
		}
		$select.attr('size',i);
		$select.bind('change',onchange);
		jQuery(this).append($select);
	});
};


//######################################################################################################
L.Control.Styles = L.Control.extend({
	 _container : null
	,_layer : null
	,_currentIndicator : null
	,options : {
		defaultStyle : 'dens11'
	}
	,initialize : function(layer,options){
		L.Util.setOptions(this, options);
		this._layer = layer;
	}
	,onAdd: function(){
		var styles = this.options.styles
			,_this  = this;

		function selectChange(e){
			_this.changeStyle(e.data);
		}

		this._layer.on('style-change',selectChange);
	}
	,onRemove: function(){
		L.DomEvent.removeListener(this._container,'change',selectChange);
		this._container.parentNode.removeChild(this._container);
		this._map.removeControl(this);
	}
	//,addStyle: function(){}
	//,removeStyle: function(){}
	,changeStyle: function(indicator){
		this._currentIndicator = indicator;
		this.cache = {};
		var  color = this.getColor()
			,layer = this._layer
		;

		function style(feature){
			return {
					 weight		: 1
					,opacity	: 1
					,color		: 'black'
					,dashArray	: '1'
					,fillOpacity: 0.7
					,fillColor	: color(feature.properties[indicator])
			};
		};
		this._layer.options.style = style;
		this._layer.setStyle(this._layer.options.style);
		this._layer.fire('style-changed',{data: indicator,cache: this.cache});
	}
	,getColor: function(){
		if(!this._currentIndicator) return;
		var  values = this.options.styles[this._currentIndicator].values
			,colors = this.options.styles[this._currentIndicator].colors
			,_this = this
			,k
		;
		return function(value){
			for(k=1;k<values.length;k++){
				if(value<=values[k]){
					_this.cache[colors[k-1]] = !!_this.cache[colors[k-1]] ? _this.cache[colors[k-1]]+1 : 1;
					return colors[k-1];
				}
			}
			_this.cache[colors[k-1]] = !!_this.cache[colors[k-1]] ? _this.cache[colors[k-1]]+1 : 1;
			return colors[values.length];
		};
	}

});

L.control.styles = function(layer,options){
	return new L.Control.Styles(layer,options);
};
//######################################################################################################
//######################################################################################################
L.Control.Legend = L.Control.extend({
	 _container : null
	,_layer		: null
	,initialize : function(layer,options){
		L.Util.setOptions(this, options);
		this._layer = layer;
	}
	,onAdd: function(map){
		this._container = L.DomUtil.create('div','leaflet-control-legend');
		var _this = this;
		this._layer._legend = this;
		this._layer.on('style-changed',_this._update);
		// L.geoJson extends FeatureGroup, when a feature add to the layer it should fire 'layeradd' trigger, but..
		// geojson adddata method do not trigger layeradd or this is a bug
		//this._layer.on('layeradd',_this._update);
		return this._container;
	}
	,onRemove: function(){
		var _this = this;
		this._layer.off('style-changed',_this._update);
		this._container.parentNode(this._container);
		this._map.removeControl(this);
	}
	,_update: function(e){
		if(!e.data) return;
		var styleObj = this._legend.options.styles[e.data]
			,cache = e.cache
			,values = styleObj.values
			,colors = styleObj.colors
			,unit = styleObj.unit
			,start,stop,labels = []
			,k,i
			,alternate = !!styleObj.alternate ? styleObj.alternate : null
		;
		function getColor(value){
			for(k=0;k<values.length;k++){
				if(value<=values[k]) return colors[k];
			}
			return colors[0];
		}
		for(i=values.length-1;i>0;i--){
			start = values[i-1];stop = values[i];
			var color = getColor(start);
			if(!alternate){
				label = '<span><i style="background:'+ color +';"></i>'+start +' - '+stop + unit+' ['+ cache[color] +']'+'</span>';
			}
			else{
				label = '<span><i style="background:'+ color +';"></i>'+alternate[i-1]+' ('+start +' - '+stop + unit+') ['+ cache[color] +']'+'</span>';
			}
			labels.push(label);
		}
		this._legend._container.innerHTML = labels.join('</br>');
		this.fire('legend-updated');
	}
});

L.control.legend = function(layer,options){
	return new L.Control.Legend(layer,options);
};
////////////////////////////////////////////////////////////////////////////////////////

// SEARCH plugin

jQuery.fn.autocomplete = function(options){
	var opts = jQuery.extend({},jQuery.fn.autocomplete .defaults,options);

	function search(){
	    	var value= jQuery(this).val()
	    	   ,$this = jQuery(this)
	    	   ,$results = jQuery(this).siblings()
	    	   ,results = []
	    	   ,pos = $this.position()
	    	   ,this_width = $this.width()
	    	   ,this_height = $this.height()
	    	   ,k,re
	    	;
	    	$results.empty()
		;
		if(jQuery(this).val() == '') {$results.hide(); return;}

		re = new RegExp('^'+value.toLowerCase(),'g');
		for(k in opts.data._layers){
			if(opts.data._layers[k].feature.properties.name_asci.toLowerCase().match(re)){
				results.push(opts.data._layers[k]);
				jQuery('<div></div>')
					.addClass('autocomplete-results')
					.data(opts.data._layers[k])
					.text(opts.data._layers[k].feature.properties.name_asci)
					.appendTo($results);
			}
		}
		if(results.length == 0) return;
		$results.css({
		   			 //width : 355
		   			 'min-height': 50
		   			//,'background-color': 'white'
		   			,position: 'absolute'
		   			,left : pos.left
		   			,top: pos.top+20
			})
			.show();

		jQuery($results).trigger('autocomplete-updated',results);
        }




	return this.each(function(){
		var $container = jQuery('<div></div>')
		   ,$input = jQuery('<input></input>').attr({
			placeholder: 'Search by nuts 3 unit name'
		   })
		   .addClass('autocomplete_search')
		   .css('width',200)
		   ,$results = jQuery('<div></div>')
		   		.attr('class','autocomplete_results')
		   		.hide()
		 ;
		 $container
		 	.append($input)
		 	.append($results)
		 	.appendTo(this);
		 $input.bind('keyup',search);

		 jQuery('.autocomplete_results').bind('autocomplete-updated',function(e,data){
			jQuery(this).find('div').hover(
				function(e){
					jQuery(this).stop(true);
					jQuery(e.currentTarget).data().fire('mouseover');
				}
				,function(e){
					jQuery(this).stop(true);
					jQuery(e.currentTarget).data().fire('mouseout');
				}
			)
			.click(function(e){
				var data = jQuery(e.currentTarget).data();
				data.fire('click');
				jQuery('.autocomplete_results').empty().hide();
				jQuery('.autocomplete_search').val(data.feature.properties.name_asci);
			});
		 });
	});
};

var hover = true;
function layer_interaction(layer){
	var style = {
		 weight: 5
		,color: '#D23641'
	}
	,lastClicked = null;

	function fn(e){
		if (e.type == 'mouseover' && hover){
			e.target.setStyle(style);
			if(!L.Browser.ie && L.Browser.opera){
				e.target.bringToFront();
			}
			layer.fire('table-update',{data:e.target});
		}
		else if(e.type == 'click'){
			if(lastClicked) layer.resetStyle(lastClicked);
			e.target.setStyle(style);
			if(!L.Browser.ie && L.Browser.opera){
				e.target.bringToFront();
			}
			hover = false;
			jQuery('#hover').prop('checked',hover);
			lastClicked = e.target;
			layer.fire('table-add',{data:e.target});
		}
		else if(e.type == 'mouseout' && hover){
			if(lastClicked) layer.resetStyle(lastClicked);
			layer.resetStyle(e.target);
			layer.fire('table-clear',{data:e.target});
		};
	};

	layer.on('style-changed',function(e){
		if(lastClicked && !hover){
			lastClicked.setStyle(style);
			if(!L.Browser.ie && L.Browser.opera){
				lastClicked.bringToFront();
			}
		}
	});

	return function(feature,layer){
		layer.on("click mouseout mouseover",fn);
	};
};

var htable;
function setTable(data){


}
