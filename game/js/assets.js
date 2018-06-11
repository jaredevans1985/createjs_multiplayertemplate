// This object manages our game assets and provides other functionality, such as preloading
var assets = {

    // This variable will store all of the results of our load, and can be queried later
    queue: null,

    // track our load progress to be used as needed
    loadPercentage : 0,

    // This is called from app.js and starts the load
    preloadAssets()
    {
        // Create our manifest of files to load
        // PreloadJS will try to automatically parse what kind of file we're loading 
        // We can consider making a seperate JSON file that has all of this info in it
        manifest = [
            {
                src: "audio/click.mp3",
                id: "click"
            },
            {
                src: "images/particle.png",
                id: "particle"
            },
            {
                src: "images/pigsheet.json",
                id:"pig",
                type:"spritesheet",
                crossOrigin:true
            },
            {
                src: "images/ui/soundbuttons.json",
                id:"soundui",
                type:"spritesheet",
                crossOrigin:true
            },
            {
                src: "audio/music.mp3",
                id: "music"
            },
        ];

        // Set the root filepath for our assets
        this.queue = new createjs.LoadQueue(true, "../media/");
    
        // Use the following to use 'mp3' if 'ogg' doesn't work on browser
        createjs.Sound.alternateExtensions = ["mp3"];

        // Be sure to install the createjs sound plugin or your sounds won't play
        this.queue.installPlugin(createjs.Sound);
        
        // Set some callbacks
        this.queue.on("progress", this.loadProgress, this);
        this.queue.on("fileload", this.fileLoaded, this);
        this.queue.on("complete", this.loadComplete, this);
        this.queue.loadManifest(manifest);
    },

    // When loading is finished, call this function
    loadComplete(event)
    {
        // Do something when loading is complete, for instance, switch the game state
        app.gotoScreen("mainmenu");

        // Start the music
        audio.toggleMusic(true);
    },

    // When an individual file is loaded, call this function
    fileLoaded(event)
    {
        // event.result is the final object that was created after loading 
        //console.log(event.result);   
    },

    // Updates us on the progress of a load
    loadProgress(event)
    {
        // event.loaded gives us the percentage of our load
        assets.loadPercentage = event.loaded / event.total;
    },

    // Return a result from queue (will return 'null' if no result was found with that ID)
    getResult(id)
    {
       var result = this.queue.getResult(id);  
       //console.log(result);
       return result;
    },

};
    