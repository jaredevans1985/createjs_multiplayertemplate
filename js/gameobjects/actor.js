class Actor {
    constructor(parent, type, imageID, name = "actor", x = 0, y = 0, scaleX = 1, scaleY = 1, rotation = 0)
    {
        // create and parent the image
        
        if(type == "bitmap")
        {
            this._image = new createjs.Bitmap(assets.getResult(imageID));
        }
        else if (type == "sprite")
        {
            this._image = new createjs.Sprite(assets.getResult(imageID));
        }
        parent.addChild(this._image);

        // Set the name
        this._name = name;

        // Set the position and rotation
        this._position = {x: x, y: y};
        this._rotation = rotation;

        // Set the atributes of the image
        this._image.x = this._position.x;
        this._image.y = this._position.y;
        this._image.scaleX = scaleX;
        this._image.scaleY = scaleY;
        this._image.rotation = this._rotation;    // degrees

        // Set a central reg x point (only need to do this for bitmaps)
        if(type == "bitmap")
        {
            this._image.regX = this._image.getBounds().width/2;
            this._image.regY = this._image.getBounds().height/2;
        }
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

    playAnimation(animID, gotoAndStop = false)
    {
        if(gotoAndStop)
        {
            this._image.gotoAndStop(animID);
        }
        else
        {
            // Only play if we aren't already playing
            if(this._image.currentAnimation != animID)
            {
                this._image.gotoAndPlay(animID);
            }
        }        
    }

    update(dt)
    {
        // Update our position and rotation
        this._image.x = this._position.x;
        this._image.y = this._position.y;
        this._image.rotation = this._rotation;
    }

    draw(dt)
    {
        // Any special draw code we need
    }

}