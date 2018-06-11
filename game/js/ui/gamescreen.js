class GameScreen extends ScreenBase
{
     constructor()
     {
        super();

        // Change the background color
        this.color = '#adff5b';

		// Display the local score
        this.scoreUI = ui.makeText(this, "YOUR MOVES (" + app.name + "): " + app.score, 15, 25, "15px Titan One", ui.defaultFont.color, "left");
     }
	 
	 updatePlayerScores()
	 {
		var updatedText =  "YOUR SCORE (" + app.name + "): " + app.score;
		
		for(var i = 0; i < app.gameObjects.length; i++)
		{
			if (app.name !== app.gameObjects[i].name) {
				updatedText += "\n" + app.gameObjects[i].name + ": " + app.gameObjects[i].moveCount;
			}
		}
		
		this.scoreUI.text = updatedText;
	 }
}