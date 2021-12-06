//gameEngine.js
var s;
var man;
var levelCount = 0;
var start = Date.now();
var bestTime = window.localStorage;
if(bestTime.getItem("best") == null){
	bestTime.setItem("best", "9999");
}
console.log(bestTime.getItem("best"));

s = new Scene();
s.setFps(30);
s.setSize(500, 500);
s.setColor("#c9afad");

//obstacles
var levelObs = new Array(4);
levelObs[0] = generateLevel1(); //contains obstacles for level
levelObs[1] = generateLevel2();
levelObs[2] = generateLevel3();
levelObs[3] = generateLevel4();
for(var i = 0; i < levelObs[0].length; i++)
	s.addObstacle(levelObs[0][i]);

man = new Player(s, "./images/runningMan/manStand.png", 24, 48)
man.setPos(50, 250);
man.setSpeed(0); 
s.addSprite(man);

key = new Key(s, "./images/key.png", 50, 50);
key.setPos(100, 240); key.setSpeed(0);
s.addSprite(key);

door = new Door(s, "./images/doors/door1.png", 32, 64);
door.setPos(30, 420); door.setSpeed(0);
s.addSprite(door);

trophy = new Trophy(s, "./images/golden_trophy.png", 64, 64);
trophy.setPos(-999, -999); trophy.setVisible(false);
trophy.type = "TROPHY";

s.start();

var intervalID = setInterval(update, 1000 / s.fps);

function generateLevel1(){
	var levelObstacles = [];
	//floor
	floor = new Obstacle(s, "./images/wall.jpg", 600, 50);
    floor.setPos(250, 470);
	levelObstacles.push(floor);
	//s.addObstacle(floor);
	
	//generate level platforms
	newPlat(levelObstacles, 400, 400, 100);
	newPlat(levelObstacles, 240, 350, 100);
	newPlat(levelObstacles, 370, 240, 30);
	
	return levelObstacles;
}//end generateLevel

function newPlat(obstacles, xPos, yPos, length){
	plat = new Obstacle(s, "./images/wall.jpg", parseInt(length), 40);
	plat.setPos(parseInt(xPos), parseInt(yPos));
	obstacles.push(plat);
	//s.addObstacle(plat);
}//end newPlat

function generateLevel2(){
	//player spawn, door pos, key pos, obstacle pos
	var levelObstacles = [];
	//floor
	floor = new Obstacle(s, "./images/wall.jpg", 600, 50);
    floor.setPos(250, 470);
	levelObstacles.push(floor);
	//s.addObstacle(floor);
	
	//generate level platforms
	newPlat(levelObstacles, 40, 160, 50);
	newPlat(levelObstacles, 250, 350, 50);
	newPlat(levelObstacles, 300, 280, 30);
	newPlat(levelObstacles, 400, 200, 40);
	newPlat(levelObstacles, 180, 400, 50);
	newPlat(levelObstacles, 280, 150, 50);
	newPlat(levelObstacles, 180, 100, 50);
	
	
	return levelObstacles;
}

function generateLevel3(){
	//player spawn, door pos, key pos, obstacle pos
	var levelObstacles = [];
	//floor
	floor = new Obstacle(s, "./images/wall.jpg", 600, 50);
    floor.setPos(250, 470);
	levelObstacles.push(floor);
	
	//generate level platforms
	newPlat(levelObstacles, 400, 350, 50); levelObstacles[1].setDx(-4.7);
	newPlat(levelObstacles, 15, 425, 50);
	newPlat(levelObstacles, 330, 300, 50);
	newPlat(levelObstacles, 370, 250, 50); levelObstacles[4].setDx(-8.5);
	newPlat(levelObstacles, 180, 160, 50);
	
	return levelObstacles;
}

function generateLevel4(){
	//player spawn, door pos, key pos, obstacle pos
	var levelObstacles = [];
	//floor
	floor = new Obstacle(s, "./images/wall.jpg", 600, 50);
    floor.setPos(250, 470);
	levelObstacles.push(floor);
	
	//generate level platforms
	newPlat(levelObstacles, 250, 440, 50);
	
	return levelObstacles;
}

function update(){
	s.clear();
	
	//check keys
	if(keys[K_D]){
			man.setMoveState("RIGHT");
			man.increaseX(4);
	}

	if(keys[K_A]){
			man.setMoveState("LEFT");
			man.decreaseX(4);
	}
	if(keys[K_SPACE]){
			man.setMoveState("STAND");
			man.jump(15);
	}
	if(keys[K_D] == false && keys[K_A] == false && keys[K_SPACE] == false)
		man.setMoveState("STAND");
	if(levelCount == 0){ //keys[K_H]
		if(door.keyStatus && door.spriteEntered) {// lc < 1
			levelCount += parseInt(1);
			man.setPos(30, 40);
			key.reset(); key.setPos(400, 30);
			door.reset(); door.setPos(40, 110);
			//change obstacles
			s.obstacles = levelObs[levelCount];
		}
	}
	if(levelCount == 1){
		if(door.keyStatus && door.spriteEntered){
			levelCount += parseInt(1);
			man.setPos(250, 350);
			key.reset(); key.setPos(230, 30);
			door.reset(); door.setPos(470, 430);
			//change obstacles
			s.obstacles = levelObs[levelCount];
		}
	}
	if(levelCount == 2){
		if(door.keyStatus && door.spriteEntered){
			levelCount += parseInt(1);
			man.setPos(30, 400);
			key.reset(); key.setVisible(false);
			door.reset(); door.setVisible(false);
			//change obstacles
			s.obstacles = levelObs[levelCount];
			trophy.setPos(250, 393);
			trophy.setVisible(true);
			s.addSprite(trophy);
		}
	}
		
	key.update();
	door.update();
	trophy.update();
	man.update();
	for(var i = 0; i < s.obstacles.length; i++)
		s.obstacles[i].update();
		
	if(trophy.pickedUp){
		//stop timer
		var endTime = Date.now() - start;
		endTime = endTime / 1000; //convert to seconds
		console.log(endTime);
		var curBestTime = bestTime.getItem("best");
		if(parseInt(endTime) < parseInt(curBestTime))
			bestTime.setItem("best", String(endTime));
		
		clearInterval(intervalID);
	}
	//current split
	var curSplit = Date.now() - start;
	curSplit = curSplit / 1000;
	document.getElementById("curTime").textContent = "Time: " + String(curSplit);
	//best time
	if(bestTime.getItem("best") == 9999)
		document.getElementById("bestTime").textContent = "Best time: ";
	else
		document.getElementById("bestTime").textContent = "Best time: " + bestTime.getItem("best");
			
	
	
}