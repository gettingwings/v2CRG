class Game {
  constructor(){

    this.playerMoving = false;

  }

  getState(){
    var gameStateRef  = database.ref('gameState');
    gameStateRef.on("value",function(data){
       gameState = data.val();
    })

  }

  update(state){
    database.ref('/').update({
      gameState: state
    });
  }

  async start(){
    if(gameState === 0){
      player = new Player();
      var playerCountRef = await database.ref('playerCount').once("value");
      if(playerCountRef.exists()){
        playerCount = playerCountRef.val();
        player.getCount();
      }
      form = new Form()
      form.display();
    }

    car1 = createSprite(100,200);
    car1.addImage("car1",car1_img);
    car2 = createSprite(300,200);
    car2.addImage("car2",car2_img);
    //car3 = createSprite(500,200);
    // car3.addImage("car3",car3_img);
    // car4 = createSprite(700,200);
    // car4.addImage("car4",car4_img);
    //cars = [car1, car2, car3, car4];
    cars = [car1, car2];
  }

  play(){
    form.hide();
    
    Player.getPlayerInfo();
    player.getCarsAtEnd();
    
    if(allPlayers !== undefined){
      background(0);
      image(track, 0,-displayHeight*4,displayWidth, displayHeight*5);
      
      //var display_position = 100;
      
      //index of the array
      var index = 0;

      //x and y position of the cars
      var x = 175 ;
      var y;

      for(var plr in allPlayers){
        //add 1 to the index for every loop
        index = index + 1 ;

        //position the cars a little away from each other in x direction
        x = x + 200;
        //use data form the database to display the cars in y direction
        y = displayHeight - allPlayers[plr].distance;
        cars[index-1].x = x;
        cars[index-1].y = y;
       // console.log(index, player.index)

       
        if (index === player.index){
          stroke(10);
          fill("red");
          ellipse(x,y,60,60);
          cars[index - 1].shapeColor = "red";
          camera.position.x = displayWidth/2;
          camera.position.y = cars[index-1].y;
        }
       
        //textSize(15);
        //text(allPlayers[plr].name + ": " + allPlayers[plr].distance, 120,display_position)
      }

    }
    if(this.playerMoving){
      player.distance +=5;
      player.update();
    }

    if(keyIsDown(UP_ARROW) && player.index !== null){
      this.playerMoving = true;
      player.distance +=10
      player.update();
    }
   

    if(player.distance > 3660){
      gameState = 2;
      player.rank +=1;
      Player.updateCarsAtEnd(player.rank);
      //this.end();
      this.showRank();
    }
   
    drawSprites();
  }

  end(){
    //console.log("Game Ended");
    console.log(player.name,"   ", player.rank);
    alert(player.name,"   ", player.rank);
  }

  showRank(){


    Swal.fire({
      title: `Awesome! ${player.name} ${'\n'} Your rank is ${player.rank}`,
      text:"You reached the finish line!!",
      imageUrl:"images/trophy.png",
      imageWidth:100,
      imageHeight:100,
      confirmButtonText:"Celebrate",
      confirmButtonColor: '#3085d6',
      confirmButtonWidth: 120,
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          width: 1,
          showConfirmButton: false,
          backdrop: `
            rgba(0,0,123,0.3)
            url("/images/Streamers.gif")
            center
            no-repeat
          `
        }) 

      }
    })
  }


}
