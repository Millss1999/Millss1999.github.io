//Obstacle.js
//Sprite modified to support obstacle (wall) behavior

function Obstacle(s, imageSource, w, h){
	t = new Sprite(s, imageSource, w, h);
	//attributes
	t.moving = false;
	t.boundAction = "bounce";
	
	//methods
	t.update = function(){
		//move if Sprite can move
		this.x += parseInt(this.dx);
		this.y += parseInt(this.dy);
		this.checkBounds();
		
		//draw if visible
		if(this.visible)
			this.draw();
	}
	t.setMoving = function(isMoving){
		t.moving = isMoving
	}
	
	return t;
}