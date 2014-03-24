'use strict';

var height = $(window).height();
var loadedCities = [];
var currentIndex = 0;


$('#welcome').height(height);
$('#map').height(height);

var map = L.map('map',{
	maxBounds:[[59.228132, -13.041798], [35.364688, 19.653513]],
	minZoom: 4,
	zoomControl:false
}).setView([50.10714500,8.66378900], 5);

L.tileLayer('http://{s}.tile.cloudmade.com/2262e8a159bb4e98bec341f62716c75c/125104/256/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: '<a href="http://germanlena.com.ar">Germán Lena</a>'
}).addTo(map);

var Licon = L.icon({
    iconUrl: '../images/marker-icon.png',
    iconRetinaUrl: '../images/marker-icon-2x.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

var markers = new L.MarkerClusterGroup({
    removeOutsideVisibleBounds:false,
    maxClusterRadius:50
});

function createFloatingText(text, classname) {
	var currentElement = $(document.createElement('div'));
	currentElement.html(text);
	currentElement.addClass(classname);
	currentElement.appendTo('body');
	return currentElement;
}

function fadeOutNext(){
    
	$(this).hide('fade',{}, 500);

	$('#floatingBackground')
		.hide('fade',{}, 500, function(){
			$(this).remove();
			$('.floatingName').remove();
		});
	$('#info').show('fade',{}, 500);
}

function positionCity(city) {
	$('#city-name').html(city.country +' - '+ city.name);
	map.setView([city.latitude, city.longitude], 13);
}

function slideInNext(nextCity, reverse){
	createFloatingText(nextCity.country +' - '+ nextCity.name, 'floatingName')
		.show('slide',{direction:(reverse ? 'left' : 'right')}, 1000, fadeOutNext);

	positionCity(nextCity);
}


function slideOutCurrent(nextCity, reverse){
	$(this).hide('slide',{direction:(reverse ? 'right' : 'left')}, 1000);
	slideInNext.apply(this,[nextCity, reverse]);
}

function fadeInCurrent(currentCity, nextCity, reverse)
{
	createFloatingText('', 'floatingBackground')
		.attr('id', 'floatingBackground')
		.height($(window).height())
		.show('fade',{}, 500);

	createFloatingText(currentCity.country +' - '+ currentCity.name, 'floatingName')
		.show('fade',{}, 500, function(){
			slideOutCurrent.apply(this,[nextCity, reverse]);
		});
}

function toDegrees(angleRadians) {
  return angleRadians * 180 / Math.PI;
}

function toRadians(angleDegrees) {
  return angleDegrees * Math.PI / 180;
}

function getBoundingBox(latitude, longitude, radius)
{
    var R = 6371;  // earth radius in km

    latitude = parseFloat(latitude);
    longitude = parseFloat(longitude);
    
    var sw_lat = latitude - toDegrees(radius/R);
    var sw_lng = longitude - toDegrees(radius/R/Math.cos(toRadians(latitude)));
                                       
    var ne_lat = latitude + toDegrees(radius/R);
    var ne_lng = longitude + toDegrees(radius/R/Math.cos(toRadians(latitude)));
    
    return {sw: { lat: sw_lat , lng: sw_lng }, ne: { lat: ne_lat , lng: ne_lng }};
}


function showPointInfo(data) {
    
    /*if (data.photo)
    {
        $('#point-widget').hide();
        $('#point-photo').attr('alt',data.name)
				    .attr('title',data.name)
				    .attr('src','/images/fotos/'+data.photo)
                    .show();
    }
    else
    {*/
        $('#point-photo').hide();
        $('#point-widget').show();
        var myRequest = new panoramio.PhotoRequest({
          'rect': getBoundingBox(data.latitude,data.longitude,0.1)
        });
        var myOptions = {
          'width': 500
        };
        var widget = new panoramio.PhotoWidget('point-widget', myRequest, myOptions);
        widget.setPosition(0);
    //}
    
    $('#nav').hide();
    $('#point-name').html(data.name);
    $('#point-description').html(data.description);
    $('#close-info').addClass('visible');
    $('#point-info').addClass('visible');
    $('#info').addClass('open').height($(window).height());
    $('#map').addClass('blur');
}


function newInteraction(currentCity, nextCity, reverse)
{
	$('#info').fadeOut();

	$('.floatingBackground, .floatingName').fadeOut(function(){
		$(this).off();
		$(this).remove();
	});

	fadeInCurrent(currentCity, nextCity, reverse);
}

function loadPoints(data)
{
	data.forEach(function(point){

		markers.addLayer(
            L.marker([point.latitude,point.longitude], {riseOnHover: true, icon: Licon})
                .on('click', function(){
                    showPointInfo(point);
                })
        );
	});
}

function addCity(city, position)
{
    var text = city.country +' - '+ city.name;
    $('<li>'+text+'</li>')
        .appendTo('#city-list ul')
        .click(function(){
            showLast();
            var currentCity = loadedCities[currentIndex];
            
            if (position == currentIndex) {
                positionCity(city);
                return;
            }
            
            var nextCity = loadedCities[position];
            newInteraction(currentCity, nextCity, (position < currentIndex));
            currentIndex = position;
        });
}

function readCities(data,index,countryData,countryIndex)
{
	if (index === data.length) {
		readCountries(countryData, countryIndex+1);
		return;
	}

    var city = data[index];
    
    addCity(city, loadedCities.length);
    
    loadedCities.push(city);

	for (var key in city.points) {
		loadPoints(city.points[key]);
	}

	index++;
	
	readCities(data, index, countryData, countryIndex);
}

function readCountries(data, index)
{
	if (index === data.length) {
        return;
    }
	var country = data[index];
	readCities(country.cities,0, data, index);
}

function hidePointInfo() {
    $('#nav').show();
    $('#map').removeClass('blur');
    $('#close-info').removeClass('visible');
    $('#point-info').removeClass('visible');
    $('#info').removeClass('open');
    $('#info').css('height','auto');
}

function hideWelcome()
{
    $('#map').removeClass('blur');
	$('#welcome').fadeOut();
	positionCity(loadedCities[currentIndex]);
}

function jumpPrevCity(){
	
    showLast();
    
	if (currentIndex === 0) {
        return;
    }
	
	var currentCity = loadedCities[currentIndex];
	currentIndex--;
	var nextCity = loadedCities[currentIndex];
	
	newInteraction(currentCity, nextCity, true);

	$('#nav #next').removeClass('disabled');

	if (currentIndex === 0){
		$('#nav #back').addClass('disabled');
	}
}

function jumpNextCity(){

    showLast();
    
	if (currentIndex === loadedCities.length-1) {
        return;
    }
	
	var currentCity = loadedCities[currentIndex];
	currentIndex++;
	var nextCity = loadedCities[currentIndex];

	newInteraction(currentCity, nextCity, false);
	
	$('#nav #back').removeClass('disabled');

	if (currentIndex === loadedCities.length-1){
		$('#nav #next').addClass('disabled');
	}
}

function showMap(){
    $('#city-list').show();
    $('#nav #fullmap').hide();
    $('#nav #play').show();
    map.setView([50.10714500,8.66378900], 5, {animate:true});
}
function showLast() {
    $('#city-list').hide();
    $('#nav #fullmap').show();
    $('#nav #play').hide();
    var city = loadedCities[currentIndex];
    map.setView([city.latitude, city.longitude], 13);    
}

function hideAll()
{
    hidePointInfo();
    hideWelcome();
}

$(document).keydown(function(e){
	switch(e.which)
	{
		case 27:
            hideAll();
            break;
		case 37:
            hideAll();
            jumpPrevCity();
            break;
		case 39:
            hideAll();
            jumpNextCity();
            break;
		default:
            break;//ignore
	}
});

$(document).ready(function(){
	$.ajax('/data/data.json',{
		dataType:'json'
	}).done(function( data ) {
		readCountries(data,0);
        map.addLayer(markers);
	});
});

$('#close-info').click(hidePointInfo);
$('#nav #next').click(jumpNextCity);
$('#nav #back').click(jumpPrevCity);
$('#nav #fullmap').click(showMap);
$('#nav #play').click(showLast);