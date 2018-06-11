class GameScreen extends ScreenBase
{
     constructor()
     {
        super();

        // Change the background color
        this.color = '#adff5b';

        // Make a ui entry to track the number of clicks
        this.scoreUI = ui.makeText(this, "SCORE: " + app.score, 15, 25, ui.defaultFont.font, ui.defaultFont.color, "left");

        // Make a timer to show how much time is left
        this.timerUI = ui.makeText(this, "TIME LEFT: " + (((app.maxGameTime - app.gameTime) | 0) + 1), app.SCREEN_WIDTH/2, app.SCREEN_HEIGHT - 25, ui.defaultFont.font, ui.defaultFont.color);

        // Make a set of sound toggles
        ui.makeSoundButtons(this);
     }
}