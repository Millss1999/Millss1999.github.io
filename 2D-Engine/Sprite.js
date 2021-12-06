//Sprite.js

function Sprite(scene, imageSource, width, height){
	
	//attributes
	this.scene = scene;
	this.canvas = scene.canvas;
	this.context = this.canvas.getContext("2d");
	this.image = new Image();
	this.image.src = imageSource;
	this.width = width;
	this.height = height;
	//positional
	this.x = 0; this.y = 0; //center of image (based on image center)
	this.dx = 0; this.dy = 0;
	this.ddx = 0; this.ddy = 0;
	this.imageAngle = 0; //radians
	this.moveAngle = 0;  //radians
	this.speed = 0;
	this.visible = true;
	this.boundAction = "stop";  //stop, wrap, bounce, die
	this.obstacleAction = "stop";
	this.canMove = true;
	this.boundingBox = new Array(4);
	this.nextBox = new Array(4); //top, right, bot, left
	this.path; //boolean for value of pathAvailable()
	this.gravity = 1;
	this.isGrounded = false; //boolean for if sprite is standing on a surface
	this.hitHead = false;
	this.enterLeft = false;
	this.enterRight = false;
	this.jumpFlag;
	
	//methods
	this.draw = function(){
		var localContext = this.context;
		localContext.save();
		
		//change context origin
		localContext.translate(this.x, this.y);
		localContext.rotate(this.imageAngle);
		
		localContext.drawImage(this.image, -1 * (this.width / 2), -1 * (this.height / 2), this.width, this.height);
		localContext.restore();
	}
	
	this.update = function(){
		//preliminaries before moving
		this.updateNextBox();
		this.checkObstacles();
		this.checkFloor();
		this.checkHead();
		this.checkGravity();
		this.enteringLeft();
		this.enteringRight();
		this.path = this.pathAvailable(); //check if any collisions with obstacles
		//console.log("dY: " + this.dy + " Grounded: " + this.isGrounded + " Path: " + this.path + " Hit head: " + this.hitHead); //DEBUG
		//console.log("Enter left: " + this.enterLeft + " Enter right: " + this.enterRight); 
		
		if(this.hitHead){
			this.x += parseInt(this.dx);
			this.y += 10;
			if(this.dy < 15 && this.dy > -15)
				this.dy += 5;
			this.y += parseInt(this.dy);
		}
		else if(this.enterLeft){
			this.x -= 5;
		}
		else if(this.enterRight){
			this.x += 5;
		}
		//move if Sprite can move
		else if(this.path || this.jumpFlag){
			this.x += parseInt(this.dx);
			this.y += parseInt(this.dy); //only move in y direction if there is no roof/floor
			this.checkBounds();
		}
		else{
			//do not allow movement
		}
		this.jumpFlag = false;
		if(this.isGrounded)
			this.dy = 0;
		//draw if visible
		if(this.visible)
			this.draw();
	}
	
	this.checkBounds = function(){
		//determine which side Sprite "exits"
		var offLeft = false;
		var offRight = false;
		var offTop = false;
		var offBot = false;
		
		if(this.x > this.canvas.width + this.scene.left) //off right
			offRight = true;
		if(this.x < this.scene.left) //off left
			offLeft = true;
		if(this.y < this.scene.top) //off top
			offTop = true;
		if(this.y > this.canvas.height + this.scene.top)
			offBot = true;
		//change Sprite motion/pos based on boundAction
		if(this.boundAction == "stop"){
			if(offBot || offLeft || offRight){
				this.setSpeed(0);
			}
		}
		else if(this.boundAction == "wrap"){
			if(offTop)
				this.y = parseInt(this.canvas.height) + parseInt(this.top)
			else if(offBottom)
				this.y = this.top;
			else if(offRight)
				this.x = this.left;
			else if(offLeft)
				this.x = parseInt(this.canvas.width) + parseInt(this.left)
		}
		else if(this.boundAction == "bounce"){ //invert dx or dy
			if(offTop || offBot){
				this.dy = -1 * this.dy;
				this.calcAngle();
			}
			else if(offLeft || offRight){
				this.dx = -1 * this.dx;
				this.calcAngle();
			}
		}
		else if(this.boundAction == "die"){
			//remove from screen + stop
			this.setVisible(false);
			this.setSpeed(0);
		}
		else{
			
		}
	} //end check bounds
	
	this.setImage = function(newImageSource){
		this.image.src = newImageSource;
	}
	
	this.setPos = function(x, y){
		this.x = x;
		this.y = y;
	}
	
	this.setMoveState = function(newState){
		this.moveState = newState;
	}
	
	this.increaseX = function(amt){
		if(this.x + parseInt(amt) > this.canvas.width + this.scene.left - 20){ 
			//if move will make Sprite go off right
			//do nothing
		}
		else
			this.x += parseInt(amt);
	}
	
	this.decreaseX = function(amt){
		if(this.x - parseInt(amt) < this.scene.left + 20){ 
			//if move will make Sprite go off right
			//do nothing
		}
		else
			this.x -= parseInt(amt);
	}
	this.setGravity = function(amt){
			this.gravity = parseInt(amt);
	}
	
	this.increaseY = function(amt){
		this.y += parseInt(amt);
	}
	
	this.decreaseY = function(amt){
		this.y -= parseInt(amt);
	}
	
	this.setDx = function(newDx){
		this.dx = newDx;
	}
	this.setDy = function(newDy){
		this.dy = newDy;
	}
	
	this.setddX = function(newDdx){
		this.ddx = newDdx;
	}
	this.setddY = function(newDdy){
		this.ddy = newDdy;
	}
	
	this.setImageAngle = function(degrees){
		this.imageAngle = degrees * Math.PI / 180;
	}
	
	this.modifyImageAngle = function(modifier){
		//convert to radians
		modifier = modifier * Math.PI / 180;
		this.imageAngle += modifier;
	}
	
	this.setMoveAngle = function(degrees){
		this.moveAngle = degrees * Math.PI / 180;
	}
	
	this.modifyMoveAngle = function(modifier){
		//convert to radians
		modifier = modifier * Math.PI / 180;
		this.moveAngle += modifier;
		this.calcSpeed();
	}
	
	this.setVisible = function(isVisible){
		this.visible = isVisible;
	}
	
	this.setBoundAction = function(bAction){
		this.boundAction = bAction.toLowerCase();
	}
	
	this.setObstacleAction = function(oAction){
		this.obstacleAction = oAction;
	}
	
	this.setSpeed = function(newSpeed){
		this.speed = newSpeed;
		this.dx = newSpeed * Math.cos(this.moveAngle);
		this.dy = newSpeed * Math.sin(this.moveAngle);
	}
	
	this.calcSpeed = function(){
		//calculate dx and dy based on current speed
		this.dx = this.speed * Math.cos(this.moveAngle);
		this.dy = this.speed * Math.sin(this.moveAngle);
	}
	this.calcAngle = function(){
		//calculates speed and moveAngle given dx and dy
		this.speed = Math.sqrt(Math.pow(this.dx, 2) + Math.pow(this.dy, 2)); //pythag thrm
		this.moveAngle = Math.atan2(this.dy, this.dx);
	}
	this.modifySpeed = function(modifier){
		this.speed += modifier;
		this.calcSpeed();
	}
	
	this.setAcceleration = function(newAcc){
		this.ddx = newAcc * Math.cos(moveAngle);
		this.ddy = newAcc * Math.sin(moveAngle);
	}
	
	//calculates bounding box of image + returns array [boxTop, boxRight, boxBot, boxLeft]
	this.getBoundingBox = function(){
		//boxTop
		this.boundingBox[0] = this.y - this.height / 2;
		//boxRight
		this.boundingBox[1] = this.x + this.width / 2;
		//boxBot
		this.boundingBox[2] = this.y + this.height / 2;
		//boxLeft
		this.boundingBox[3] = this.x - this.width / 2;
		
		return this.boundingBox;
	}
	
	this.collidesWith = function(sprite){
		//assume colliding, return false if proven otherwise
		//check if both sprites are visible
		if(this.visible && sprite.visible){
			var myBox = this.getBoundingBox();
			var otherBox = sprite.getBoundingBox();
			
			//check if not colliding
			if((myBox[0] > otherBox[2]) ||  //myTop > theirBot
			   (myBox[2] < otherBox[0]) || //myBot < theirTop
			   (myBox[3] > otherBox[1]) || //myLeft > theirRight
			   (myBox[1] < otherBox[3])){  //myRight < theirLeft
					return false;
			}
			return true; //return true otherwise
		}	
	}
	
	this.checkObstacles = function(){
		for(var i = 0; i < this.scene.obstacles.length; i++)
			if(this.collidesWith(this.scene.obstacles[i]))
				this.canMove = false;
			else
				this.canMove = true;
	}
	
	this.updateNextBox = function(){
		//calculate next frame pos
		var nextX = parseInt(this.x) + parseInt(this.dx); 
		var nextY = parseInt(this.y) + parseInt(5); //was this.dy
		
		//see if there will be collision
		this.nextBox[0] = nextY - this.height / 2;
		this.nextBox[1] = nextX + this.width / 2;
		this.nextBox[2] = nextY + this.height / 2;
		this.nextBox[3] = nextX - this.width / 2;
	}

	this.pathAvailable = function(){
		//check if next Frame causes any collisions with obstacles in scene
		for(var i = 0; i<this.scene.obstacles.length; i++){
			var collision = true;
			var obstacleBox = this.scene.obstacles[i].getBoundingBox();
			
			if( (this.nextBox[0] > obstacleBox[2]) || //if no collision
				(this.nextBox[2] < obstacleBox[0]) ||
				(this.nextBox[3] > obstacleBox[1]) ||
				(this.nextBox[1] < obstacleBox[3])){
					collision = false;
				} 
				
			//also check for oob of canvas if boundAction is stop
			//if leaving via screen top (currently don't check) this.nextBox[0] < this.scene.top) ||
			if(this.boundAction == "stop")
				if((this.nextBox[1] > (this.canvas.width + this.scene.left)) ||	//sprite right > canvas right
				   (this.nextBox[2] > (this.canvas.height + this.scene.top)) ||	//sprite bottom > canvas bottom
				   (this.nextBox[3] < this.scene.left)){		//sprite left < canvas left
						collision = true;
				}
				
			if(collision) //if collision, there is no path
				return false;
		} //end for
		
		return true;		
	}//end pathAvailable
	
	this.jump = function(force){
		this.jumpFlag = true;
		//apply a force in the "upwards" (-y) direction
		toAdd = parseInt(force) * Math.sin(-90);
		//console.log(toAdd); //DEBUG
		if(this.isGrounded){
			if(this.dy + toAdd < -15){
				//do nothing
				this.dy = -15;
			}
			else{
				if(this.dy + toAdd < 0) //only "jump" if it results in moving up
					this.dy += toAdd;
			}
		}
	}//end jump
	
	this.checkGravity = function(){
		//factor in gravity every frame
		if(!(this.isGrounded)){ //if not on platform (in air), apply gravity
			if(this.dy > 15 || this.dy < -15){ //only update if under artificial limit
				//do nothing this.dy += this.gravity; //only modify if not on floor
			}
			else
				this.dy += this.gravity;
		}
/*		else{
			//RESUME --> Find state info about Sprite here
			console.log("Path: " + this.pathAvailable());
			this.dy = 0;
		}
*/
	}//end checkGravity
	
	this.checkFloor = function(){
		//make larger y-axis bounding box to see if sprite is on the ground
		//update isGrounded to reflect that
		this.isGrounded = false;
		var box = this.getBoundingBox();
		//console.log("Sprite box: " +box);
		//get upper + lower bounds
		var botY = box[2] + 5;
		var topY = box[0] - 5;
		var midY = box[2] - this.height;
		var midX = parseInt(box[3]) + parseInt(this.width / 2); //get center point x value of sprite 
		//console.log("Extended bot/top sprite and floor box: " + botY + ", " + topY + ", " + this.scene.obstacles[0].getBoundingBox());
		for(var i = 0; i<this.scene.obstacles.length; i++){
			var obstacleBox = this.scene.obstacles[i].getBoundingBox();
			var exBoxTop = obstacleBox[0] - 10; //extended box top
			var onBox = (midY <= obstacleBox[0] && botY >= obstacleBox[0] && midX >= obstacleBox[3] && midX <= obstacleBox[1]);
			if(onBox){
				this.isGrounded = true;
			}
		}
	}//end checkFloor
	
	this.checkHead = function(){
		this.hitHead = false;
		var box = this.getBoundingBox();
		//get bounds
		var myTop = box[0] - 5;
		var midX = parseInt(box[3]) + parseInt(this.width / 2); //get center point x value of sprite
		var midY = box[0] + 5;
		for(var i = 0; i < this.scene.obstacles.length; i++){
			var obstacleBox = this.scene.obstacles[i].getBoundingBox();
			var midBoxY = obstacleBox[2] - 7;
			var exBoxBot = obstacleBox[2] + 7;
			var onBox = (midY <= exBoxBot && midY >= midBoxY && midX >= obstacleBox[3] - 12 && midX <= obstacleBox[1] + 12);
			if(onBox){
				this.hitHead = true;
			}
		}
	}//end checkHead
	
	this.enteringLeft = function(){
		//check if player attempts to jump into side of platform
		this.enterLeft = false;
		var box = this.getBoundingBox();
		//get bounds
		var myRight = box[1] + 3;
		var myMidX = box[1] - 12;
		var myMidY = box[2] - 12;
		
		for(var i = 0; i < this.scene.obstacles.length; i++){
			var obstacleBox = this.scene.obstacles[i].getBoundingBox();
			var boxLeft = obstacleBox[3] - 3;
			var boxRight = obstacleBox[1] + 3;
			var tryLeft = (myRight >= boxLeft && myMidX <= obstacleBox[3] - 10 && myMidY >= obstacleBox[0] - 4 && myMidY <= obstacleBox[2] + 4); //try to enter left side of platform
			if(tryLeft)
				this.enterLeft = true;
		}
	} //end enteringLeft
	
	this.enteringRight = function(){
		//check if player attempts to jump into side of platform
		this.enterRight = false;
		var box = this.getBoundingBox();
		//get bounds
		var myLeft = box[3] - 3;
		var myMidX = box[1] - 12;
		var myMidY = box[2] - 12;
		
		for(var i = 0; i < this.scene.obstacles.length; i++){
			var obstacleBox = this.scene.obstacles[i].getBoundingBox();
			var boxLeft = obstacleBox[3] - 3;
			var boxRight = obstacleBox[1] + 3;
			var tryRight = (myLeft <= boxRight && myMidX >= obstacleBox[1] + 10 && myMidY >= obstacleBox[0] - 4 && myMidY <= obstacleBox[2] + 4); //try to enter right side of platform
			if(tryRight)
				this.enterRight = true;
		}
	} //end enteringLeft
	
	
} //end Sprite