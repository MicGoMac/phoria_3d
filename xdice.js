 
var requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame ||
                       window.mozRequestAnimationFrame || window.msRequestAnimationFrame || 
                       function(c) {window.setTimeout(c, 15)};
 
// bind to window onload event
window.addEventListener('load', onloadHandler, false);

//for texture like 0t
var bitmaps = [];
rolling = false;
var ranX= -1 *(Math.random()*300 +20);
var ranY= -1 *(Math.random()*300 +20);
var ranZ= -1 *(Math.random()*300 +20);

var background = new Image();
background.src = "images/honglok_chess_bg.jpg";


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
   
   //the cube
   var c = Phoria.Util.generateUnitCube();
   var cube = Phoria.Entity.create({
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
      showAxis: true
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
   
   var fnAnimate = function() {
      if (!pause )
      { 
         // rotate local matrix of the cube
         // += Add and Assignment, as newx grow it will retard the roll
/*
				rot.nowx += (rot.velx = (mouse.velocityV - rot.x - rot.nowx/2) * rot.ratio);
				rot.nowy += (rot.vely = (rot.y - rot.nowy) * rot.ratio);
				rot.nowz += (rot.velz = (mouse.velocityH - rot.z - rot.nowz/2) * rot.ratio);
*/
         
				
 				//valueA= -1 *(Math.random()*300 +20);
 				//valueB=-1 *(Math.random()*300+ 20);

 				 
				rot.nowx += (rot.velx = ( ranX - rot.x - rot.nowx) * rot.ratio);
				rot.nowy += (rot.vely = (rot.y - rot.nowy) * rot.ratio);
				rot.nowz += (rot.velz = (ranY - rot.z - rot.nowz) * rot.ratio);
				
				//this check if it stopped
				if (rot.velx < 0.1){
					rolling = false;
					//console.log("stopped");
					
			 	}
				/*
				(rot.velx = (mouse.velocityV - rot.x - rot.nowx) * rot.ratio);
				(rot.vely = (rot.y - rot.nowy) * rot.ratio);
				(rot.velz = (mouse.velocityH - rot.z - rot.nowz) * rot.ratio);
				*/

				cube.rotateX(-rot.velx*Phoria.RADIANS).rotateY(-rot.vely*Phoria.RADIANS).rotateZ(-rot.velz*Phoria.RADIANS);
				
				// execute the model view 3D pipeline and render the scene
				scene.modelView();
				renderer.render(scene);
      }
      
      //loop?
      requestAnimFrame(fnAnimate);
      //freshstart=false;
      if ( freshstart==true ){
      	pause=true;
      	freshstart=false;
      }
   };

/*

// Make sure the image is loaded first otherwise nothing will draw.
ctx = canvas.getContext("2d");

ctx.drawImage(background,0,0);   


*/   
    
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
					 if ( rolling == false ){
							ranX= -1 *(Math.random()*300 +20);
							ranY= -1 *(Math.random()*300 +20);
							ranZ= -1 *(Math.random()*300 +20);
							pause=false;
							rolling = true;
							console.log(ranX);
						}	
         }
      }
   }, false);
   
   // start animation
   requestAnimFrame(fnAnimate);
}
      