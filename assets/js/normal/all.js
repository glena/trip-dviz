var height = $(window).height();
$('#map').height(height);

var map = L.map('map',{
	maxBounds:[[59.228132, -13.041798], [35.364688, 19.653513]],
	minZoom: 4,
	zoomControl:false
}).setView([50.10714500,8.66378900], 5);

L.tileLayer('http://{s}.tile.cloudmade.com/2262e8a159bb4e98bec341f62716c75c/125104/256/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: 'My ultimo viaje <a href="http://germanlena.com.ar">Germán Lena</a>'
}).addTo(map);


var loadedCities = [];
var currentIndex = 0;

$('#close-info').click(hidePointInfo);

$('#nav #next').click(function(){

	if (currentIndex == loadedCities.length-1) return;
	
	currentIndex++;
	
	positionCity(loadedCities[currentIndex]);

	$('#nav #back').removeClass('disabled');

	if (currentIndex == loadedCities.length-1){
		$(this).addClass('disabled');
	}
});

$('#nav #back').click(function(){
	
	if (currentIndex == 0) return;
	
	currentIndex--;
	
	positionCity(loadedCities[currentIndex]);

	$('#nav #next').removeClass('disabled');

	if (currentIndex == 0){
		$(this).addClass('disabled');
	}
});


function positionCity(city) {
	$('#city-name').html(city.country +' - '+ city.name);
	map.setView([city.latitude, city.longitude], 13);
}

$(document).ready(function(){
	$.ajax('assets/data/data.json',{
		dataType:'json'
	}).done(function( data ) {
		readCountries(data,0);
		positionCity(loadedCities[currentIndex]);
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
	loadedCities.push(city);

	for (key in city.points) {
		loadPoints(city.points[key]);
	}

	index++;
	
	readCities(data, index, country_data, country_index);
}

function loadPoints(data)
{
	data.forEach(function(point){

		L.marker([point.latitude,point.longitude], {riseOnHover: true})
			.addTo(map)
			.on('click', function(){
				showPointInfo(point);
			});

	});
}

function showPointInfo(data) {
    $('#point-name').html(data.name);
    $('#point-description').html(data.description);
    $('#close-info').addClass('visible');
    $('#point-info').addClass('visible');
    $('#info').addClass('open').height($(window).height());
}

function hidePointInfo() {
    $('#close-info').removeClass('visible');
    $('#point-info').removeClass('visible');
    $('#info').removeClass('open');
    $('#info').css('height','auto');
}
