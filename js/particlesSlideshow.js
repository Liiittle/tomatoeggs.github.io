var self = window;
 
;(function(self) {
		
	var canvas,
		context, 
		particles = [], 
		text = [], 
		nextText = [], 
		shape = {}, 
		mouse = { x: -99999, y: -99999 }, 
		currentTransition = 'circle', 
		left, right, 
		layout = 0, 
		type = ['circle'], 
		FPS = 60,

		words = [ 'love you 小 猪 仔','happy  birthday' ],
		
		colors = {
			circle: [ '#c0392b', '#ff7e15' ]
		};

	function init() {
		
		var slideshowContainer = document.querySelector('.ip-slideshow');
		
		canvas = document.createElement('canvas');
					
        canvas.width = innerWidth;
		canvas.height = innerHeight;
		
        slideshowContainer.appendChild(canvas);

		if(!!(capable)) {
		
			context = canvas.getContext('2d');
		
			if('ontouchmove' in window) {
				canvas.addEventListener('touchup', onTouchUp, false);
				canvas.addEventListener('touchmove', onTouchMove, false);	
			}
			else {
				canvas.addEventListener('mousemove', onMouseMove, false);
			}

			
			window.onresize = onResize;
			
			createParticles();

			setTimeout(function(){

				layout = 1-layout;
				
				onResize();

			},10000);

			setTimeout(function(){

				var img = document.createElement('img');
				img.src = "img/doubi.jpg";
				img.classList.add("round_photo");
				slideshowContainer.appendChild(img);

				$('img').fadeIn(2000);

				setTimeout(function(){

					$('img').fadeOut(2000);
				},3000);

			},20000);
		}
		else 
		{
			console.error('Sorry, switch to a better browser to see the gift for zy from wy');
		}
        
	}

	function capable() {
		return canvas.getContext && canvas.getContext('2d');
	}
	
	function onResize() {
	
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		
		nextText = [];
		updateText();
		updateText2();	
	}
	
	function scrollX() {
		return window.pageXOffset || window.document.documentElement.scrollLeft; 
	}
	
	function scrollY() {
		return window.pageYOffset || window.document.documentElement.scrollTop;
	}

	function onMouseMove(event) {
		event.preventDefault();		
		mouse.x = event.pageX - ( scrollX() + canvas.getBoundingClientRect().left );
		mouse.y = event.pageY - ( scrollY() + canvas.getBoundingClientRect().top );
	}
	
	function onTouchUp(event) {
		event.preventDefault();	

		mouse = { 
			x: -99999, 
			y: -99999 
		};
	}
	
	function onTouchMove(event) {
		event.preventDefault();	
		mouse.x = event.touches[0].pageX - ( scrollX() + canvas.getBoundingClientRect().left );
		mouse.y = event.touches[0].pageY - ( scrollY() + canvas.getBoundingClientRect().top );
	}

	function createParticles() {
			
		for(var quantity = 0, len = 200; quantity < len; quantity++) {
				
			var x, y, steps, 
			
			steps = Math.PI * 2 * quantity / len;
			
			x = canvas.width * 0.5 + 10 * Math.cos(steps);
			y = 180 + 10 * Math.sin(steps);
			
			var radius = randomBetween(0, 12);
			var hasBorn = radius > 0 || radius < 12 ? false : true;
			
			var color = colors.circle[~~(Math.random() * colors.circle.length)];
			
			particles.push({
			
				x: x,
				y: y,
				
				hasBorn: hasBorn,
				
				ease: 0.04 + Math.random() * 0.06,
				bornSpeed: 0.07 + Math.random() * 0.07,
				
				alpha: 0,
				maxAlpha: 0.7 + Math.random() * 0.4,
				
				radius: radius,
				maxRadius: 12,
				
				color: color,
				interactive: false,
				
				angle: 0,
				
				steps: steps
				
			});
			
		}
		
		updateText();	
		updateText2();
		loop();
	
	}
	
	function createTextParticles(seed) {
		
		for(var quantity = 0, len = seed; quantity < len; quantity++) {
		
			var radius = randomBetween(0, 12);
			var hasBorn = radius > 0 || radius < 12 ? false : true;
			
			var color = colors.circle[~~(Math.random() * colors.circle.length)];
			
			text.push({
			
				x: canvas.width * 0.5,
				y: canvas.height - 70,
					
				hasBorn: hasBorn,
				
				ease: 0.04 + Math.random() * 0.06,
				bornSpeed: 0.07 + Math.random() * 0.07,
				
				alpha: 0,
				maxAlpha: 0.7 + Math.random() * 0.4,
				
				radius: radius,
				maxRadius: 12,
				
				color: color,
				interactive: false
												
			});
		
		}
	
	}

	function updateText() {
	
		clear();
		
		context.font = 100 + 'px Lato, Arial, sans-serif';
		context.fillStyle = 'rgb(255, 255, 255)';		
		context.textAlign = 'center';
		
		var strip = words[layout].toUpperCase().split('').join(String.fromCharCode(8202));
		
		context.fillText(strip, canvas.width * 0.5, 120);
			
		var surface = context.getImageData(0, 0, canvas.width, canvas.height);
				
		for(var width = 0; width < surface.width; width += 4) {
			
			for(var height = 0; height < surface.height; height += 4) {
				
				var color = surface.data[(height * surface.width * 4) + (width * 4) - 1];
					
				if(color === 255) {
							
					nextText.push({
						
						x: width,
						y: height,
						
						orbit: randomBetween(1, 3),
						angle: 0
							
					});
						
				}
					
			}
				
		}
			
		var seed = nextText.length;
		
		// Recreate text particles, based on this seed
		createTextParticles(seed);
		
	}

	function updateText2() {
	
		clear();
		
		context.font = 150 + 'px Lato, Arial, sans-serif';
		context.fillStyle = 'rgb(255, 255, 255)';		
		context.textAlign = 'center';
		
		var strip = "wy          zy".toUpperCase().split('').join(String.fromCharCode(8202));
		
		context.fillText(strip, canvas.width * 0.5, canvas.height-100);
			
		var surface = context.getImageData(0, 0, canvas.width, canvas.height);
				
		for(var width = 0; width < surface.width; width += 4) {
			
			for(var height = 0; height < surface.height; height += 4) {
				
				var color = surface.data[(height * surface.width * 4) + (width * 4) - 1];
					
				if(color === 255) {
							
					nextText.push({
						
						x: width,
						y: height,
						
						orbit: randomBetween(1, 3),
						angle: 0
							
					});
						
				}
					
			}
				
		}
			
		var seed = nextText.length;
		
		createTextParticles(seed);
		
	}
	
	function updateTransition() {
				
		/* --- Shapes ---- */		
		[].forEach.call(particles, function(particle, index) { 
			
			switch(currentTransition) {
			
				case 'circle':
				
					// shape.x = canvas.width * 0.5 + 140 * Math.sin(particle.steps);
					// shape.y = 180 + 140 * Math.cos(particle.steps);

					var x_old =  canvas.width * 0.5 + 70 * (2*Math.cos(particle.steps) - Math.cos(2*particle.steps)); //a(2cost-cos2t) 
					var y_old =  70 * (2*Math.sin(particle.steps) - Math.sin(2*particle.steps));  // a(2sint-sin2t) 

					shape.x = canvas.width * 0.5 + y_old;
					shape.y =  canvas.width - x_old - (canvas.width - canvas.height)/2

					break;
					
				default: break;
			
			}
			
			if(!particle.interactive) {
				
				particle.x += ((shape.x + Math.cos(particle.angle) * 5) - particle.x) * 0.08;
				particle.y += ((shape.y + Math.sin(particle.angle) * 5) - particle.y) * 0.08;
										
			}
				
			else {
					
				particle.x += ((mouse.x + Math.sin(particle.angle) * 30) - particle.x) * 0.08;
				particle.y += ((mouse.y + Math.cos(particle.angle) * 30) - particle.y) * 0.08;
									
			}
				
			particle.angle += 0.08;
		
		});
				
		[].forEach.call(nextText, function(particle, index) {
		
			if(!text[index].interactive) {
			
				text[index].x += ((particle.x + Math.cos(particle.angle + index) * particle.orbit) - text[index].x) * 0.08;
				text[index].y += ((particle.y + Math.sin(particle.angle + index) * particle.orbit) - text[index].y) * 0.08;

			}
			
			else {

				text[index].x += ((mouse.x + Math.sin(particle.angle) * 30) - text[index].x) * 0.08;
				text[index].y += ((mouse.y + Math.cos(particle.angle) * 30) - text[index].y) * 0.08;
			
			}
			
			particle.angle += 0.08;
		
		});
		
		if(nextText.length < text.length) {
		
			var extra = [].slice.call(text, nextText.length, text.length);
			
			for(var index = 0; index < extra.length; index++)
			
				text.splice(index, 1);
				
		}
		
	}
	
	function loop() {
		clear();
		update();
		render();

		requestAnimFrame(loop);
	}
	
	/*
	 * Clear the whole screen.
	 */
	 
	function clear() {
		context.clearRect(0, 0, canvas.width, canvas.height);
	}
	
	/*
	 * Update the particles.
	 */
	
	function update() {
		
		updateTransition();
		
		[].forEach.call(particles, function(particle, index) {
		
			particle.alpha += (particle.maxAlpha - particle.alpha) * 0.05;
				
			if(particle.hasBorn) {
			
				particle.radius += (0 - particle.radius) * particle.bornSpeed;
				
				if(Math.round(particle.radius) === 0) {
					
					// Color transition
					switch(currentTransition) {
					
						case 'circle':
						
							particle.color = colors.circle[~~(Math.random() * colors.circle.length)];
							
							break;
						
						default: break;
					
					} 
					
					particle.hasBorn = false;
			
				}
				
			}
		
			if(!particle.hasBorn) {
			
				particle.radius += (particle.maxRadius - particle.radius) * particle.bornSpeed;
						
				if(Math.round(particle.radius) === particle.maxRadius)
				
					particle.hasBorn = true;
				
			}
					
			distanceTo(mouse, particle) <= particle.radius + 30 ? particle.interactive = true : particle.interactive = false;
		
		});
		
		[].forEach.call(text, function(particle, index) {
		
			particle.alpha += (particle.maxAlpha - particle.alpha) * 0.05;
				
			if(particle.hasBorn) {
			
				particle.radius += (0 - particle.radius) * particle.bornSpeed;
				
				if(Math.round(particle.radius) === 0)
					
					particle.hasBorn = false;
				
			}
		
			if(!particle.hasBorn) {
			
				particle.radius += (particle.maxRadius - particle.radius) * particle.bornSpeed;
						
				if(Math.round(particle.radius) === particle.maxRadius)
				
					particle.hasBorn = true;
				
			}
					
			distanceTo(mouse, particle) <= particle.radius + 30 ? particle.interactive = true : particle.interactive = false;
		
		});
		
	}
	
	function render() {
		
		[].forEach.call(particles, function(particle, index) {
		
			context.save();
			context.globalAlpha = particle.alpha;
			context.fillStyle = particle.color;
			context.beginPath();
			context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
			context.fill();
			context.restore();
		
		});
		
		[].forEach.call(text, function(particle, index) {
		
			context.save();
			context.globalAlpha = particle.alpha;
			context.fillStyle = 'rgb(255, 255, 255)';
			context.beginPath();
			context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
			context.fill();
			context.restore();
		
		});
		
	}
	
	function distanceTo(pointA, pointB) {
		var dx = Math.abs(pointA.x - pointB.x);
		var dy = Math.abs(pointA.y - pointB.y);
		
		return Math.sqrt(dx * dx + dy * dy);
	}

	function randomBetween(min, max) {
		return ~~(Math.random() * (max - min + 1) + min);
	}
	
	window.requestAnimFrame = (function() {
	 
		return  window.requestAnimationFrame       || 
				window.webkitRequestAnimationFrame || 
				window.mozRequestAnimationFrame    || 
				window.oRequestAnimationFrame      || 
				window.msRequestAnimationFrame     || 
			  
				function(callback) {
			  
					window.setTimeout(callback, 1000 / FPS);
				
				};
			  
    })();

	window.addEventListener ? window.addEventListener('load', init, false) : window.onload = init;
	
})(self);