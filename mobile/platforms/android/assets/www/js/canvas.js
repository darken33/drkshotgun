/**
 * accel.js : Script de gestion du canvas de "Shotgun Practise"
 * 
 * Par Philippe Bousquet <darken33.free.fr>
 * Ce logiciel est sous license GNU Genral Public License v3.0
 */ 
var	manifest = [
	{src:"images/bg_sgp.png", id:"back"},
	{src:"images/cible.png", id:"cible"},
	{src:"images/bullet.png", id:"bullet"},
	{src:"images/bullet_hole.png", id:"hole"},
	{src:"images/viseur.png", id:"viseur"}
];

/* Taille de l'écran */
var width;
var height;
/* Les divers objets du canvas */
var ground;
var stage;
var cible;
var cibleImg;
var cibleLength = 158;
var bullet = [];
var bulletImg;
var holesPlan;
var hole = [];
var nbholes = 0
var holeImg;
var viseur;
var viseurImg;
var viseurX;
var viseurY;
var nbtirs = 0;
var startTime = 0;
var stopTime = 0;
var timerG = 5000;
var score = 0;
var second = 1000;

/* gestion du canvas */
var canvasLoaded = false;
var scale = 1;
var xMin=55;
var xCen=0;
var hWidth=0;
var xMax=325;
var yMax=800;
var yMin=-210;
var timer=0;
var timer_thread=null;
var option_valide=false;
var hWindow = 0;
var pIcon = 0;
var bIcon = 0;
var hIcon = 0;
/**
 * Initiailisation du canvas
 */ 
function initCanvas() {
	stage = new createjs.Stage("myCanvas");
	// on conserve la taille originale
	width = stage.canvas.width;
	height = stage.canvas.height;
	// On charge les images
	loader = new createjs.LoadQueue(false);
	loader.addEventListener("complete", handleComplete);
	loader.loadManifest(manifest);
	// On aplique la taille de l'ecran et on calcule le facteur de scale
	$("#myCanvas").attr("height",window.innerHeight);
	if (window.innerWidth >= 1024) { 
		$("#myCanvas").attr("width",1024);
		scale=1024/320;
		icon=128;
	}
	if (window.innerWidth < 1024) {
		$("#myCanvas").attr("width",800);
		scale=800/320;
		icon=128;
	}
	if (window.innerWidth < 800) {
		$("#myCanvas").attr("width",720);
		scale=720/320;
		icon=128;
	}
	if (window.innerWidth < 720) {
		$("#myCanvas").attr("width",640);
		scale=640/320;
		icon=128;
	}
	if (window.innerWidth < 640) {
		$("#myCanvas").attr("width",600);
		scale=600/320;
		icon=128;
	}	
	if (window.innerWidth < 600) {
		$("#myCanvas").attr("width",512);
		scale=512/320;
		icon=64;
	}	
	if (window.innerWidth < 512) {
		$("#myCanvas").attr("width",480);
		scale=480/320;
		icon=64;
	}	
	if (window.innerWidth < 480) {
		$("#myCanvas").attr("width",400);
		scale=400/320;
		icon=64;
	}	
	if (window.innerWidth < 400) {
		$("#myCanvas").attr("width",320);
		scale=320/320;
		icon=64;
	}	
	if (window.innerWidth < 320) {
		$("#myCanvas").attr("width",240);
		scale=240/320;
		icon=32;
	}	
	hWindow = Math.floor(window.innerWidth / 2);
	hIcon = Math.floor(window.innerWidth * 0.8);
	bIcon = hWindow;
	pIcon = Math.floor(window.innerWidth * 0.2);
	hxIcon=Math.floor(icon/2);
}

/**
 * Le canvas est initialisé
 */
function handleComplete() {
	canvasLoaded = true;
	var groundImg = loader.getResult("back");
	// corriger le bug sur android de double affichage du canvas
	ground = new createjs.Shape();
	ground.graphics.beginBitmapFill(groundImg).drawRect(0, 0, stage.canvas.width, stage.canvas.height);
	ground.y = 0;
	ground.x = 0;
	cibleImg = loader.getResult("cible");
	cible = new createjs.Bitmap(cibleImg);
	cible.x = (width - cibleImg.width) / 2;
	cible.y = (height - cibleImg.height) / 2;
	bulletImg = loader.getResult("bullet");
	holeImg = loader.getResult("hole");
	viseurImg = loader.getResult("viseur");
    stage.scaleX = scale;
    stage.scaleY = scale;
}

/**
 * Démarrer la partie
 */
function demarre() {
	$("#message").html("");
	holesPlan = new createjs.Container();
	// correction du bug de double affichage sur Android
	stage.addChild(ground, cible, holesPlan);
	var bx=20;
	for (i = 0; i < 6; i++) {
		bullet[i] = new createjs.Bitmap(bulletImg);
		bullet[i].x = bx;
		bullet[i].y = height - bulletImg.height - 5;
		bx += bulletImg.width + 10;
		stage.addChild(bullet[i]);
	}
	nbholes = 0;
	nbtirs = 0;
	score=0;
	setTimeout(initShoot, 2*second);			
	// on crée la boucle
	createjs.Ticker.timingMode = createjs.Ticker.RAF;
	createjs.Ticker.addEventListener("tick", tick);
}	

function initShoot() {
	$("#message").html(texte_ready[game_options.lang]);
	if (game_options.soundactive) m_ready.play();
	setTimeout(startViseur, 2*second);			
}

function startViseur() {
	$("#message").html(texte_shoot[game_options.lang]);
	if (game_options.soundactive) m_shoot.play();
	viseur = new createjs.Bitmap(viseurImg);
	viseurX = Math.round(Math.random() * width);
	viseurY = Math.round(Math.random() * height);
	viseur.x = viseurX - 16;
	viseur.y = viseurY - 16;
	stage.addChild(viseur);
	startWatch();		
	$('#game').bind("tap", shoot);
	startTime = (new Date()).getTime();
}

function shoot() {
	stopWatch();
	stopTime = (new Date()).getTime();
	if (game_options.soundactive) m_gun.play();
	$("#message").html("");
	stage.removeChild(viseur);
	hole[nbholes] = new createjs.Bitmap(holeImg);
	hole[nbholes].x = viseurX - 9;
	hole[nbholes].y = viseurY - 8;
	holesPlan.addChild(hole[nbholes]);
	nbholes++;
	$('#game').unbind("tap");
	nbtirs++;
	setTimeout(function() {
		calculeLength();
		stage.removeChild(bullet[6-nbtirs]);
		if (nbtirs < 6) {
			setTimeout(initShoot, 2*second);			
		}
		else {
			stage.update();
			endGame();
		}
	}, 1*second);
}

/**
 * Rafraichissement
 */ 
function tick(event) {
	// On met à jour le canvas
	stage.update(event);
}

function calculeLength() {
	//c2 = x2 + y2
	var lx = Math.abs(viseurX - (width / 2));
	var ly = Math.abs(viseurY - (height / 2)); 
	var lg = Math.round(Math.sqrt(lx*lx + ly*ly));
	var sc = Math.round(((cibleLength - lg) / cibleLength) * 10000);
	if (sc < 0) sc = 0;
	var t = timerG - (stopTime - startTime);
	if (t < 0) t = 0;
	score += Math.round((sc * (1+(game_options.difficulty/10))) + t);
	if (sc == 10000) {
		if (game_options.soundactive) m_perfect.play();
		$("#message").html(texte_perfect[game_options.lang]);
	}
	else if (sc >= 8500) {
		if (game_options.soundactive) m_excellent.play();
		$("#message").html(texte_excellent[game_options.lang]);
	}
	else if (sc >= 7000) {
		if (game_options.soundactive) m_nice.play();
		$("#message").html(texte_good[game_options.lang]);
	}
	else if (sc >= 6000) {
		if (game_options.soundactive) m_average.play();
		$("#message").html(texte_average[game_options.lang]);
	}
	else if (sc >= 4000) {
		if (game_options.soundactive) m_poor.play();
		$("#message").html(texte_poor[game_options.lang]);
	}
	else if (sc < 1500) {
		if (game_options.soundactive) m_ahahah.play();
		$("#message").html(texte_ahahah[game_options.lang]);
	}
	else {
		if (game_options.soundactive) m_grandma.play();
		$("#message").html(texte_grandma[game_options.lang]);
	}
}
/**
 * Fin de partie
 */ 
function endGame() {	
	createjs.Ticker.reset();
	stage.removeAllChildren();
	createjs.Ticker.removeAllEventListeners();
	$('body').removeClass("noover");
	$("#score_final").html(score);
	started = false;
	if (game_options.sharescore) service(score);
	setTimeout(showPageScore, 2000);
}
