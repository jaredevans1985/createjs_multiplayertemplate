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
		
		Object.keys(app.allPlayers).forEach(function (id) {
			if (app.allPlayers[id].info.name !== app.name) {
				updatedText += "\n" + app.allPlayers[id].info.name + ": " + app.allPlayers[id].moves;
			}
		});
		
		this.scoreUI.text = updatedText;
	 }
}