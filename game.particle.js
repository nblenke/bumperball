function Particle(x, y, fillColor, strokeColor, type) {
	this.x = x;
	this.y = y;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
	var radius = game.cfg.ball.r,
        switchNum = 4,
		x = Math.random() * 2 * radius - radius,
		ylim = Math.sqrt(radius * radius - x * x),
		y = Math.random() * 2 * ylim - ylim,
        spd = 5;

    this.xvel = 0;
    this.yvel = 0;

    if (type === 'up') {
        switchNum = 2;
    }
    switch(Math.floor(Math.random() * switchNum)) {
    case 0: 
	    this.xvel -= Math.random() * spd;
	    this.yvel -= Math.random() * spd;
	    break;
    case 1: 
	    this.xvel = Math.random() * spd;
	    this.yvel -= Math.random() * spd;
	    break;
    case 2: 
	    this.xvel = Math.random() * spd;
	    this.yvel = Math.random() * spd;
	    break;	
    case 3: 
	    this.xvel -= Math.random() * spd;
	    this.yvel = Math.random() * spd;
	    break;	
    }

    //console.log(this.xvel, this.yvel)
}

Particle.prototype.move = function() {
	this.x += this.xvel;
	this.y += this.yvel;
}


