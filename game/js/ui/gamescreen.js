class GameScreen extends ScreenBase
{
     constructor()
     {
        super();

        // Change the background color
        this.color = '#adff5b';

        // Make a ui entry to track the number of clicks
        this.scoreUI = ui.makeText(this, "SCORE: " + app.score, 15, 25, ui.defaultFont.font, ui.defaultFont.color, "left");
     }
}