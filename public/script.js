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

    var sprite_array = {};



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
        if (sprite_array[data[i].id] != null) {
          sprite_array[data[i].id].destroy();
        }
        sprite_array[data[i].id] = explorer;
        sprite_array[data[i].id].x = data[i].x;
        sprite_array[data[i].id].y = data[i].y;
        stage.addChild(sprite_array[data[i].id]);
      }
      socket.on('delete player', function(data){
        console.log(data);
        sprite_array[data].visible = false;
      });
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
