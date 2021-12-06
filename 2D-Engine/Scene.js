//Scene.js
var keys = new Array(105);
var mousePos = new Array(2);

function Scene(){
	
	//attributes
	this.width = 300; //default values
	this.height = 300;
	this.left = 8;
	this.top = 8;
	this.sprites = [];
	this.fps = 20; //default
	this.obstacles = [];
	//this.mouseButtons = []; maybe needed
	//this.mousePos = new Array(2); //{x,y} mouse position in canvas
	this.mousePressed;
	//canvas
	this.canvas = document.createElement("canvas");
	this.context = this.canvas.getContext("2d");
	this.context.strokeRect(0, 0, this.canvas.width, this.canvas.height);
	document.body.appendChild(this.canvas);
	
	//methods
	this.start = function(){
		//initialize keys
		this.initKeys();
		//set event handlers
		//keyboard
		document.onkeydown = this.updateKey;
		document.onkeyup = this.clearKey;
		//mouse
		document.onmousedown = function(){
			this.mousePressed = true;
		}
		document.onmouseup = function(){
			this.mousePressed = false;
		}
		document.onmousemove = this.updateMouse;
		
		//setInterval(update, 1000 / this.fps);
	} //end start
	
	this.update = function(){
		//clear canvas
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.context.strokeRect(0, 0, this.canvas.width, this.canvas.height);
	}
	
	this.clear = function(){
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.context.strokeRect(0, 0, this.canvas.width, this.canvas.height);
	}
	this.setSize = function(width, height){
		this.width = width;
		this.height = height;
		this.canvas.width = this.width;
		this.canvas.height = this.height;
	}
	
	this.setPos = function(l, t){
		this.left = l;
		this.top = t;
	}
	
	this.setFps = function(rate){
		this.fps = rate;
	}
	this.initKeys = function(){
		//set all keys to false to start
		for(var i = 0; i < keys.length; i++)
			keys[i] = false;
	}
	
	this.updateKey = function(event){
		keys[event.keyCode] = true;
	}
	
	this.clearKey = function(event){
		keys[event.keyCode] = false;
	}

	//updates mousePos in Canvas
    this.updateMouse = function(event){
		this.mouseX = event.pageX; //mouse position in page
		this.mouseY = event.pageY;
	}
	
	this.getMousePos = function(){
		//return mouse position in Canvas
		return [this.mouseX - this.left, this.mouseY - this.top];
	}
	
	this.setColor = function(color){
		this.canvas.style.backgroundColor = color;
	}
	
	this.hideMouse = function(){
		this.canvas.style.cursor = "none";
	}
	
	this.showMouse = function(){
		this.canvas.style.cursor = "default";
	}
	
	this.addObstacle = function(obstacle){
		this.obstacles.push(obstacle);
	}
	
	this.addSprite = function(sprite){
		this.sprites.push(sprite);
	}
	
	this.nextLevel = function(levelInfo){
		//remove all current sprites + update scene with new sprites, "next level"
		var newSprites = levelInfo[0];
		var newObstacles = levelInfo[1];
		this.sprites = newSprites;
		this.obstacles = newObstacles;
	}
} //end Scene
	
	
	
//keypress values
K_A = 65; K_B = 66; K_C = 67; K_D = 68; K_E = 69; K_F = 70; K_G = 71;
K_H = 72; K_I = 73; K_J = 74; K_K = 75; K_L = 76; K_M = 77; K_N = 78;
K_O = 79; K_P = 80; K_Q = 81; K_R = 82; K_S = 83; K_T = 84; K_U = 85;
K_V = 86; K_W = 87; K_X = 88; K_Y = 89; K_Z = 90;
K_LEFT = 37; K_RIGHT = 39; K_UP = 38;K_DOWN = 40; K_SPACE = 32;