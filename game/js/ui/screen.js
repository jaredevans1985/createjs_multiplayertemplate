class ScreenBase extends createjs.Container
{
     constructor(c = ui.colors.background, w = app.SCREEN_WIDTH, h = app.SCREEN_HEIGHT)
     {
        super();    

        this._width = w;
        this._height = h;
        this._color = c;

        // Set my bounds and add me to the stage
        this.setBounds(0, 0, this._width, this._height);
        app.stage.addChild(this);

        // Create a shape to fill it
        this._fillShape = new createjs.Shape();
        this._fillShape.graphics.beginFill(this._color).drawRect(0, 0, this._width, this._height);
        this.addChild(this._fillShape);
     }

     get container() { return this._container; }
     set container(containerObj) { this._container = containerObj; }

     get width() { return this._width; }
     set width(w) { this._width = w; this.updateScreenSettings(); }

     get height() { return this._height; }
     set height(h) { this._height = h; this.updateScreenSettings(); }

     get color() { return this._color; }
     set color(c) { this._color = c; this.updateScreenSettings(); }

     updateScreenSettings()
     {
        this._fillShape.graphics.beginFill(this._color).drawRect(0, 0, this._width, this._height);
     }

     update(dt)
     {
         // Feel free to do something in here, we expect this to be overridden
     }
}