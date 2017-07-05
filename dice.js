
/*
	to do:
	
	how to make each obj handle it's own movement like dir?
	
	
	define a plane with chess board as bg
	
	make a 3d chess
	move it on the blocks
	
*/
var requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame ||
                       window.mozRequestAnimationFrame || window.msRequestAnimationFrame || 
                       function(c) {window.setTimeout(c, 15)};
 
window.addEventListener('load', onloadHandler, false);
 
function onloadHandler()
{	
	//----var init , all var to global 
	freshstart = true; 
	pause = false; 	
	lastMouseX=10000;
	lastMouseY=10000;
	
	rolling = false;
	ranX= 0; //-1 *(Math.random()*300 +20);
	ranY= 0; 
	ranZ= 0; 
	countroll=300; //for checking use


	//borrow fr 0t --load bitmap first
	bitmaps = [];
		
	//get the images loading
	var loader = new Phoria.Preloader();
	for (var i=0; i<6; i++)
	{
	  bitmaps.push(new Image());
	  bmp_code=i+1;
	  loader.addImage(bitmaps[i], 'images/d'+bmp_code+'.jpg');
	}
	
	 bitmaps.push(new Image());
	loader.addImage(bitmaps[6], 'images/honglok_chess_bg.jpg');
   //--end borrow
   
	//for mouse rotation and position tracking
	mouse = Phoria.View.addMouseEvents(canvas);
  
	loader.onLoadCallback(init);
}




function init()
{
	
	var active_objects=[];
	var inactive_objects;
	
	//1.========== get the canvas DOM element and the 2D drawing context
	var canvas = document.getElementById('canvas');
	
	var canvas2 = document.getElementById('canvas2');
	
	//  document.getElementById("canvas").addEventListener('mousemove', genRan);
	document.getElementById("canvas").addEventListener("touchmove", genRan, false);
	 
	//document.getElementById("canvas2").addEventListener("touchmove", genRan, false);
	 
	 
	// create the scene and setup camera, perspective and viewport
	var scene = new Phoria.Scene();
	
	scene.camera.position = {x:-1.0, y:5.0, z:-15.0};
	
	scene.perspective.aspect = canvas.width / canvas.height;
	scene.viewport.width = canvas.width;
	scene.viewport.height = canvas.height;
	
	// create a canvas renderer
	var renderer = new Phoria.CanvasRenderer(canvas);
	
	//====repeat for scene2
	var scene2 = new Phoria.Scene();
	
	scene2.camera.position = {x:0.0, y:5.0, z:-15.0};
	
	scene2.perspective.aspect = canvas2.width / canvas2.height;
	scene2.viewport.width = canvas2.width;
	scene2.viewport.height = canvas2.height;
	
	// create a canvas renderer
	var renderer2 = new Phoria.CanvasRenderer(canvas2);
	//====end repeat for scene2
	
	
	
   //2.========== gen 3D objs
    
	// add a grid to help visualise camera position etc.
	plane1=addPlane();
	
	cube= cubeObj("testcube");
	cube2= cubeObj("more"); 
	// add a light
	light1=addLight();  //Phoria.DistantLight.create({ direction: {x:0, y:-0.5, z:1} })
	
	//work on the objects, pos , rot, etc
	//how to make each obj animation itself like dir?
	cube2.translateX( 2).translateY(2).translateZ(-2);
	
	
	/*	====try holding objects in array or objects
		//	active_objects={ cube, cube2, light1 };
		 
		var active_objects = [];
		 
		active_objects.push(cube); 
		active_objects.push(cube2); 
		active_objects.push(plane1); 
		active_objects.push(light1);
		 
		///this not work!!
		for ( obj in active_objects) {
			console.log(obj);
			if ( cube == obj ){ console.log("meet");}
			scene.graph.push(obj); 
		}
 	*/

	 
	scene.graph.push(cube); 
	scene.graph.push(cube2); 
	scene.graph.push(plane1); 
	scene.graph.push(light1);
	
	//==repeat for scene2
	scene2.graph.push(cube); 
	scene2.graph.push(cube2); 
	scene2.graph.push(plane1); 
	scene2.graph.push(light1);
  
   ////
   Phoria.Entity.debug(cube, {
	  showId: true,
      showAxis: true,
      showPosition: true
   });
   ;
    
   	 
	// keep track of rotation, who's rot? cube?
	var rot = {
	  x: 0, y: 0, z: 0,
	  velx: 0, vely: 0, velz: 0,
	  nowx: 0, nowy: 0, nowz: 0,
	  ratio: 0.04
	};
   
  	//========end gen 3D objs
  
  	
  	
  //from now on loop on this 
   var fnAnimate = function() {
  
   //do this so the next action not trigger on start
   if ( freshstart ) {
   		//cant these be set in init earlier?
   		
		lastMouseY=mouse.velocityV;
		lastMouseX=mouse.velocityH;
		
		
		rot.velx =0;
		rot.vely =0;
		rot.velz =0;
		cube.rotateX(-0*Phoria.RADIANS).rotateY(-0*Phoria.RADIANS).rotateZ(-90*Phoria.RADIANS);
   }
   
 	mouseCheck();  
 	
    if (!pause ){ 
         
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
          	//countroll==0, retard to stop
          	
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
			
			scene2.modelView();
			renderer2.render(scene2);
			
			countroll--;
			console.log(  countroll);
      }
       
      //standard browser loop api, 
      //here it first update with freshstart contents set above
      requestAnimFrame(fnAnimate);
      
      //after first content drawn pause
      if ( freshstart==true ){
      	pause=true;
      	freshstart=false;
      }
   }
	
	
	//===the codes below called only once, then it will loop in requestAnimFrame(fnAnimate); above
	
	keyEvents();
	
	//UP to here, start animation
	//console.log("first frame");
	requestAnimFrame(fnAnimate);
}






//===========object builders
function cubeObj( my_id){
	   //build the cube
   var c = Phoria.Util.generateUnitCube();
   var cube = Phoria.Entity.create({
		id: my_id,
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
      //console.log(my_id);
   }
  // console.log(cube.polygons);
   return cube;
}

function addLight(){
	return Phoria.DistantLight.create({ direction: {x:0, y:-0.5, z:1} });
	}


function addPlane(){
	var plane = Phoria.Util.generateTesselatedPlane(1,1,0,10,1);
	
	plane_obj= Phoria.Entity.create({
		  points: plane.points,
		  edges: plane.edges,
		  polygons: plane.polygons,
		  style: {
			 shademode: "plain",
			 drawmode: "wireframe",
			 linewidth: 0.5,
			 objectsortmode: "back"
		  },
		  //added texture
		  textures:[]
	   });

//texture not shown	   
plane.textures=bitmaps[6];	   
console.log(plane);

plane.polygons.texture = 1;
      
	return plane_obj;   
}	

 
//====break out functions
function keyEvents(){ 
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

}

function mouseCheck(){
	if (mouse.velocityV != lastMouseY || mouse.velocityH != lastMouseX) {
         if ( rolling == false ){
			countroll=300; 
			genRan();
			//console.log(ranX);
		}	
     }
}

//=========extra functions

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


function genRan(){
		//beware var mouse is global 
		ranX= -1 *(Math.random()*600 +120);
		ranY= -1 *(Math.random()*600 +120);
		ranZ= -1 *(Math.random()*600 +120);
		pause=false;
		rolling = true;
		lastMouseY=mouse.velocityV;
		lastMouseX=mouse.velocityH;  
   }



/* test script
		//turn angle degree into 3D scene +180, -180
		inc=10;
		ang=0;
		count=180;
		var conv_ang;
		
		//this for demo of funtion
		while(count>0){
			ang= (ang+inc) % 360;                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
			console.log( "--" + ang);
			deg_2_3D( ang );
			////console.log( conv_ang );
			count--;
		}
*/