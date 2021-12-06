//Door.js
//Sprite modified to support door behavior (change scene when enter door)

function Door(s, imageSource, w, h){
	d = new Sprite(s, imageSource, w, h);
	//attributes
	d.keyStatus = false; //does sprite have key
	d.spriteEntered = false; //has sprite successfully entered door
	d.nextImage = 1;
	d.images = ["door1", "door2", "door3", "door4", "door5"];
	
	//methods
	d.update = function(){
		//check if sprite has key
		d.getKeyStatus();
		//check if sprite has entered door
		d.hasSpriteEntered();
		//move if Sprite can move
		this.x += parseInt(this.dx);
		this.y += parseInt(this.dy);
		this.checkBounds();
		
		//draw if visible
		if(this.visible)
			this.draw();
	};
	
	d.draw = function(){
		var localContext = this.context;
		localContext.save();
		
		//change context origin
		localContext.translate(this.x, this.y);
		localContext.rotate(this.imageAngle);
		
		if(d.keyStatus){
			/*if(d.nextImage < 5)
				d.nextImage += parseInt(1);
			this.image.source = "./images/doors/door" + String(d.nextImage) + ".png";
			*/
			this.setImage("./images/doors/door5.png");
			localContext.drawImage(this.image, -1 * (this.width / 2), -1 * (this.height / 2), this.width, this.height);
		}
		else{
			this.image.source = "./images/doors/door1.png";
			localContext.drawImage(this.image, -1 * (this.width / 2), -1 * (this.height / 2), this.width, this.height);
			
		}
			
		localContext.restore();
	};
	
	d.getKeyStatus = function(){
		//see if player has picked up key
		d.keyStatus = this.scene.sprites[1].pickedUp;
	};
	
	d.hasSpriteEntered = function(){
		if(d.keyStatus && this.scene.sprites[0].collidesWith(this.scene.sprites[2])){
			d.spriteEntered = true;
		}
	};
	
	d.reset = function(){
		d.keyStatus = false;
		d.spriteEntered = false;
		this.setImage("./images/doors/door1.png");
	}
	
	return d;
};
