
/*

define a plane with chess board as bg

make a 3d chess
move it on the blocks

*/
var requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame ||
                       window.mozRequestAnimationFrame || window.msRequestAnimationFrame || 
                       function(c) {window.setTimeout(c, 15)};
 
// bind to window onload event
window.addEventListener('load', onloadHandler, false);

//for texture like 0t
var bitmaps = [];

var lastMouseX=10000;
var lastMouseY=10000;

rolling = false;
var ranX= 0; //-1 *(Math.random()*300 +20);
var ranY= 0; 
var ranZ= 0; 
var countroll=1000;

// port to js
//turn angle degree into 3D scene +180, -180
var inc=10;
var ang=0;
var count=180;
var conv_ang;

while(count>0){
	ang= (ang+inc) % 360;                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
	//console.log( "--" + ang);
	deg_2_3D( ang );
	//console.log( conv_ang );
	count--;
}


function onloadHandler()
{
 
	//borrow fr 0t
	// get the images loading
   var loader = new Phoria.Preloader();
   for (var i=0; i<6; i++)
   {
      bitmaps.push(new Image());
      bmp_code=i+1;
      loader.addImage(bitmaps[i], 'images/d'+bmp_code+'.jpg');
   }
   //--end borrow
  loader.onLoadCallback(init);
}




function init()
{
   // get the canvas DOM element and the 2D drawing context
   var canvas = document.getElementById('canvas');
    
    var canvas2 = document.getElementById('canvas2');
   
 //  document.getElementById("canvas").addEventListener('mousemove', genRan);
     document.getElementById("canvas").addEventListener("touchmove", genRan, false);
     
     document.getElementById("canvas2").addEventListener("touchmove", genRan, false);
     
     
   // create the scene and setup camera, perspective and viewport
   var scene = new Phoria.Scene();
   
   scene.camera.position = {x:0.0, y:5.0, z:-15.0};
   
   scene.perspective.aspect = canvas.width / canvas.height;
   scene.viewport.width = canvas.width;
   scene.viewport.height = canvas.height;
   
   // create a canvas renderer
   var renderer = new Phoria.CanvasRenderer(canvas);
   
    
   
   /*
		// add a grid to help visualise camera position etc.
   var plane = Phoria.Util.generateTesselatedPlane(8,8,0,20);
   scene.graph.push(Phoria.Entity.create({
      points: plane.points,
      edges: plane.edges,
      polygons: plane.polygons,
      style: {
         shademode: "plain",
         drawmode: "wireframe",
         linewidth: 0.5,
         objectsortmode: "back"
      }
   }));
   
*/
   
   //build the cube
   var c = Phoria.Util.generateUnitCube();
   var cube = Phoria.Entity.create({
   		id: "dice",
      points: c.points,
      edges: c.edges,
      polygons: c.polygons
   });
   for (var i=0; i<6; i++)
   {
      //cube.polygons[i].color = [42*i, 256-(42*i), (128+(42*i))%256];
      //use texture like 0t
      //console.log(bitmaps[i]);
      cube.textures.push(bitmaps[i]);
      cube.polygons[i].texture = i;
   }
   scene.graph.push(cube);
   
   ////
   Phoria.Entity.debug(cube, {
	  showId: true,
      showAxis: true,
      showPosition: true
   });
   
   
   // add a light
   scene.graph.push(Phoria.DistantLight.create({
      direction: {x:0, y:-0.5, z:1}
   }));
   
   
    // keep track of rotation
   var rot = {
      x: 0, y: 0, z: 0,
      velx: 0, vely: 0, velz: 0,
      nowx: 0, nowy: 0, nowz: 0,
      ratio: 0.04
   };
   
   
   // mouse rotation and position tracking
   var mouse = Phoria.View.addMouseEvents(canvas);
   var freshstart = true; 
   var pause = false;
   
   function genRan(){
			ranX= -1 *(Math.random()*600 +120);
			ranY= -1 *(Math.random()*600 +120);
			ranZ= -1 *(Math.random()*600 +120);
			pause=false;
			rolling = true;
			lastMouseY=mouse.velocityV;
			lastMouseX=mouse.velocityH;  
   }
   
  
   
   var fnAnimate = function() {
   
   //do this so the next action not trigger on start
   if ( freshstart ) {
   	lastMouseY=mouse.velocityV;
   	lastMouseX=mouse.velocityH;
   	
   	rot.velx =0;
   	rot.vely =0;
   	rot.velz =0;
   	
   	cube.rotateX(-0*Phoria.RADIANS).rotateY(-0*Phoria.RADIANS).rotateZ(-90*Phoria.RADIANS);
   }
   
 	//mouse action trigger animate  
     if (mouse.velocityV != lastMouseY || mouse.velocityH != lastMouseX) {
         	 if ( rolling == false ){
			/*
			ranX= -1 *(Math.random()*600 +120);
			ranY= -1 *(Math.random()*600 +120);
			ranZ= -1 *(Math.random()*600 +120);
			pause=false;
			rolling = true;
			lastMouseY=mouse.velocityV;
			lastMouseX=mouse.velocityH;  
			*/
			genRan();
			//console.log(ranX);
		}	
         }
   
      if (!pause )
      { 
         
          if (countroll > 0){
          	//random auto roll
          	
          	// is this incremental value? but there is a *
          	
          	//x, y, z roll retards as countroll decrease
          	
          	count_bonus= Math.min( Math.floor(countroll/40) , 4); 
          	
          	basic_inc=3;
          	
          	xx=count_bonus + basic_inc;
          	yy=count_bonus + basic_inc;
          	zz=1; //count_bonus + 1;
          	
          	
          	cube.rotateX(xx*Phoria.RADIANS).rotateY(yy*Phoria.RADIANS).rotateZ(zz*Phoria.RADIANS);
           
					
          }else{
          	//retard to stop
          	
						 // rotate local matrix of the cube
						 // += Add and Assignment, as newx grow it will retard the roll
						/*
						origin
						rot.nowx += (rot.velx = (mouse.velocityV - rot.x - rot.nowx/2) * rot.ratio);
						rot.nowy += (rot.vely = (rot.y - rot.nowy) * rot.ratio);
						rot.nowz += (rot.velz = (mouse.velocityH - rot.z - rot.nowz/2) * rot.ratio);
						*/
							 
						rot.nowx += (rot.velx = ( ranX - rot.x - rot.nowx) * rot.ratio);
						rot.nowy += (rot.vely = (rot.y - rot.nowy) * rot.ratio);
						rot.nowz += (rot.velz = (ranY - rot.z - rot.nowz) * rot.ratio);
						 
						cube.rotateX(-rot.velx*Phoria.RADIANS).rotateY(-rot.vely*Phoria.RADIANS).rotateZ(-rot.velz*Phoria.RADIANS);
						
						//this check if it stopped
						if ( Math.abs( rot.velx ) < 0.05){
							rolling = false;
							//console.log(rot.velx + "  " + rot.vely + "  " + rot.velz);
							pause=true;
						}
					}	
						
						
						// execute the model view 3D pipeline and render the scene
						scene.modelView();
						renderer.render(scene);				
      }
      
      countroll--;
//     console.log(countroll);
 	
      // this is a standard browser loop api
      requestAnimFrame(fnAnimate);
      
      //pause at start
      if ( freshstart==true ){
      	pause=true;
      	freshstart=false;
      }
   }
   
   
    
   // key binding, esc 27, space bar 32
   document.addEventListener('keydown', function(e) {
      switch (e.keyCode)
      {
         case 32:
         {
            pause = !pause;
            break;
         }
         
         //trigger
          case 82:
         {
					 if ( rolling == false || countroll==0){
							ranX= -1 *(Math.random()*300 +20);
							//ranY= -1 *(Math.random()*300 +20);
							//ranZ= -1 *(Math.random()*300 +20);
							pause=false;
							rolling = true;
							
							// the loop count to retard
							countroll=Math.floor(Math.random()*200 +320);
							
							//console.log(countroll);

							//console.log(ranX);
						}	
         }
      }
   }, false);
   
   
   //countroll--;
	 //console.log(countroll);
				
   // start animation
   requestAnimFrame(fnAnimate);
}
      
      



function deg_2_3D( ang ){
 
	if (ang > 180){
		conv_ang=( -180)+ (ang - 180);
	} else if (ang >= 360){
		conv_ang=ang-360;
	} else if (ang <= 180) {
		conv_ang=ang;
	}
	//return deg;
}