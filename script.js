$(function() {

//Aliases
var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    reources = PIXI.loader.resources,
    Sprite = PIXI.Sprite;

//Create a stage & renderer add add it to the DOM
var stage = new Container(),
    renderer = PIXI.autoDetectRenderer(500,500);

$('body').append(renderer.view);

//Loading images into the texture cache
loader
  .add("images/cat.png")
  .load(setup);

function setup(){

  // //Converting images to sprite to render in renderer - long version
  // var cat = new PIXI.Sprite(
  //   PIXI.loader.resources["images/cat.png"].texture
  // );

  //Converting images to sprite to render in renderer - short version
  var cat = new Sprite(resources["images/cat"].texture);

  //Add the converted cat sprite texture to the stage
  stage.addChild(cat);

  // //To remove the cat sprite from stage
  // stage.removeChild(anySprite);

  // //To change the cat sprite to invisible
  // cat.visible = false;

  //Tell the renderer to render the stage
  renderer.render(stage);

}




});
