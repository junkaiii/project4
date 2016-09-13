$(function() {

  var socket = io();

  socket.on('newPositions', function(data) {

  });

  socket.on('socket id', function(data) {
    socket_id = data;
  });


  //Aliases
  var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite,
    Rectangle = PIXI.Rectangle,
    TextureCache = PIXI.utils.TextureCache;


  //Global variables
  var explorer,
    convert,
    treasure,
    state,
    socket_id,
    blob,
    blobs = {};

    var sprite_array = null;



  //Create a stage & renderer add add it to the DOM
  var stage = new Container(),
    renderer = PIXI.autoDetectRenderer(512, 512);

  $('body').append(renderer.view);


  //Loading images into the texture cache
  loader
    .add("images/treasureHunter.json")
    .on("progress", loadProgressHandler)
    .load(setup_background)
    .load(setup_players);


  //Function to console log load progress
  function loadProgressHandler(loader, resource) {

    console.log("loading: " + resource.name);
    console.log("progress: " + loader.progress + "%");

  }

  function setup_background() {
    convert = resources["images/treasureHunter.json"].textures;
    dungeon = new Sprite(convert["dungeon.png"]);
    stage.addChild(dungeon);
  }

  function setup_players() {
    convert = resources["images/treasureHunter.json"].textures;

    socket.on('newPositions', function(data) {
      for (var i = 0; i < data.length; i++) {
        explorer = new Sprite(convert["explorer.png"]);
        if (sprite_array != null){
          sprite_array.destroy();
        }
        //retrieve the socket id
        // sprite_array = {
        //   socket_id : spriteeObj,
        //   socket_id : spriteeObj
        // }
        // if (sprite_array[socket_id] != null){
        //   sprite_array[socket_id].destroy();
        // }
        // sprite_array[socket_id] = explorer;
        console.log(data);
        sprite_array = explorer
        explorer.x = data[i].x;
        explorer.y = data[i].y;
        stage.addChild(sprite_array);
      }
    });

    state = play;

    gameLoop();

  }

  function play() {

  }

  function gameLoop() {

    //Loop this function 60 times per second
    requestAnimationFrame(gameLoop);

    state();

    //Render the stage
    renderer.render(stage);
  }

  document.onkeydown = function(event) {
    if (event.keyCode === 68) //d
      socket.emit('keyPress', {
      inputId: 'right',
      state: true
    });
    else if (event.keyCode === 83) //s
      socket.emit('keyPress', {
      inputId: 'down',
      state: true
    });
    else if (event.keyCode === 65) //a
      socket.emit('keyPress', {
      inputId: 'left',
      state: true
    });
    else if (event.keyCode === 87) // w
      socket.emit('keyPress', {
      inputId: 'up',
      state: true
    });

  };
  document.onkeyup = function(event) {
    if (event.keyCode === 68) //d
      socket.emit('keyPress', {
      inputId: 'right',
      state: false
    });
    else if (event.keyCode === 83) //s
      socket.emit('keyPress', {
      inputId: 'down',
      state: false
    });
    else if (event.keyCode === 65) //a
      socket.emit('keyPress', {
      inputId: 'left',
      state: false
    });
    else if (event.keyCode === 87) // w
      socket.emit('keyPress', {
      inputId: 'up',
      state: false
    });
  };






});
