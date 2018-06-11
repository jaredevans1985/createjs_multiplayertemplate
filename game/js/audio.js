// An object that will manage our audio needs
// TODO:
//  -Store all of our registered sounds so that we can loop through them
//  -When SFX is toggled off, turn off any currently playing sounds
var audio = {

    // Booleans to track the state of our sound effects and musics
    sfxCanPlay : true,
    musicPlaying : true,

    // Play the sound with the given id
    playSound : function(id)
    {
        // Only play if we're allowed to
        if(this.sfxCanPlay)
        {
            createjs.Sound.play( id );
        }
    },

    // Stop the sound with the given id
    stopSound : function(id)
    {
        createjs.Sound.stop( id );
    },

    // Toggle whether sfx can play or not
    toggleSFX : function()
    {
        this.sfxCanPlay = !this.sfxCanPlay;

        // TODO: Turn off any sounds that are currently playing
    },

    // Toggle the music on and off
    toggleMusic : function(forceStart = false)
    {
        // If toggleOn is true, force the music to start
        if(forceStart && this.sfxCanPlay)
        {
            createjs.Sound.play("music", {loop:-1});
            this.musicPlaying = true;
        }
        // Otherwise swap the state
        else 
        {
            if(this.musicPlaying && this.sfxCanPlay)
            {
                createjs.Sound.stop("music");
                this.musicPlaying = false;
                //console.log("stopped music");
            }
            else
            {
                createjs.Sound.play("music", {loop:-1});
                this.musicPlaying = true;
                //console.log("started music");
            }
        }
        
    },

};