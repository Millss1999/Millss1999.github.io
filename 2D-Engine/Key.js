//Key.js
//Sprite modified to support key behavior

function Key(s, imageSource, w, h){
	t = new Sprite(s, imageSource, w, h);
	//attributes
	t.pickedUp = false;
	t.type = "KEY";
	
	//methods
	t.isPickedUp = function(){
		//see if collide with player
		if(this.collidesWith(this.scene.sprites[0])){
			t.pickedUp = true;
		}
	};
	
	t.update = function(){
		//check if picked up
		t.isPickedUp();
		//move if Sprite can move
		this.x += parseInt(this.dx);
		this.y += parseInt(this.dy);
		this.checkBounds();
		
		//draw if visible
		if(this.visible && !(t.pickedUp))
			this.draw();
	};
	
	t.reset = function(){
		t.pickedUp = false;
	}
	
	return t;
};