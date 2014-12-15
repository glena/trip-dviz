"use strict";function createFloatingText(a,b){var c=$(document.createElement("div"));return c.html(a),c.addClass(b),c.appendTo("body"),c}function fadeOutNext(){$(this).hide("fade",{},500),$("#floatingBackground").hide("fade",{},500,function(){$(this).remove(),$(".floatingName").remove()}),$("#info").show("fade",{},500)}function positionCity(a){$("#city-name").html(a.country+" - "+a.name),map.setView([a.latitude,a.longitude],13)}function slideInNext(a,b){createFloatingText(a.country+" - "+a.name,"floatingName").show("slide",{direction:b?"left":"right"},1e3,fadeOutNext),positionCity(a)}function slideOutCurrent(a,b){$(this).hide("slide",{direction:b?"right":"left"},1e3),slideInNext.apply(this,[a,b])}function fadeInCurrent(a,b,c){createFloatingText("","floatingBackground").attr("id","floatingBackground").height($(window).height()).show("fade",{},500),createFloatingText(a.country+" - "+a.name,"floatingName").show("fade",{},500,function(){slideOutCurrent.apply(this,[b,c])})}function toDegrees(a){return 180*a/Math.PI}function toRadians(a){return a*Math.PI/180}function getBoundingBox(a,b,c){var d=6371;a=parseFloat(a),b=parseFloat(b);var e=a-toDegrees(c/d),f=b-toDegrees(c/d/Math.cos(toRadians(a))),g=a+toDegrees(c/d),h=b+toDegrees(c/d/Math.cos(toRadians(a)));return{sw:{lat:e,lng:f},ne:{lat:g,lng:h}}}function showPointInfo(a){$("#point-photo").hide(),$("#point-widget").show();var b=new panoramio.PhotoRequest({rect:getBoundingBox(a.latitude,a.longitude,.1)}),c=$("body").width(),d={width:500>c?c-10:500},e=new panoramio.PhotoWidget("point-widget",b,d);e.setPosition(0),$("#nav").hide(),$("#point-name").html(a.name),$("#point-description").html(a.description),$("#close-info").addClass("visible"),$("#point-info").addClass("visible"),$("#info").addClass("open").height($(window).height()),$("#map").addClass("blur")}function newInteraction(a,b,c){$("#info").fadeOut(),$(".floatingBackground, .floatingName").fadeOut(function(){$(this).off(),$(this).remove()}),fadeInCurrent(a,b,c)}function loadPoints(a){a.forEach(function(a){markers.addLayer(L.marker([a.latitude,a.longitude],{riseOnHover:!0,icon:Licon}).on("click",function(){showPointInfo(a)}))})}function addCity(a,b){var c=a.country+" - "+a.name;$("<li>"+c+"</li>").appendTo("#city-list ul").click(function(){showLast();var a=loadedCities[currentIndex];if(_gaq.push(["_trackEvent","ShowCity",a.name]),b==currentIndex)return void positionCity(a);var c=loadedCities[b];newInteraction(a,c,currentIndex>b),currentIndex=b})}function readCities(a,b,c,d){if(b===a.length)return void readCountries(c,d+1);var e=a[b];addCity(e,loadedCities.length),loadedCities.push(e);for(var f in e.points)loadPoints(e.points[f]);b++,readCities(a,b,c,d)}function readCountries(a,b){if(b!==a.length){var c=a[b];readCities(c.cities,0,a,b)}}function hidePointInfo(){$("#nav").show(),$("#map").removeClass("blur"),$("#close-info").removeClass("visible"),$("#point-info").removeClass("visible"),$("#info").removeClass("open"),$("#info").css("height","auto"),_gaq.push(["_trackEvent","Close","pointInfo"])}function hideWelcome(){$("#map").removeClass("blur"),$("#welcome").fadeOut(),positionCity(loadedCities[currentIndex]),_gaq.push(["_trackEvent","Close","welcome"])}function jumpPrevCity(){if(showLast(),0!==currentIndex){var a=loadedCities[currentIndex];currentIndex--;var b=loadedCities[currentIndex];newInteraction(a,b,!0),_gaq.push(["_trackEvent","PrevCity",b.name]),$("#nav #next").removeClass("disabled"),0===currentIndex&&$("#nav #back").addClass("disabled")}}function jumpNextCity(){if(showLast(),currentIndex!==loadedCities.length-1){var a=loadedCities[currentIndex];currentIndex++;var b=loadedCities[currentIndex];_gaq.push(["_trackEvent","NextCity",b.name]),newInteraction(a,b,!1),$("#nav #back").removeClass("disabled"),currentIndex===loadedCities.length-1&&$("#nav #next").addClass("disabled")}}function showMap(){$("#city-list").show(),$("#nav #fullmap").hide(),$("#nav #play").show(),_gaq.push(["_trackEvent","ShowMap"]),map.setView([50.107145,8.663789],5,{animate:!0})}function showLast(){$("#city-list").hide(),$("#nav #fullmap").show(),$("#nav #play").hide();var a=loadedCities[currentIndex];_gaq.push(["_trackEvent","BackToCity",a.name]),map.setView([a.latitude,a.longitude],13)}function hideAll(){hidePointInfo(),hideWelcome()}var height=$(window).height(),loadedCities=[],currentIndex=0;$("#welcome").height(height),$("#map").height(height);var map=L.map("map",{maxBounds:[[59.228132,-13.041798],[35.364688,19.653513]],minZoom:4,zoomControl:!1}).setView([50.107145,8.663789],5);L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',{attribution:'<a href="http://germanlena.com.ar">Germán Lena</a>',subdomains: 'abcd',minZoom:0,maxZoom:18}).addTo(map);var Licon=L.icon({iconUrl:"./images/marker-icon.png",iconRetinaUrl:"./images/marker-icon-2x.png",iconSize:[25,41],iconAnchor:[12,41]}),markers=new L.MarkerClusterGroup({removeOutsideVisibleBounds:!1,maxClusterRadius:50});$(document).keydown(function(a){switch(a.which){case 27:hideAll();break;case 37:hideAll(),jumpPrevCity();break;case 39:hideAll(),jumpNextCity()}}),$(document).ready(function(){$.ajax("./data/data.json",{dataType:"json"}).done(function(a){readCountries(a,0),map.addLayer(markers)})}),$("#close-info").click(hidePointInfo),$("#nav #next").click(jumpNextCity),$("#nav #back").click(jumpPrevCity),$("#nav #fullmap").click(showMap),$("#nav #play").click(showLast);
