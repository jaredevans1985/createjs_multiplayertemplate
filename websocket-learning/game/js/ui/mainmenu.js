class MainMenu extends ScreenBase
{
     constructor()
     {
        super();

        // Make a title
        ui.makeText(this, "MY GAME NAME", app.SCREEN_WIDTH / 2, 100, ui.titleFont.font, ui.titleFont.color);

        // Make a play button
        var textInfo = { text: "PLAY" };
        this.playButton = ui.makeSimpleButton(this, app.SCREEN_WIDTH / 2, 375, 200, 50, textInfo);
        this.playButton.callback = function(evt) {
            app.gotoScreen("gameplay");
        }

        // Make a help button
        var textInfo = { text: "HELP" };
        this.playButton = ui.makeSimpleButton(this, app.SCREEN_WIDTH / 2, 450, 200, 50, textInfo);
        this.playButton.callback = function(evt) {
            app.gotoScreen("help");
        }

        // Make a set of sound toggles
        ui.makeSoundButtons(this);
     }
}

