class GameScreen extends ScreenBase
{
     constructor()
     {
        super();

        // Change the background color
        this.color = '#adff5b';

		// Display the local score
        this.scoreUI = ui.makeText(this, "YOUR SCORE (" + app.name + "): " + app.score, 15, 25, ui.defaultFont.font, ui.defaultFont.color, "left");
     }
	 
	 updatePlayerScores()
	 {
		this.scoreUI.text = "YOUR SCORE (" + app.name + "): " + app.score;
	 }
}