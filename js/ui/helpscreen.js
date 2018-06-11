class HelpScreen extends ScreenBase
{
     constructor()
     {
        super();

        // Make a title
        ui.makeText(this, "HOW TO PLAY", app.SCREEN_WIDTH / 2, 100, ui.titleFont.font, ui.titleFont.color);

        // Instructions
        ui.makeText(this, "CLICK TO EARN POINTS", app.SCREEN_WIDTH / 2, 250, ui.defaultFont.font, ui.defaultFont.color);
        ui.makeText(this, "CLICK FAST BEFORE TIME IS UP", app.SCREEN_WIDTH / 2, 300, ui.defaultFont.font, ui.defaultFont.color);

        // Make a back button
        var textInfo = { text: "BACK" };
        this.playButton = ui.makeSimpleButton(this, app.SCREEN_WIDTH / 2, 450, 200, 50, textInfo);
        this.playButton.callback = function(evt) {
            app.gotoScreen("mainmenu");
        }

        // Make a set of sound toggles
        ui.makeSoundButtons(this);
     }
}

