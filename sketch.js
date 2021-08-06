//Create variables here
var dog;
var database;
var foodS;
var foodStock;

var addFood;
var fedTime,lastFed;
var foodObj;

function preload()
{
  //load images here
  dogSad = loadImage("images/dogImg.png");
  dogHappy = loadImage("images/dogImg1.png");
}

function setup() {
  createCanvas(500, 500);
  foodObj = new Food();

  dog = createSprite(250,300,20,50);
  dog.scale = 0.3;
  dog.addImage(dogSad);

  database = firebase.database();
  foodStock=database.ref('Food');
  foodStock.on("value", readStock);

  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
}


function draw() {  
background(46, 139, 87);
foodObj.display();
fedTime=database.ref("feedTime");
fedTime.on("value", function (data){
  lastFed=data.val();
})
fill(255,255,254);
textSize(15);

if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
}else if(lastFed==0){
    text("Last Feed : 12 AM",350,30);
}else{
    text("Last Feed : "+ lastFed + " AM", 350,30);
}
/*if(keyWentDown(UP_ARROW)){
  writeStock(foodS);
  dog.addImage(dogHappy);
  //foodStock-=1;
}
if(keyWentDown(DOWN_ARROW)){
  writeStock(foodS);
  dog.addImage(dogSad);
  //foodStock-=1;
}*/

  foodObj.display();
  drawSprites();
  //add styles here
textSize(20);
fill("pink")
text("Food remaining: " + foodS, 150, 80);
}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

/*function writeStock(x){
  if(x<=0){
    x=0;
  }
  else{
    x-=1;
  }

  database.ref('/').update({
    Food:x
  })
}*/

function feedDog(){
  dog.addImage(dogHappy);
  if(foodObj.getFoodStock()<=0){
    foodObj.updateFoodStock(foodObj.getFoodStock()*0);
  }
  else{
    foodObj.updateFoodStock(foodObj.getFoodStock()-1); 
  }
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    feedTime: hour()
  });
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food: foodS
  })
}
