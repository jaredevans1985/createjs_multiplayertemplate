class EndScreen extends ScreenBase
{
     constructor()
     {
        super();

        // Make a title
        ui.makeText(this, "GAME OVER", app.SCREEN_WIDTH / 2, 100, ui.titleFont.font, ui.titleFont.color);

        // Show num clicks again
        this.scoreUI = ui.makeText(this, "SCORE: " + app.score, app.SCREEN_WIDTH / 2, 250, ui.defaultFont.font, ui.defaultFont.color);

        // Make a replay button
        var textInfo = { text: "PLAY AGAIN" };
        this.playButton = ui.makeSimpleButton(this, app.SCREEN_WIDTH / 2, 375, 200, 50, textInfo);
        this.playButton.callback = function(evt) {
            app.gotoScreen("gameplay");
        }

        // Make a set of sound toggles
        ui.makeSoundButtons(this);
     }
}

