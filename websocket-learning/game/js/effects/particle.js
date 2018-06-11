// Define and create a single particle object
function Particle () {
	this.lifetime = 100;
	this.startingLifetime
	this.size = 10;
	this.startScale = 1;
	this.endScale = 0;
	this.startColor = new RGBA(255,0,0,255);
	this.endColor = new RGBA(255,0,0,0);
	this.position = { x: 0, y: 0 };
	this.velocity = { x: 0, y: 0 };
	this.rotation = 0;
	this.rotationRate = 0;
	this.type = "circle";	// "circle", "square", "bitmap", "sprite"
	this.imageID = "";
	this.animID = "";		// Only used for "sprite" types
	this.gradientFill = false;
	this.particleVisual = null;
	
	this.isDead = function() {
		var isDead = this.lifetime <= 0 || (this.shape != null && this.shape.scale <= 0) ;
		return isDead;
	};
	
	this.update = function(dt) {

		this.lifetime -= 1* dt;

		// Initial setup (only run once)
		if (this.particleVisual == null)
		{
			// If this is a shape, set up the shape
			if(this.type == "circle" || this.type == "square")
			{
				// Make a new shape
				this.particleVisual = new createjs.Shape();
				
				// If we're using our start and end colors for a gradient, do that once here
				if (this.gradientFill)
				{
					if(this.type == "square")
					{
						this.particleVisual.graphics.beginLinearGradientFill([this.startColor.str(), this.endColor.str()], [0, 1], this.size*2, this.size*2, 0, this.size*2, this.size*2, this.size);
					}
					else
					{
						this.particleVisual.graphics.beginRadialGradientFill([this.startColor.str(), this.endColor.str()], [0, 1], this.size*2, this.size*2, 0, this.size*2, this.size*2, this.size);
					}

					if(this.type == "square")
					{
						this.particleVisual.graphics.drawRect(0, 0, this.size, this.size);
					}
					else
					{
						this.particleVisual.graphics.drawCircle(0, 0, this.size / 2);
					}
				}
			}
			// If this isn't a shape, but a bitmap, create it here
			// Note: this.imageID must be valid
			else if (this.type == "bitmap")
			{
				this.particleVisual = new createjs.Bitmap(assets.getResult(this.imageID));
			}
			// If this isn't a shape or a bitmap, but a sprite from a spritemap, create it here
			// Note: this.imageID must be valid
			else if (this.type == "sprite")
			{
				this.particleVisual = new createjs.Sprite(assets.getResult(this.imageID));

				// Play the specified animation for this sprite
				this.particleVisual.gotoAndPlay(this.animID);
			}

			// Set our bounds and registration point
			if(this.particleVisual.getBounds() == null) // Bitmaps and Sprites already have bounds
			{
				this.particleVisual.setBounds(0, 0, this.size, this.size);
			}

			// Don't do this for spritesheets should have a registration point already
			if(this.type != "sprite")
			{
				this.particleVisual.regX = this.particleVisual.getBounds().width / 2;
				this.particleVisual.regY = this.particleVisual.getBounds().height / 2;
			}

			// Set this up for later lerping!
			this.startingLifetime = this.lifetime;

			// Set the initial alpha
			this.particleVisual.alpha = this.startColor.a;

			// Set up our alpha fade over time using tweens
			createjs.Tween.get(this.particleVisual)
				.to({ alpha: this.endColor.a, useTicks: true }, this.lifetime * 1000);

			app.stage.addChild(this.particleVisual);
		}
		
		// If we don't have a gradient fill, and we're a shape, then we need to clear 
		// and redraw the visual each frame.
		// This is not ideal, so if we didn't have to do this each frame, it'd be better no to.
		if(!this.gradientFill &&  (this.type == "circle" || this.type == "square"))
		{
			this.particleVisual.graphics.clear();
			this.particleVisual.graphics.beginFill(lerpColor(this.endColor, this.startColor, this.lifetime / this.startingLifetime).str());
			
			if(this.type == "square")
			{
				this.particleVisual.graphics.drawRect(0, 0, this.size, this.size);
			}
			else
			{
				this.particleVisual.graphics.drawCircle(0, 0, this.size / 2);
			}
		}

		// Scale over time
		var curScale = lerp(this.endScale, this.startScale, this.lifetime / this.startingLifetime);
		this.particleVisual.scaleX = curScale;
		this.particleVisual.scaleY = curScale;

		// Set our position and rotation
		this.particleVisual.x = this.position.x;
		this.particleVisual.y = this.position.y;
		this.particleVisual.rotation = this.rotation;

		// Update our position
		this.position.x += this.velocity.x * dt;
		this.position.y += this.velocity.y * dt;

		// Update our rotation
		this.rotation += this.rotationRate * dt;
	};
	
	// Remove this object from the stage
	this.dispose = function() {
		app.stage.removeChild(this.particleVisual);
	};
}

// This object is the emitter that contains all of our particles, and is tracked in app.js
function Emitter () {

	// Emitter settings
	this.particles = [];
	this.maxParticleCount = 100;
	this.emitterRotation = 0;
	this.positionOffsetX = { min: 0, max: 0 };
	this.positionOffsetY = { min: 0, max: 0 };
	this.emitterLifetime = null;
	this.rate = 1;
	this.timeSinceLastSpawn = 0;
	this.burstCount = 0; // NOTE: If this is set, this emitter functions as a burst, and dies when its particles are dead
	this.hasSpawnedAParticle = false;	// Tracks if we've spawn anything yet, used for bursts and spawning the first particle in a stream

	// Particle settings
	this.lifetime = { min: 1, max: 2 };
	this.velocityX = { min: 0, max: 0 };
	this.velocityY = { min: 0, max: 0 };
	this.position = { x: 0, y: 0 };
	this.rotation = { min: 0, max: 0 };
	this.rotationRate = { min: 0, max: 0 };
	this.size = { min: 5, max: 10 }
	this.type = "circle";	// "circle", "square", "bitmap", "sprite"
	this.imageID = "";		// only used if type is "bitmap" or "sprite", must be valid preloaded asset id
	this.animID = "";		// only used if type is "sprite"
	this.gradientFill = false;
	this.startScale = 1;
	this.endScale = 0;

	this.startColor = {
		min: new RGBA(200,80,0,125),
		max: new RGBA(255,160,0,125)
	};
	
	this.endColor = {
		min: new RGBA(220,0,0,0),
		max: new RGBA(255,0,0,0)
	};
	
	// Make a particle based on our settings
	this.spawnParticle = function()
	{
		var p = new Particle();
		p.lifetime = rand(this.lifetime.min, this.lifetime.max);
		p.position = { x: this.position.x + rand(this.positionOffsetX.min, this.positionOffsetX.max),
					y: this.position.y + rand(this.positionOffsetY.min, this.positionOffsetY.max) };
		p.rotation = this.emitterRotation + rand(this.rotation.min, this.rotation.max);
		p.rotationRate = rand(this.rotationRate.min, this.rotationRate.max);
		p.size = rand(this.size.min, this.size.max);
		p.startScale = this.startScale;
		p.endScale = this.endScale;
		p.velocity = { x: rand(this.velocityX.min, this.velocityX.max),
					y: rand(this.velocityY.min, this.velocityY.max) }
		
		p.startColor = randColor(this.startColor.min, this.startColor.max);
		p.endColor = randColor(this.endColor.min, this.endColor.max);
		
		p.type = this.type;
		p.imageID = this.imageID;
		p.animID = this.animID;
		p.gradientFill = this.gradientFill;

		this.particles.push(p);
	}

	// This is the update function for our emitter
	this.update = function(dt) {
		
		// Update each of our particles, and clean them up if they're dead
		this.particles.forEach(function(p,i,array) {
			if (p.isDead()) {
				p.dispose();
				array.splice(i,1);
			} else {
				p.update(dt);
			}
		});
		
		// How long since the last particle was spawned
		this.timeSinceLastSpawn += 1 * dt;

		// Only run this logic if we're a burst
		if(this.burstCount > 0)
		{
			// Only run this 
			if (this.particles.length <= 0 && !this.hasSpawnedAParticle)
			{
				this.hasSpawnedAParticle = true;
				for (var i = 0; i < this.burstCount; i++)
				{
					this.spawnParticle();
				}
			}
		}
		// Spawn particles to match our rate, but don't go over our limit
		else if(this.particles.length < this.maxParticleCount && this.timeSinceLastSpawn >= 1 / this.rate)
		{
			this.timeSinceLastSpawn = 0;

			this.spawnParticle();
		}
		// If we're here, create the first particle for our stream
		// Otherwise the stream wouldn't spawn a particle right away
		else if (!this.hasSpawnedAParticle)
		{
			this.hasSpawnedAParticle = true;

			this.spawnParticle();
		}

		// Check to see if this emitter is dead
		if (this.emitterLifetime)
		{
			this.emitterLifetime -= 1 * dt;
			if(this.emitterLifetime <= 0 )
			{
				this.kill();
			}
		}
		// Check to see if this is a burst emitter whose particles are all dead
		else if(this.burstCount > 0 && this.particles.length <= 0)
		{
			this.kill();
		}
	};

	// When called, this function kills all of the particles for this emitter, and then destroys the emitter
	this.kill = function()
	{
		this.particles.forEach(function(p,i,array) {
			p.dispose();
			array.splice(i,1);
		});

		var myIndex = app.particleSystem.indexOf(this);
		app.particleSystem.splice(myIndex, 1);
		
	}
}

// This effects object contains functions to build all of our effects as needed
var effects = {

	// Add a new emitter to the particle system and return the new object
	getNewEmitter: function()
	{
		var newEmitter = new Emitter();
		app.particleSystem.push( newEmitter );
		return newEmitter;
	},

	// Clear all particles from the particle system
	clearAllParticles: function()
	{
		app.particleSystem.forEach(emitter => {
			emitter.kill();
		});
	},

	// Example emitter creator function
	// --------------
	//
	// Feel free to copy and uncomment this example function to create your own
	//
	// To use it, simply call the function from anywhere,
	// and a new emitter will be added to the app particle system.
	//
	//exampleEmitter: function(position)	// You can add more arguments. Position can be an object reference for tracking
	//{
	//	// Get a new emitter
	//	var newEmitter = this.getNewEmitter();
	//
	//	// Define the settings for this emitter and its particles
	//	// Note that almost all of these settings have defaults,
	//	// so omit the ones you don't need.
	//
	//	// Emitter settings	
	// 	this.maxParticleCount = 100;	// Maximum number of particles allowed in the system, default is 100
	// 	this.position = { x: 0, y: 0 };	// Where this emitter is, used as origin for particles
	// 	this.positionOffsetX = { min: 0, max: 0 };	// a range for how far from the emitter origin a particle can spawn
	// 	this.positionOffsetY = { min: 0, max: 0 };	// a range for how far from the emitter origin a particle can spawn
	//	this.emitterRotation = 0;	// The rotation of this emitter, applied to particles spawned from it
	// 	this.emitterLifetime = null;	// If this is set to a value, how many seconds should this emitter exist
	// 	this.rate = 1;	// The rate at which this emitter spawns particles
	// 	this.burstCount = 0; 	// NOTE: If this is set, this emitter functions as a burst,
	// 							// spawning the number of particles in burst count at once,
	// 							// and dies when all of its particles are dead. It will not
	// 							// have the standard before of other emitters
	//
	// 	// Particle settings
	// 	this.lifetime = { min: 1, max: 2 };		// a range of how long in seconds a particle can exist
	// 	this.velocityX = { min: 0, max: 0 };	// a range for x velocity assigned randomly on creation
	// 	this.velocityY = { min: 0, max: 0 };	// a range for y velocity assigned randomly on creation		
	//	this.rotation = { min: 0, max: 0 };		// a range for initial rotation (degrees)
	//	this.rotationRate = { min: 0, max: 0 };	// a range for the rate of rotation each frame (degrees)
	// 	this.size = { min: 5, max: 10 };		// a range of how big this particle can be (does not apply to sprites)
	// 	this.type = "circle";	// What kind of particle is it? "circle", "square", "bitmap", "sprite"
	//	this.imageID = "";		// Only used if type is "bitmap" or "sprite", used to get the image result from assets
	//	this.animID = "";		// Only used if type is "sprite"
	// 	this.gradientFill = false;	// If true, will use the start and end colors to create a gradient
	// 	this.startScale = 1;	// What scale these particles start at (1 = 100%)
	// 	this.endScale = 0;	// What scale these particles will interpolate to over their lifetime (1 = 100%)
	//
	// 	// A range of colors that this particle will start with
	// 	this.startColor = {
	// 		min: new RGBA(200,80,0,125),
	// 		max: new RGBA(255,160,0,125)
	// 	};
	//	
	// 	// A range of colors that this particle will end with
	// 	this.endColor = {
	// 		min: new RGBA(220,0,0,0),
	// 		max: new RGBA(255,0,0,0)
	// 	};
	//
	// },

	// This is a basic emitter that constantly creates particles at a given rate
	basicStream: function(position)
	{
		// Get a new emitter
		var newEmitter = this.getNewEmitter();

		// Define the settings for this emitter
		newEmitter.lifetime = { min: 1, max: 2 };
        newEmitter.position = position;
        newEmitter.positionOffsetX = { min: -3, max: 3 };
        newEmitter.positionOffsetY = { min: -3, max: 3 };
        newEmitter.velocityY = { min: -100, max: 100 };
        newEmitter.velocityX = { min: -100, max: 100 };
        newEmitter.size = { min: 10, max: 15 };
		newEmitter.rate = 10;

        newEmitter.startColor = {
            min: new RGBA(230,50,0,255),
            max: new RGBA(255,230,0,255)
        };
        
        newEmitter.endColor = {
            min: new RGBA(255,255,255,0),
            max: new RGBA(255,255,255,0)
        };
	},

	// A basic burst that creates a given number of particles all at once and dies when those particles do
	basicBurst: function(position)
	{
		// Find where our new emitter should go and create it
		var newEmitter = this.getNewEmitter();

		// Define the settings for this emitter
		// Because we define a burstCount for this emitter, it will function as a burst
		// The emitter will automatically kill itself after its particles are dead
		newEmitter.burstCount = 15;
		newEmitter.lifetime = { min: 1, max: 2 };
		newEmitter.type = "square";
        newEmitter.position = position;
        newEmitter.positionOffsetX = { min: -3, max: 3 };
        newEmitter.positionOffsetY = { min: -3, max: 3 };
        newEmitter.velocityY = { min: -100, max: 100 };
        newEmitter.velocityX = { min: -100, max: 100 };
		newEmitter.size = { min: 10, max: 15 };
		newEmitter.emitterRotation = 45;
		newEmitter.rotation = { min: 0, max: 360 };
		newEmitter.rotationRate = { min: 90, max: 180 };
		newEmitter.endScale = 0.75;

        newEmitter.startColor = {
            min: new RGBA(0,50,230,255),
            max: new RGBA(0,230,255,255)
        };
        
        newEmitter.endColor = {
            min: new RGBA(255,255,255,0),
            max: new RGBA(255,255,255,0)
        };
	},

	// A basic image particle stream that uses a preloaded bitmap image instead of a shape
	basicImageParticleStream: function(position)
	{
		// Get a new emitter
		var newEmitter = this.getNewEmitter();

		// Define the settings for this emitter
		// This particle uses an image
		// The type must be set to either "bitmap" or "sprite"
		// You must then provide a valid asset ID
		newEmitter.type = "bitmap";
		newEmitter.imageID = "particle";
		newEmitter.lifetime = { min: 10, max: 2 };
        newEmitter.position = position;
        newEmitter.positionOffsetX = { min: -3, max: 3 };
        newEmitter.positionOffsetY = { min: -3, max: 3 };
        newEmitter.velocityY = { min: -100, max: 100 };
        newEmitter.velocityX = { min: -100, max: 100 };
        newEmitter.radius = { min: 30, max: 45 };
		newEmitter.rate = 10;
		newEmitter.rotation = { min: 0, max: 360 };
		newEmitter.rotationRate = { min: 90, max: 180 };
		newEmitter.startScale = 0.5;

		// Note: even though we don't need a color, the alpha value is used to fade the image
		newEmitter.startColor = {
            min: new RGBA(255,255,255,0.5),
            max: new RGBA(255,255,255,0.5)
		};
		
        newEmitter.endColor = {
            min: new RGBA(255,255,255,0),
            max: new RGBA(255,255,255,0)
        };
	},

};
