var bubbletron = {
	initialBubbles: 12,
	minRadius: 20,
	maxRadius: 40,
	deltaRange: 6,

	bubbles: [],
	lasers: [],

	init: function() {
		// init canvas
		this.canvas = document.createElement('canvas');
		document.body.appendChild(this.canvas);
		this.resize();

		// init bubbles
		this.bubbles = [];

		for (var i=0; i<this.initialBubbles; i++) {
			var x = Math.random() * this.canvas.width;
			var y = Math.random() * this.canvas.height;
			var r = Math.random() * (this.maxRadius - this.minRadius) + this.minRadius; 
			var dx = Math.random() * this.deltaRange - this.deltaRange/2;
			var dy = Math.random() * this.deltaRange - this.deltaRange/2;
			var c  = Math.random() * 2 > 1 ? "green" : "blue";
			this.bubbles.push({x: x, y: y, r: r, dx: dx, dy: dy, c: c});
		}

		// render once for now	
		var loop = function() {
			this.update();
			this.render();
			requestAnimationFrame(loop);
		}.bind(this);

		loop();
	},

	resize: function() {
		if (this.canvas.width != window.innerWidth) {
			this.canvas.width = window.innerWidth;
		} 
		if (this.canvas.height != window.innerHeight) {
			this.canvas.height = window.innerHeight;
		}
	},

	angleBetweenTwoBubbles: function(b1, b2) {
		return Math.atan2(b2.x - b1.x, b2.y - b1.y);
	},

	dist: function(p1, p2) {
		return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
	},

	updateBubbles: function() {
		for (var i=0; i<this.bubbles.length; i++) {
			var b = this.bubbles[i];
			b.x += b.dx;
			b.y += b.dy;
			if (b.x - b.r < 0) {
				b.dx = -b.dx;
				b.x = b.r;
			} else if (b.x + b.r > this.canvas.width) {
				b.dx = -b.dx;
				b.x = this.canvas.width - b.r;
			}
			if (b.y - b.r < 0) {
				b.dy = -b.dy;
				b.y = b.r;
			} else if (b.y + b.r > this.canvas.height) {
				b.dy = -b.dy;
				b.y = this.canvas.height - b.r;
			}
		}
	},

	updateLasers: function() {
		this.lasers.length = 0;

		var bs = this.bubbles;
		for (var i=0; i<bs.length; i++) {
			var b1 = bs[i];
			for (var j=i+1; j<bs.length; j++) {
				var b2 = bs[j];
				if (b1.c != b2.c) { continue; }
				var threshold = b1.r*3 + b2.r*3;
				if (this.dist(b1, b2) <= threshold) {
					this.lasers.push([b1, b2]);
					b1.dx += (b2.dx * b2.r * 0.0001);
					b1.dy += (b2.dy * b2.r * 0.0001);
					b2.dx += (b1.dx * b1.r * 0.0001);
					b2.dy += (b1.dy * b1.r * 0.0001); 
 				}
			}
		}
	},

	update: function() {
		this.updateBubbles();
		this.updateLasers();
	},

	renderLasers: function() {
		var ctx = this.canvas.getContext('2d');
		var ls = this.lasers;
		for (var i=0; i<ls.length; i++) {
			var l = ls[i];
			var b1 = l[0];
			var b2 = l[1];
			ctx.beginPath();
			ctx.moveTo(b1.x, b1.y);
			ctx.lineTo(b2.x, b2.y);
			ctx.closePath();
			ctx.strokeStyle = b1.c;
			ctx.stroke();
		}
	},

	renderBubbles: function() {
		var ctx = this.canvas.getContext('2d');
		for (var i=0; i<this.bubbles.length; i++) {
			var b = this.bubbles[i];
			ctx.beginPath();
			ctx.arc(b.x, b.y, b.r, 0, 2*Math.PI, false);
			ctx.closePath();
			ctx.fillStyle = b.c;
			ctx.fill();
			ctx.strokeStyle = '#522';
			ctx.stroke();
		}
	},

	clearScreen: function() {
		this.canvas.getContext('2d').clearRect(0, 0, this.canvas.width, this.canvas.height);
	},

	render: function() {
		this.clearScreen();
		this.renderLasers();
		this.renderBubbles();
	}

};

bubbletron.init();