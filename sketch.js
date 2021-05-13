var dog,dogImg, happyDog,database,foodS,foodStock;
var feed,add;
var bedroom,garden,washroom;
var Feedtime,Lastfeed,currentTime;
var foodObj;
var gameState,readState;
function preload()
{
	dogImg = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");
  garden=loadImage("images/Garden.png");
  washroom=loadImage("images/Wash Room.png");
  bedroom=loadImage("images/Bed Room.png");
}

function setup() {
	createCanvas(700, 700);
  database = firebase.database();  

  foodObj=new Food();
  dog = createSprite(500,350,50,50);
  dog.addImage(dogImg);
  dog.scale = 0.3;

 

  foodStock = database.ref("Food");
  foodStock.on("value",readStock);

  fedTime=database.ref("FeedTime")
  fedTime.on("value",function(data){
    Lastfeed=data.val();
    });

    readState=database.ref('gameState');
    readState.on("value",function(data){
      gameState=data.val();
    });

  feed = createButton("FEED THE DOG")
  feed.position(700,80)
  feed.mousePressed(FeedDog)
  add = createButton("ADD FOOD")
  add.position(850,80)
  add.mousePressed(addFoods)
}


function draw() {  
  background(46,139,87); 
 
  currentTime=hour();
  if(currentTime==(Lastfeed+1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime==(Lastfeed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(Lastfeed+2) && currentTime<=(Lastfeed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }

 



 if(gameState!="Hungry"){
  feed.hide();
  add.hide();
  dog.remove();
}else{
 feed.show();
 add.show();
 dog.addImage(dogImg);
}

 drawSprites();

 
}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}


function FeedDog(){

  dog.addImage(happyDog)

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);

   database.ref('/').update({
     Food:foodObj.getFoodStock(),
     FeedTime:hour (),
     gameState:"Hungry"
   })
  }
  function addFoods(){
    foodS++;
    database.ref("/").update({
      Food:foodS
    })
  }

  function update(state){
    database.ref('/').update({
      gameState:state
    })
  } 
