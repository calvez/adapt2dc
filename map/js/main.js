/**************
 * JQUERY READY
 **************/
jQuery('document').ready(function(){
	// Egérsiklás engedélyezése/tiltása
	jQuery("#hover")
		.prop('checked',true)
		.bind('change',function(e){
			hover = e.currentTarget.checked;
		});

	// Térkép
	var  map = L.map('map').setView([49.6, 19], 5)
	    ,osm    = L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, <a href="http://epp.eurostat.ec.europa.eu/portal/page/portal/about_eurostat/policies/copyright_licence_policy">EUROSTAT</a> dissemination database,Made in <a href="https://www.nth.gov.hu/hu">ONEP</a> 2014 ',minZoom:4,maxZoom:10}).addTo(map)
	    ,gjson  = L.geoJson().addTo(map)

	// Jelmagyarázat
	   ,legend = L.control.legend(gjson,{styles:styles,position:'bottomright'}).addTo(map)

	// Megjegyzés
	gjson.on('style-changed',function(e){
		var txt = styles[e.data].glossary;
		jQuery('.annotation').empty().html(txt);
	});

	// Stílusváltó hozzáadáása
	jQuery('.style-changer').stylechanger({
		data:styles
		,layer:gjson
	})
	L.control.styles(gjson,{styles:styles}).onAdd(map);

	// Réteg feltöltése
	gjson.options.onEachFeature = layer_interaction(gjson);
	gjson.addData(gdata);

	// Alapértelmezett stílus beállítása
	jQuery('.style-changer').find('select')
				.trigger('change',{data:"dens11"});

	// Kereső
	jQuery('.autocomplete-search').autocomplete({data:gjson});

	// Tábla beállítása
	var data = [];
	var temp = new Array(4);
	temp[0] = 'Name (NUTS 3 unit)';
	data.push(temp);
	var temp = new Array(4);
	temp[0] = 'Population (Inhabitant)';
	data.push(temp);

	for(var k in styles){
		var temp = new Array(4);
		var plus = styles[k].unit ? ' ('+styles[k].unit+')' : "";
		temp[0] = (styles[k].name+ plus);
		data.push(temp);
	}

	htable = $('.table').handsontable({
	  data: data
	  //,minSpareRows: 1
	  ,colHeaders: false
	  ,contextMenu: true
	  ,stretchH: 'none'
	  ,colWidths:[450,130,130,130]
	  ,cells : function(row,col,prop){
	  	var cellProps = {};
		if(col == 0) cellProps.readOnly = true;
	  	return cellProps;
	  }
	});

	// Tábla feltöltése
	// Azt a sort kell feltölteni, ahol minden érték üres, vagy az ötödik sort
	var lastcol;
	gjson.on('table-update',function(e,data){
		var data = e.data.feature.properties
		   ,col = 1,b
		;

		for(col = 1;col<=2;col++){
			b = true;
			for(var row=0;row<=8;row++){
				var val = htable.handsontable('getDataAtCell',row,col);
				if(val != "" && typeof val != 'undefined') b=false;
			}
			if(b) break;
		}

		htable.handsontable('setDataAtCell',0,col,data.name_asci);
		htable.handsontable('setDataAtCell',1,col,data.pop11*1000);
		htable.handsontable('setDataAtCell',2,col,data.dens11);
		htable.handsontable('setDataAtCell',3,col,data.pop_change_btw_2001_2011_rel);
		htable.handsontable('setDataAtCell',4,col,data.pop_change_btw_2011_2030_rel);
		htable.handsontable('setDataAtCell',5,col,data.total_fertility_rate_2011);
		htable.handsontable('setDataAtCell',6,col,data.ageing_measured_by_mean_age);
		htable.handsontable('setDataAtCell',7,col,data.share_of_growth_of_55_2001_2011_in_total_population);
		htable.handsontable('setDataAtCell',8,col,data.share_of_growth_of_70_2001_2011_in_total_population);
		lastcol = col;

	});
	gjson.on('table-clear',function(e){
		if(!lastcol) return;
		var col = lastcol;
		htable.handsontable('setDataAtCell',0,col,undefined);
		htable.handsontable('setDataAtCell',1,col,undefined);
		htable.handsontable('setDataAtCell',2,col,undefined);
		htable.handsontable('setDataAtCell',3,col,undefined);
		htable.handsontable('setDataAtCell',4,col,undefined);
		htable.handsontable('setDataAtCell',5,col,undefined);
		htable.handsontable('setDataAtCell',6,col,undefined);
		htable.handsontable('setDataAtCell',7,col,undefined);
		htable.handsontable('setDataAtCell',8,col,undefined);

	});

	// Ha van egy üres vagy undefined, akkor oda töltse be az adatot
	gjson.on('table-add',function(e,data){
		gjson.fire('table-clear');
		lastcol = null;
		var data = e.data.feature.properties
		   ,col = 1,b
		;
		for(col = 1;col<=2;col++){
			b = true;
			for(var row=0;row<=8;row++){
				var val = htable.handsontable('getDataAtCell',row,col);
				if(val == "" || typeof val === 'undefined') b=false;
			}
			if(!b) break;
		}
		htable.handsontable('setDataAtCell',0,col,data.name_asci);
		htable.handsontable('setDataAtCell',1,col,data.pop11*1000);
		htable.handsontable('setDataAtCell',2,col,data.dens11);
		htable.handsontable('setDataAtCell',3,col,data.pop_change_btw_2001_2011_rel);
		htable.handsontable('setDataAtCell',4,col,data.pop_change_btw_2011_2030_rel);
		htable.handsontable('setDataAtCell',5,col,data.total_fertility_rate_2011);
		htable.handsontable('setDataAtCell',6,col,data.ageing_measured_by_mean_age);
		htable.handsontable('setDataAtCell',7,col,data.share_of_growth_of_55_2001_2011_in_total_population);
		htable.handsontable('setDataAtCell',8,col,data.share_of_growth_of_70_2001_2011_in_total_population);
	});


});
