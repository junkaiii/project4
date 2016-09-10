function setup_full_sprite() {
  // //Converting images to sprite to render in renderer - long version
  // var cat = new PIXI.Sprite(
  //   PIXI.loader.resources["catImage"].texture
  // );

  //Converting images to sprite to render in renderer - short version
  var cat = new Sprite(resources["sprite"].texture);

  //Add the converted cat sprite texture to the stage
  stage.addChild(cat);

  //Tell the renderer to render the stage
  renderer.render(stage);

}


function setup_partial_sprite() {

  //Load file into texture cache - must use relative path and not aliases
  var texture = TextureCache["images/match3_db16.png"];

  //Create a rectangle object that defines the position and size of the sub-image you want to extract from the texture
  var rectangle = new Rectangle(16, 16, 16, 16);

  //Tell the texture to use that rectangular section
  texture.frame = rectangle;

  //Create the sprite from the texture
  var brick = new Sprite(texture);

  //Sets scale size
  brick.scale.set(3, 3);


  //Add the converted cat sprite texture to the stage
  stage.addChild(brick);

  // //To remove the cat sprite from stage
  // stage.removeChild(anySprite);

  // //To change the cat sprite to invisible
  // cat.visible = false;

  //Tell the renderer to render the stage
  renderer.render(stage);
}
