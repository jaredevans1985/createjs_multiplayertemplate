class Actor {
    constructor(actorParent, name = "actor", color, x = 0, y = 0, scaleX = 1, scaleY = 1, rotation = 0)
    {
        // create and parent the shape
        this._image = new createjs.Shape();
		this._image.graphics.beginFill(color);
		this._image.graphics.drawRect(0, 0, 30, 30);
        actorParent.addChild(this._image);
		this._image.regX = 15;
		this._image.regY = 15;
		
		// create and parent the text
		this._text = new createjs.Text(name, "14px Titan One", '#000000');
		this._text.x = 0; //positions the text
        this._text.y = 0;
        this._text.textAlign = "center";
        this._text.textBaseline = "middle";
        actorParent.addChild(this._text);  //adds the text object to the stage

        // Set the name
        this._name = name;

        // Set the position and rotation
        this._position = {x: x, y: y};
        this._rotation = rotation;
		
		// Movement variables
		this.moveTime = 2;
		this.moveTimer = this.moveTime;
		this.moveStart = {x: x, y: y}; 
		this.moveTarget = {x: x, y: y}; 

        // Set the attributes of the image
        this._image.x = this._position.x;
        this._image.y = this._position.y;
        this._image.scaleX = scaleX;
        this._image.scaleY = scaleY;
        this._image.rotation = this._rotation;    // degrees
    }

    get image() { return this._image; }
    set image(i) { this._image = i; }

    get name() { return this._name; }
    set name(n) { this._name = n; }

    get position() { return this._position; }
    set position(p) { this._position = p; }

    addPosition(x, y)
    {
        this._position.x += x;
        this._position.y += y;
    }

    setScale(scaleX, scaleY)
    {
        this._image.scaleX = scaleX;
        this._image.scaleY = scaleY;
    }
    
    get rotation() { return this._rotation; }
    set rotation(r) { this._rotation = r; }

    getRotationRadians()
    {
        return this._rotation / 360 * 2 * math.PI;    // degrees
    }

    addRotation(rotation)
    {
        this._rotation += rotation;    // degrees
    }
	
	updateTarget(targetPos)
	{
		this.moveTarget = targetPos;
		this.moveStart.x = this._position.x;
		this.moveStart.y = this._position.y;
		this.moveTimer = 0;
	}

    update(dt)
    {
        // Update our position
		if (this.moveTimer <= this.moveTime)
		{
			this._position.x = lerp(this.moveStart.x, this.moveTarget.x, this.moveTimer/this.moveTime);
			this._position.y = lerp(this.moveStart.y, this.moveTarget.y, this.moveTimer/this.moveTime);
			this.moveTimer += dt;
		}
		
        this._image.x = this._position.x;
        this._image.y = this._position.y;
		this._text.x = this._position.x + 0;
        this._text.y = this._position.y + 25;
    }

    draw(dt)
    {
        // Any special draw code we need
    }
	
	kill()
	{
		app.stage.removeChild(this._image);
		app.stage.removeChild(this._text);
	}

}