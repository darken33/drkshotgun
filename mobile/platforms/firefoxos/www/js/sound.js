/**
 * sound.js : Script de gestion sonore de "Shotgun Practise"
 * 
 * Par Philippe Bousquet <darken33.free.fr>
 * Ce logiciel est sous license GNU Genral Public License v3.0
 */ 

var sound_loaded = 0;
var gun_snd = "/android_asset/www/sounds/gun_shot.mp3";
var m_gun;
var ready_snd = "/android_asset/www/sounds/ready.mp3";
var m_ready;
var shoot_snd = "/android_asset/www/sounds/shoot.mp3";
var m_shoot;
var perfect_snd = "/android_asset/www/sounds/perfect.mp3";
var m_perfect;
var excellent_snd = "/android_asset/www/sounds/excellent.mp3";
var m_excellent;
var nice_snd = "/android_asset/www/sounds/nice.mp3";
var m_nice;
var average_snd = "/android_asset/www/sounds/average.mp3";
var m_average;
var poor_snd = "/android_asset/www/sounds/poor.mp3";
var m_poor;
var grandma_snd = "/android_asset/www/sounds/grandma.mp3";
var m_grandma;
var ahahah_snd = "/android_asset/www/sounds/ahahah.mp3";
var m_ahahah;

function soundLoaded() {
	console.log('play sound.');
}

function isSoundReady() {
	return (sound_loaded == 10);
}

function soundErr(err) {
	alert(err);
}

function loadSounds() {
	if (isFirefoxOS()) {
		m_gun = document.getElementById("gun_snd");
		m_ready = document.getElementById("ready_snd");
		m_shoot = document.getElementById("shoot_snd");
		m_perfect = document.getElementById("perfect_snd");
		m_excellent = document.getElementById("excellent_snd");
		m_nice = document.getElementById("nice_snd");
		m_average = document.getElementById("average_snd");
		m_poor = document.getElementById("poor_snd");
		m_grandma = document.getElementById("grandma_snd");
		m_ahahah = document.getElementById("ahahah_snd");
		sound_loaded = 10;
	}
	else {
		m_gun = new Media(gun_snd, soundLoaded, soundErr);
		m_ready = new Media(ready_snd, soundLoaded, soundErr);
		m_shoot = new Media(shoot_snd, soundLoaded, soundErr);
		m_perfect = new Media(perfect_snd, soundLoaded, soundErr);
		m_excellent = new Media(excellent_snd, soundLoaded, soundErr);
		m_nice = new Media(nice_snd, soundLoaded, soundErr);
		m_average = new Media(average_snd, soundLoaded, soundErr);
		m_poor = new Media(poor_snd, soundLoaded, soundErr);
		m_grandma = new Media(grandma_snd, soundLoaded, soundErr);
		m_ahahah = new Media(ahahah_snd, soundLoaded, soundErr);
		sound_loaded = 10;
	}
}
