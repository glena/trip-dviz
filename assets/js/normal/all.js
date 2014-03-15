var height = $(window).height();
$('#map').height(height);

var map = L.map('map').setView([50.10714500,8.66378900], 2);

/*
L.tileLayer('http://{s}.tile.cloudmade.com/2262e8a159bb4e98bec341f62716c75c/54912/256/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
}).addTo(map);
*/

L.tileLayer('http://{s}.tile.cloudmade.com/2262e8a159bb4e98bec341f62716c75c/125104/256/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
}).addTo(map);


$(document).ready(function(){
	$.ajax('/assets/data/data.json',{
		dataType:'json'
	}).done(function( data ) {
		readCountries(data,0);
	});
});



function readCountries(data, index)
{
	if (index == data.length) return;
	var country = data[index];
	readCities(country.cities,0, data, index)
}

function readCities(data,index,country_data,country_index)
{
	if (index == data.length) {
		readCountries(country_data, country_index+1);
		return;
	}

	var city = data[index];

	map.setView([city.latitude, city.longitude], 13);

	for (key in city.points) {
		loadPoints(city.points[key]);
	}

	index++;
	
	//setTimeout(function(){
		readCities(data, index, country_data, country_index);
	//},5000);
}

function loadPoints(data)
{
	data.forEach(function(point){

		L.marker([point.latitude,point.longitude]).addTo(map)
			.bindPopup("<b>"+point.name+"</b><br /><p>"+point.description+"</p>");

	});
}