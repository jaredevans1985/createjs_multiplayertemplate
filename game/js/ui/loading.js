class LoadingScreen extends ScreenBase
{
     constructor()
     {
        super();

        //Create a text object
        ui.makeText(this, "LOADING", app.SCREEN_WIDTH /2, app.SCREEN_HEIGHT /2 - 50, ui.titleFont.font, ui.titleFont.color);

        // Add a fillbar
        var fillbarBack = new createjs.Shape();
        fillbarBack.graphics.beginFill(ui.colors.dark).drawRect(app.SCREEN_WIDTH /2 - 105, app.SCREEN_HEIGHT /2 + 20, 210, 50);
        this.addChild(fillbarBack);

        this.fillbar = new createjs.Shape();
        this.fillbar.graphics.beginFill(ui.colors.light).drawRect(app.SCREEN_WIDTH /2 - 100, app.SCREEN_HEIGHT /2 + 25, 0, 40);
        this.addChild(this.fillbar);

        // Add Percentage Text
        this.percentText = ui.makeText(this, ((assets.loadPercentage * 100) + "%"), app.SCREEN_WIDTH /2 + 5, app.SCREEN_HEIGHT /2 + 45, ui.defaultFont.font, ui.defaultFont.color);
     }

     updateFillbar(percent)
     {
        this.fillbar.graphics.beginFill(ui.colors.light).drawRect(app.SCREEN_WIDTH /2 - 100, app.SCREEN_HEIGHT /2 + 25, 200 * percent, 40);
        var nicePercent = (assets.loadPercentage * 100) | 0;
        this.percentText.text = nicePercent + "%";
    }

     update(dt)
     {
         this.updateFillbar(assets.loadPercentage);
     }
};