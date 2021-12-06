//Player.js
//Sprite modified to support player animation

function Player(s, imageSource, w, h){
	p = new Sprite(s, imageSource, w, h);
	//attributes
	p.moveState = "STAND"; //State of motion: LEFT, RIGHT, STAND
	p.nextImg = 1;
	//images
	p.leftImages = [];
	p.imageL1 = new Image(); p.leftImages.push(p.imageL1); p.leftImages[0].src = "./images/runningMan/manLeft/left1.png";
	p.imageL2 = new Image(); p.leftImages.push(p.imageL2); p.leftImages[1].src = "./images/runningMan/manLeft/left2.png";
	p.imageL3 = new Image(); p.leftImages.push(p.imageL3); p.leftImages[2].src = "./images/runningMan/manLeft/left3.png";
	p.imageL4 = new Image(); p.leftImages.push(p.imageL4); p.leftImages[3].src = "./images/runningMan/manLeft/left4.png";
	p.imageL5 = new Image(); p.leftImages.push(p.imageL5); p.leftImages[4].src = "./images/runningMan/manLeft/left5.png";
	p.imageL6 = new Image(); p.leftImages.push(p.imageL6); p.leftImages[5].src = "./images/runningMan/manLeft/left6.png";
	
	//right images
	p.rightImages = [];
	p.imageR1 = new Image(); p.rightImages.push(p.imageR1); p.rightImages[0].src = "./images/runningMan/manRight/right1.png";
	p.imageR2 = new Image(); p.rightImages.push(p.imageR2); p.rightImages[1].src = "./images/runningMan/manRight/right2.png";
	p.imageR3 = new Image(); p.rightImages.push(p.imageR3); p.rightImages[2].src = "./images/runningMan/manRight/right3.png";
	p.imageR4 = new Image(); p.rightImages.push(p.imageR4); p.rightImages[3].src = "./images/runningMan/manRight/right4.png";
	p.imageR5 = new Image(); p.rightImages.push(p.imageR5); p.rightImages[4].src = "./images/runningMan/manRight/right5.png";
	p.imageR6 = new Image(); p.rightImages.push(p.imageR6); p.rightImages[5].src = "./images/runningMan/manRight/right6.png";
	p.standImage = new Image(); p.standImage.src = "./images/runningMan/manStand.png";

	
	//methods
	p.draw = function(){
		var localContext = this.context;
		localContext.save();
		
		//change context origin
		localContext.translate(this.x, this.y);
		localContext.rotate(this.imageAngle);
		
		p.getNextI();
		if(p.moveState == "STAND"){
			localContext.drawImage(p.standImage, -1 * (this.width / 2), -1 * (this.height / 2), this.width, this.height);
		}
		else if(p.moveState == "RIGHT"){
			localContext.drawImage(p.rightImages[p.nextImg], -1 * (this.width / 2), -1 * (this.height / 2), this.width, this.height);
		}
		else if(p.moveState == "LEFT"){
			localContext.drawImage(p.leftImages[p.nextImg], -1 * (this.width / 2), -1 * (this.height / 2), this.width, this.height);
		}
		//localContext.strokeRect(-1 * (this.width / 2), -1 * (this.height / 2), this.width, this.height + 10); //debug
		localContext.restore();
	};
	
	p.getNextI = function(){
		if(p.nextImg < 5)
			p.nextImg += parseInt(1);
		else
			p.nextImg = 0;
	}
	
	return p;
};
