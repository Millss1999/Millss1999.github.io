//Trophy.js
//Sprite modified to support trophy behavior

function Trophy(s, imageSource, w, h){
	z = new Sprite(s, imageSource, w, h);
	//attributes
	z.pickedUp = false;
	z.type = "TROPHY";
	
	//methods
	z.isPickedUp = function(){
		//see if collide with player
		if(this.collidesWith(this.scene.sprites[0])){
			z.pickedUp = true;
		}
	};
	
	z.update = function(){
		//check if picked up
		z.isPickedUp();
		//move if Sprite can move
		this.x += parseInt(this.dx);
		this.y += parseInt(this.dy);
		this.checkBounds();
		
		//draw if visible
		if(this.visible && !(z.pickedUp))
			this.draw();
		else if(this.visible && z.pickedUp && z.type == "TROPHY"){
			this.context.font = "50px Copperplate";
			this.context.strokeText("You Win!", 150, 250);
		}
	};
	
	z.reset = function(){
		z.pickedUp = false;
	}
	
	return z;
};