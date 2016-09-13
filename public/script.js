$(function() {

  var socket = io();

  //Aliases
  var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite,
    Rectangle = PIXI.Rectangle,
    BitmapText = PIXI.extras.BitmapText,
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
  var renderer = PIXI.autoDetectRenderer(512, 512, {backgroundColor: 'white'}),
      stage = new Container(),
      game = new Container(),
      preload = new Container();

      game.zIndex = 0;
      preload.zIndex = 10;

      stage.addChild(game);
      stage.addChild(preload);

  $('body').append(renderer.view);


  //Loading images into the texture cache
  loader
    .add("images/treasureHunter.json")
    .add("fonts/font.fnt")
    .on("progress", loadProgressHandler)
    .load(setup_background)
    .load(setup_players)
    .load(setup_mainscreen);



  //Function to console log load progress
  function loadProgressHandler(loader, resource) {

    console.log("loading: " + resource.name);
    console.log("progress: " + loader.progress + "%");

  }

  function setup_background() {
    convert = resources["images/treasureHunter.json"].textures;
    dungeon = new Sprite(convert["dungeon.png"]);
    game.addChild(dungeon);
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
        game.addChild(sprite_array[data[i].id]);
      }
      socket.on('delete player', function(data) {
        console.log(data);
        sprite_array[data].destroy();
      });
    });
    // state = play;
    gameLoop();
}


  function setup_mainscreen() {
    var main_logo = new BitmapText('HELLO\nWORLD', {
      font: "font",
      align: "left"
    });
    main_logo.x = 75;
    main_logo.y = 100;
    var sub_text = new BitmapText('The journey of a\nfull-stack developer!', {
      font: "font",
      align: "center",
    });
    sub_text.height = 0.25 * sub_text.height;
    sub_text.width = 0.25 * sub_text.width;
    sub_text.tint = 0x336600;
    sub_text.x = 70;
    sub_text.y = 245;
    var press_start = new BitmapText('CLICK TO START!', {
      font: "font",
      align: "center",
    });
    press_start.height = 0.25 * press_start.height;
    press_start.width = 0.25 * press_start.width;
    press_start.tint = 0x336600;
    press_start.x = 120;
    press_start.y = 350;
    preload.addChild(main_logo);
    preload.addChild(sub_text);
    preload.addChild(press_start);
    renderer.backgroundColor = '0xCCCCCC';
    renderer.render(preload);
    $(document).keypress(function(){
      main_logo.visible = false;
      preload.visible = false;
      press_start.visible = false;
    });
  }

  function play() {}

  function gameLoop() {
    requestAnimationFrame(gameLoop);
    // state();
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
