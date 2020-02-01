"use strict";

var isMobile = false;
var isMenu = false;
var nav = 0;
var ham = 0;
var navTag = 0;
var navbar = 0;

// convert desktop page to mobile page
function convertDesktop() {
	
	//var container = document.getElementsByTagName("body");
	navbar = document.getElementById("navbar");
	navTag = document.getElementsByTagName("nav");
	
	ham.classList.toggle("hidden");
	navbar.removeChild(nav);

	return true;
}

// I'll work on this later
// toggling mobile to desktop
function convertMobile() {
	if(isMobile) {
		ham.classList.toggle("hidden");
	}
	return false;
}

function onHam(event) {
	navTag[0].classList.toggle("active");
	window.setTimeout(function() { isMenu = true; }, 200); // animation takes 200ms
}

function onWrap(event) {
	if (isMenu) {
		navTag[0].classList.toggle("active");
		isMenu = false;
	}
}

function onResize(event) {
	if(window.innerWidth < 800 && !isMobile) {
		isMobile = this.convertDesktop();
	}
}

// driver function
window.onload = function init() {

	this.console.log("started running...");
	

	ham = document.getElementById("burger");
	nav = document.getElementById("nav"); // saving the nav
	var wrapper = document.getElementById("wrapper");

	if ((/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
		window.innerWidth < 800) && !this.isMobile) {
		this.initFog();
		isMobile = this.convertDesktop(ham);
	} else {
		this.initFogThree(); // from fog-three.js
	}

	window.addEventListener('resize', onResize);
	ham.addEventListener('click', onHam);
	wrapper.addEventListener('click', onWrap);
};