
var score;
var bg;
var viewport;
var maxWidth = 8000;
var audio = "sounds/audio.mp3";
var audio_obj;
var menu_audio = "sounds/menu-audio.mp3";
var menu_audio_obj;
var carrot_audio = "sounds/carrot-audio.mp3";
var carrot_audio_obj;
var hurdle_audio = "sounds/hurdle-audio.mp3";
var hurdle_audio_obj ;
var audio_status = true;

function PlayState() {

    var player;
    var carrots;
	var fps;
	var header;
	var text;
	var animation;
	var animation_2;
	var hurdle;
	
	
    this.setup = function() {
		
		score = 0;
		live_info = document.getElementById("live_info");
		if(audio_status){
			
			audio_obj = jaws.assets.get(audio);
			audio_obj.play(); 
		}
        //Viewport of 500x800 (jaws.width x maxHeight)
        viewport = new jaws.Viewport({max_x: maxWidth, max_y: jaws.height});
  
        player = new jaws.Sprite({x: 2, y: 200});
        //player.speed = 4;
		
        //player.dx = 0;
        //player.dy = 0;
		
		player.vx = player.vy = 0;
        player.can_jump = true;
		
        player.move = function() {
			
            //player.x += player.dx;
            //player.y += player.dy;
			
			this.x += this.vx;
		  	this.y += this.vy;
			player.vx = 0;
            //window.alert(player.y);
			viewport.forceInside(player, 38);
			if(player.y >= 311) {
				 
              this.can_jump = true;
			  
			}
			this.vy = 0

            //player.dx = 0;
            //player.dy = 0;
        };


        //carrots properties
        carrots = new jaws.SpriteList();

        for (var i = 1; i < 100; i++) {
			var resy = Math.floor(Math.random() * 100) + 260;
			var resx = Math.floor(Math.random() * 60) + 50;
            carrots.push(new jaws.Sprite({image: "images/carrot.png", x: resx * i, y: resy}));
        }

        carrots.check = function() {

            var results = jaws.collideOneWithMany(player, carrots);

            if (results.length > 0) {
				
				carrot_audio_obj = jaws.assets.get(carrot_audio);
				carrot_audio_obj.play();
                carrots.remove(results[0]);
				score++;
				
            }
        };

        //bg properties
		bg = new jaws.SpriteList()

        for(var i = 0; i < maxWidth / jaws.width ; i++) {
            bg.push( new jaws.Sprite({image: "images/sky-bg.png", x: i*800, y: 0}) )
        }
		
		header = new jaws.Sprite({color: "#59a903", width: 800, height: 30, x: 0, y: 0});
		//text = new jaws.Text({text: "Hello world!", x: 10, y: 50});
		//window.alert(text);
		
		//hurdle
		 hurdle = new jaws.SpriteList();
		var resx = 100;
        for (var i = 1; i < 30; i++) {
			
			resx += Math.floor(Math.random() * 170) + 100;
            hurdle.push(new jaws.Sprite({image: "images/hurdle.png", x: resx , y: 315}));
        }

        hurdle.check = function() {

            var results = jaws.collideOneWithMany(player, hurdle);

            if (results.length > 0) {
				audio_obj.pause();
				hurdle_audio_obj = jaws.assets.get(hurdle_audio);
				hurdle_audio_obj.play();
                jaws.switchGameState(EndState);
				
            }
        };
		//hurdle = new jaws.Sprite({image: "images/hurdle.png", width: 30, height: 60, x: 0, y: 0});
		
		animation = new jaws.Animation({sprite_sheet: "images/player.png", frame_size: [48, 54], frame_duration: 100, orientation: "bottom"});
		animation_2 = new jaws.Animation({sprite_sheet: "images/player-2.png", frame_size: [48, 54], frame_duration: 100, orientation: "bottom"});
		
		player.animation_default = animation.slice(0,1);
		player.animation_left = animation_2.slice(1,6);
		player.animation_right = animation.slice(1,6);
		player.animation_up = animation.slice(7,8);
        //Player properties
		player.setImage( player.animation_default.next() )
		
        jaws.preventDefaultKeys(["up", "down", "left", "right", "space"])
		var tb = document.getElementById("tb");
		tb.innerHTML = "Use arrow keys to move and jump.";

    };
    this.update = function() {

        player.setImage( player.animation_default.next() );
		player.vx = 0;
		
        if (jaws.pressed("up")) {
			//window.alert(player.can_jump);
           	if(player.can_jump) { 
				player.vy = -150;
				player.setImage( player.animation_up.next() );
				player.can_jump = false;  
			}
			
			
			//window.alert(player.can_jump);
        }
        if (jaws.pressed("left")) {
            //player.dx -= player.speed;
			player.vx = -3;
			player.setImage( player.animation_left.next() );
        }
        if (jaws.pressed("down")) {
            //player.dy += player.speed;
        }
        if (jaws.pressed("right")) {
            //player.dx += player.speed;
			player.vx = 3;
			player.setImage( player.animation_right.next() );
        }

       //Gravity
	  if(player.y <= 312){
			player.vy += 2;
	  }
        player.move();
		
		viewport.centerAround(player);
        carrots.check();
		hurdle.check();

    };
    this.draw = function() {
        jaws.clear();
		if(audio_status){
			audio_obj.play();
		}
        viewport.draw(bg);
        viewport.draw(player);
        viewport.draw(carrots);
		viewport.draw(hurdle);
		header.draw();
		
		
		jaws.context.font = "bold 20px courier";
		jaws.context.lineWidth = 10;
		jaws.context.fillStyle =  "Black";
		jaws.context.strokeStyle =  "rgba(200,200,200,0.0)";
		jaws.context.fillText("Score: " + parseInt(score) , 20, 20);
          
    };
};

//Menu State

function MenuState (){
	
	var menu ;
	var index=0;
	
	this.setup = function (){
		menu = ["Start Game", "Settings"];
		if(audio_status){
			if(jaws.assets.get(audio)){
				audio_obj = jaws.assets.get(audio);
				audio_obj.pause();
			}
			menu_audio_obj = jaws.assets.get(menu_audio);
			menu_audio_obj.play();
			//menu_audio_obj.loop(); 
		}
		
		viewport = new jaws.Viewport({max_x: jaws.width, max_y: jaws.height});
		bg = new jaws.Sprite({image: "images/sky-bg.png", x: 0, y: 0});
		var tb = document.getElementById("tb");
		tb.innerHTML = "Use arrow keys | ";
		tb.innerHTML += "Press Enter to Select!";
	}
	
	this.update = function(){
		
		if(jaws.pressed("enter")){
			if(menu[index] == "Start Game"){
				if(audio_status){
					menu_audio_obj = jaws.assets.get(menu_audio);
					menu_audio_obj.pause();
					
				}
				jaws.switchGameState(PlayState);
				this.stop();
			}
			else{
				if(audio_status){
					menu_audio_obj = jaws.assets.get(menu_audio);
					menu_audio_obj.pause();
					
				}
				jaws.switchGameState(SettingState);
				this.stop();
			}
			
		}
		if(jaws.pressed("down")){
			index++;
			if(index > 1){
				index = 1;
			}
		}
		if(jaws.pressed("up")){
			index--;
			if(index < 0){
				index=0;
			}
		}
	};
	this.draw = function(){
		jaws.clear();
		jaws.context.clearRect(0,0,jaws.width,jaws.height);
		viewport.draw(bg);
		if(audio_status){
			menu_audio_obj.play();
		}
		//terminal
		for(var i=0; menu[i] ; i++){
			jaws.context.font = "bold 30px courier";
			jaws.context.lineWidth = 10;
			jaws.context.fillStyle =  index == i? "Black" : "Red";
			jaws.context.strokeStyle =  "rgba(200,200,200,0.0)";
			jaws.context.fillText(menu[i] , 300, 150+(i*40));
		
		}
	}
};

//Setting State

function SettingState (){
	var sound="Sounds: ";
	this.setup = function (){
		viewport = new jaws.Viewport({max_x: jaws.width, max_y: jaws.height});
		bg = new jaws.Sprite({image: "images/sky-bg.png", x: 0, y: 0});
		var tb = document.getElementById("tb");
		tb.innerHTML = "Use Up & Bellow Arrow keys.";
	}
	
	this.update = function(){
		
		if(jaws.pressed("up")){
			if(audio_status){
				audio_status = false;
			}
			else{
				audio_status = true;
			}
		}
		if(jaws.pressed("down")){
			if(audio_status){
				audio_status = false;
			}
			else{
				audio_status = true;
			}
		}
		if(jaws.pressed("esc")){
			jaws.switchGameState(MenuState);
		}
		
	};
	this.draw = function(){
		jaws.clear();
		jaws.context.clearRect(0,0,jaws.width,jaws.height);
		viewport.draw(bg);
		
		jaws.context.font = "bold 30px courier";
		jaws.context.lineWidth = 10;
		jaws.context.fillStyle =  "Black";
		jaws.context.strokeStyle =  "rgba(200,200,200,0.0)";
		jaws.context.fillText( "Sounds:"+(audio_status?"On":"Off"), 300, 150);
		
		jaws.context.font = "18px courier";
		jaws.context.lineWidth = 10;
		jaws.context.fillStyle =  "Black";
		jaws.context.fillText("Press Esc to exit!" , 300, 180);
		
	}
};

//End State

function EndState (){
	
	
	this.setup = function (){
		
		
	}
	this.update = function(){
		var obj1 = jaws.assets.get(audio);
		obj1.pause();
		var obj2 = jaws.assets.get(menu_audio);;
		obj2.pause();
		
		if (jaws.pressed("enter")) {
            jaws.switchGameState(PlayState);
        }
		if (jaws.pressed("space")) {
            jaws.switchGameState(MenuState);
        }
	}
	this.draw = function(){
		jaws.context.font = "bold 30px courier";
		jaws.context.lineWidth = 10;
		jaws.context.fillStyle =  "Black";
		jaws.context.strokeStyle =  "rgba(200,200,200,0.0)";
		jaws.context.fillText("Score: " + parseInt(score) , 100, 100);
		jaws.context.font = "bold 20px courier";
		jaws.context.fillText("Press Enter to start again !" , 100, 140);
		jaws.context.fillText("Press Space for Menu !" , 100, 180);
	}
};

jaws.onload = function() {
	
    jaws.assets.add(["images/carrot.png", "images/player-1.png", "images/sky-bg.png", "images/player.png", "images/player-2.png", "images/hurdle.png","sounds/audio.mp3", "sounds/menu-audio.mp3", "sounds/hurdle-audio.mp3","sounds/carrot-audio.mp3"]);
	//jaws.assets.add("sounds/audio.wav");
    jaws.start(MenuState);
};