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
    .add([{
      name: "sprite",
      url: "images/match3_db16.png"
    }, ])
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

    //Assigning the variable to the newly created sprite from json
    explorer = new Sprite(id["explorer.png"]);

    //setting position of explorer
    explorer.x = 68;
    explorer.y = stage.height / 2 - explorer.height / 2; // <-- centering horizontally
    // explorer.y = 100;
    explorer.vx = 0;
    explorer.vy = 0;

    //Add the converted sprite texture to the stage
    stage.addChild(explorer);

    //Assigning the variable to the newly created sprite from json
    treasure = new Sprite(id["treasure.png"]);

    //setting position of explorer
    treasure.x = 400;
    treasure.y = stage.height / 2 - explorer.height / 2; // <-- centering horizontally

    //Add the converted sprite texture to the stage
    stage.addChild(treasure);


    //Tell the renderer to render the stage
    renderer.render(stage);

    //Capture the keyboard arrow keys
    var left = keyboard(37),
      up = keyboard(38),
      right = keyboard(39),
      down = keyboard(40);

    //Left arrow key `press` method
    left.press = function() {
      //Change the char velocity when the key is pressed
      explorer.vx = -5;
      explorer.vy = 0;
    };
    //Left arrow key `release` method
    left.release = function() {
      //If the left arrow has been released, and the right arrow isn't down,
      //and the char isn't moving vertically:
      //Stop the char
      if (!right.isDown && explorer.vy === 0) {
        explorer.vx = 0;
      }
    };

    //Up
    up.press = function() {
      explorer.vy = -5;
      explorer.vx = 0;
    };
    up.release = function() {
      if (!down.isDown && explorer.vx === 0) {
        explorer.vy = 0;
      }
    };

    //Right
    right.press = function() {
      explorer.vx = 5;
      explorer.vy = 0;
    };
    right.release = function() {
      if (!left.isDown && explorer.vy === 0) {
        explorer.vx = 0;
      }
    };

    //Down
    down.press = function() {
      explorer.vy = 5;
      explorer.vx = 0;
    };
    down.release = function() {
      if (!up.isDown && explorer.vx === 0) {
        explorer.vy = 0;
      }
    };

    //Set the game state
    state = play;

    //Start the game loop
    gameLoop();

    //Enabling Multiplayer
    setInterval(function(){
      socket.emit("movement_x_from_client", explorer.x);
      socket.emit("movement_y_from_client", explorer.y);
    }, 50);

      socket.on('movement_x_from_server', function(data) {
        explorer.x = data;
      });

      socket.on('movement_y_from_server', function(data) {
        explorer.y = data;
      });

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

    //Update the current game state
    state();

    //Render the stage
    renderer.render(stage);
  }

  // function enableMultiplayer(){
  //   //enabling multiplayer
  //
  //   // setInterval(socket.emit("movement_x_from_client", explorer.x), 100);
  //   // setInterval(socket.emit("movement_y_from_client", explorer.y), 100);
  //
  //   socket.emit("movement_x_from_client", explorer.x);
  //   socket.emit("movement_y_from_client", explorer.y);
  //
  // }


  //The keyboard helper function
  function keyboard(keyCode) {
    var key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = function(event) {
      if (event.keyCode === key.code) {
        if (key.isUp && key.press) key.press();
        key.isDown = true;
        key.isUp = false;
      }
      event.preventDefault();
    };

    //The `upHandler`
    key.upHandler = function(event) {
      if (event.keyCode === key.code) {
        if (key.isDown && key.release) key.release();
        key.isDown = false;
        key.isUp = true;
      }
      event.preventDefault();
    };

    //Attach event listeners
    window.addEventListener(
      "keydown", key.downHandler.bind(key), false
    );
    window.addEventListener(
      "keyup", key.upHandler.bind(key), false
    );
    return key;
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
