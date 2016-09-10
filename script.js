$(function() {

//Create the renderer
var renderer = PIXI.autoDetectRenderer(500,500);

//Create a container object called the stage
var stage = new PIXI.Container();

//Add the canvas to the HTML doucment
$('body').append(renderer.view);

//Loading images into the texture cache
PIXI.loader
  .add("images/cat.png")
  .load(setup);

function setup(){
  //This code will run when the loader has finished loading the page
  var cat = new PIXI.Sprite(
    PIXI.loader.resources["images/cat.png"].texture
  );

  //Add the cat sprite to the stage
  stage.addChild(cat);

  //Tell the renderer to render the stage
  renderer.render(stage);

}




});
