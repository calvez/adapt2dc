var gdata, styles = {									// This object should come from database
	'dens11' : {
		 'name'   	: "Population density in Central Europe in 2011"
		,'colors' 	: ['rgb(215,48,39)','rgb(252,141,89)','rgb(254,224,144)','rgb(255,255,191)','rgb(224,243,248)','rgb(145,191,219)','rgb(69,117,180)'].reverse()
		,'values' 	: [20,75,100,150,300,700,1700,4359]
		,'unit'	  	: ' Inhabitant / SqKm '
		,'glossary' : '<div>Population density means the number of persons per 1 km<sup>2</sup> of the respective area.</div>'
	}
	,'pop_change_btw_2001_2011_rel': {
		'name' 		: "Relative (%) population change between 2001-2011"
		,'colors'	: ['rgb(178,24,43)','rgb(214,96,77)','rgb(244,165,130)','rgb(209,229,240)','rgb(146,197,222)','rgb(67,147,195)','rgb(33,102,172)'].reverse()
		,'values' 	: [-20,-15,-10,-5,0,5,10,30]
		,'unit' 	: ' %'
		,'glossary' : '<div>The rate and direction of the population change in a given area and interval.</div>'
	}
	,'pop_change_btw_2011_2030_rel' : {
		 'name'   	: "Relative (%) population change between 2011-2030"
		,'colors'	: ['rgb(178,24,43)','rgb(214,96,77)','rgb(244,165,130)','rgb(209,229,240)','rgb(146,197,222)','rgb(67,147,195)','rgb(33,102,172)'].reverse()
		,'values' 	: [-20,-15,-10,-5,0,5,10,30]
		,'unit' 	: ' %'
		,'glossary' : '<div>The rate and direction of the population change in a given area and interval.</div>'
	}
	,'total_fertility_rate_2011' : {
		 'name'   	: "Total fertility rate 2011"
		,'colors'	: ['rgb(254,229,217)','rgb(252,187,161)','rgb(252,146,114)','rgb(251,106,74)','rgb(239,59,44)','rgb(203,24,29)','rgb(153,0,13)'].reverse()
		,'values' 	: [1.03,1.10,1.20,1.30,1.40,1.50,1.60,1.72]
		,'unit' 	: ''
		,'glossary' : '<div>Refers to the number of children that would be born per woman, assuming no female mortality at child bearing ages and the age-specific fertility rates of a specified area and reference period.</div>'
	}
	,'ageing_measured_by_mean_age' : {
		 'name'   	: "Population ageing (2001-2011)"
		,'colors'	: ['rgb(247,252,253)','rgb(204,236,230)','rgb(102,194,164)','rgb(0,88,36)']
		,'values' 	: [-2.2,0,2.5,4,6.8]
		,'alternate'	: ["No ageing", "Slow ageing","Fast ageing","Rapid ageing"]
		,'unit' 	: ' year'
		,'glossary' : '<div>The tempo and pace of ageing in a given area and interval.</div>'
	}
	,'share_of_growth_of_55_2001_2011_in_total_population' : {
		 'name'   	: "Share of growth of 55+ 2001 and 2011 in total population"
		,'colors'	: ['rgb(103,0,31)','rgb(178,24,43)','rgb(214,96,77)','rgb(244,165,130)','rgb(253,219,199)','rgb(247,247,247)','rgb(8,69,148)'].reverse()
		,'values' 	: [-1,0,0.05,0.15,0.25,0.35,0.45,0.5]
		,'unit' 	: ' %'
		,'glossary' : '<div>The change of rate of people aged 55+ in a given area and interval.</div>'
	}
	,'share_of_growth_of_70_2001_2011_in_total_population' : {
		 'name'   	: "Share of growth of 70+ 2001 and 2011 in total population"
		,'colors'	: ['rgb(103,0,31)','rgb(178,24,43)','rgb(214,96,77)','rgb(244,165,130)','rgb(253,219,199)','rgb(247,247,247)','rgb(8,69,148)'].reverse()
		,'values' 	: [-1,0,0.05,0.15,0.25,0.35,0.45,0.51]
		,'unit' 	: ' %'
		,'glossary' : '<div>The change of rate of people aged 70+ in a given area and interval.</div>'
	}
};

jQuery.ajax({
	type : 'GET'
	,dataType: 'JSON'
	,url: 'geojson.json'
	,async: false
	,success: function(data)
	{
		gdata = data;
	}
	,error:function(jqXHR, textStatus, errorThrown){
		console.log(errorThrown);													// Error handlig!!
	}
});
