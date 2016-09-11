$(function() {


  //Socket ---

  var socket = io();
  // var name = prompt("Please enter your name");

  socket.on('connect', function() {
    console.log('connected to socket on client side');
  });

  socket.emit("join", name);

  //Aliases
  var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite,
    Rectangle = PIXI.Rectangle,
    TextureCache = PIXI.utils.TextureCache;

  //Create a stage & renderer add add it to the DOM
  var stage = new Container(),
    renderer = PIXI.autoDetectRenderer(512, 512);

  $('body').append(renderer.view);



  //Loading images into the texture cache
  loader
    .add("images/treasureHunter.json")
    .on("progress", loadProgressHandler)
    .load(setup_json_sprite);


  //Function to console log load progress
  function loadProgressHandler(loader, resource) {

    //Display the file `url` currently being loaded
    // console.log("loading: " + resource.url);
    console.log("loading: " + resource.name); //if name is supplied in .add


    //Display the precentage of files currently loaded
    console.log("progress: " + loader.progress + "%");
  }


  var explorer,
    treasure,
    state;


  function setup_json_sprite() {

    //Converting all files specified into json file into textures
    id = resources["images/treasureHunter.json"].textures;

    //Assigning the variable to the newly created dungeon.png sprite from json
    dungeon = new Sprite(id["dungeon.png"]);

    //Add the converted sprite texture to the stage
    stage.addChild(dungeon);

    socket.on('new player', ){
      
    }

    //Assigning the variable to the newly created sprite from json
    explorer = new Sprite(id["explorer.png"]);


    socket.on('newPositions', function(data) {
      console.log(data[0].x);
      explorer.x = data[0].x;
      explorer.y = data[0].y;
    });

    //Add the converted sprite texture to the stage
    stage.addChild(explorer);

    //Tell the renderer to render the stage
    renderer.render(stage);


    // //Set the game state
    // state = play;

    //Start the game loop
    gameLoop();
  }


  function play() {

    //Use the explorer velocity to make it move
    explorer.x += explorer.vx;
    explorer.y += explorer.vy;

    //restricting the area of movement
    contain(explorer, {
      x: 28,
      y: 10,
      width: 488,
      height: 480
    });

  }

  function gameLoop() {

    //Loop this function 60 times per second
    requestAnimationFrame(gameLoop);

    // //Update the current game state
    // state();

    //Render the stage
    renderer.render(stage);
  }

  //Contain helper function
  function contain(sprite, container) {

    var collision = undefined;

    //Left
    if (explorer.x < container.x) {
      explorer.x = container.x;
      collision = "left";
    }

    //Top
    if (explorer.y < container.y) {
      explorer.y = container.y;
      collision = "top";
    }

    //Right
    if (explorer.x + explorer.width > container.width) {
      explorer.x = container.width - explorer.width;
      collision = "right";
    }

    //Bottom
    if (explorer.y + explorer.height > container.height) {
      explorer.y = container.height - explorer.height;
      collision = "bottom";
    }

    //Return the `collision` value
    return collision;
  }


});
