// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com
// chemistry demo v1 by ChrisOrban

// A reference to our box2d world
var world;


// A list for all of our particles
var particles = [];

var wall;
var wall2;
var wall3;
var wall4;

var vmax = 10;

function setup() {
  createCanvas(640,360);

  // Initialize box2d physics and create the world
  world = createWorld();

  world.SetContactListener(new CustomListener());
  
  wall = new Boundary(width/2, height, width, 0);
  wall2 = new Boundary(width/2, 0, width, 0);
  wall3 = new Boundary(0, height/2, 0, height);
  wall4 = new Boundary(width/2, height/2, 0, height);

      graph1 = new Graph();
      graph1.colorFunction = color(255,177,100);
  graph1. xTitle = "time";
  
}

function draw() {
  background(255);

  // We must always step through time!
  var timeStep = 1.0/30;
  // 2nd and 3rd arguments are velocity and position iterations
  world.Step(timeStep,10,10);

      if ((random(1) < 0.1) & (particles.length < 100)) {
        particle_size = 6;
        particles.push(new Particle(random(1)*width/4,random(1)*height,particle_size));
  }



  // Look at all particles
  for (var i = particles.length-1; i >= 0; i--) {
    particles[i].display();
    // Particles that leave the screen, we delete them
    // (note they have to be deleted from both the box2d world and our list
    if (particles[i].done()) {
      particles.splice(i,1);
    }
  }
  
  
    rms = 0.0;    
    for (var i = 0; i < particles.length; i +=1 ) {
	// sum up the velocity squared for all particles
	rms  += particles[i].vx()*particles[i].vx() + particles[i].vy()*particles[i].vy();
	
    }

   rms = rms/particles.length; // now rms is the average square
   rms = sqrt(rms); // now rms is the square root of the average square(=rms)
   // print(rms);


    graph1.addPoint(rms);
//      graph1.addPoint(particles.length/10.0);
  graph1.display(); //orange
  
  
  wall.display();

  
  
  fill(graph1.colorFunction);
  drawText("T",width*0.52,height-175);
  
      stroke(0);
    strokeWeight(2);
    line(0,0,width/2,0);
    line(width/2,0,width/2,height);
    line(width/2,height,0,height);
    line(0,height,0,0);
  
}



function Graph() {
    
  m_x = 350;
  m_y = 100;
  
  m_size_x = 250;
  m_size_y = 200;
  
  fontSize = 25;
  
  this.DataArray = [];
  this.PlotArray = [];
  
  this.colorFunction = color(0,0,0);

  this.xTitle = "";
  this.yTitle = "";
  
  this.minY = 0;
  this.maxY = 0;
  
  this.increaseMarginFactor = 1.1;
  
  this.display = function() {
    this.setTitle();
    this.setAxes();
    this.calcPlotArray();
    this.drawPoints();
    //print(this.DataArray);
  }
  
  this.setTitle = function (){
    textSize(fontSize);
    fill(0,0,0);
    noStroke();
    text(this.xTitle, (m_x + m_size_x - this.xTitle.length*fontSize/2), (m_y + m_size_y + 25));
    text(this.yTitle, (m_x - 25),(m_y + fontSize));    
  }
  
  this.setAxes = function() {
    stroke(0);
    strokeWeight(2);
    line(m_x,m_y,m_x,m_y+m_size_y);
    line(m_x,m_y+m_size_y,m_x+m_size_x,m_y+m_size_y);
  }
  
  this.addPoint = function( newpoint ) {
   append(this.DataArray, newpoint/vmax); 
    
    
    MaxLength = 200;
  	if (this.DataArray.length > MaxLength) {
    this.DataArray = subset(this.DataArray,this.DataArray.length-MaxLength,this.DataArray.length);
    }   
    
    
    
  }
  
  this.calcPlotArray = function() {
   //this.minY = min(this.DataArray);
   this.minY = 0; 
//   this.maxY = this.increaseMarginFactor*max(this.DataArray);
       //this.maxY = this.increaseMarginFactor;
  // this.PlotArray = m_size_y*this.DataArray/this.maxY;
    //this.PlotArray = this.DataArray;
    for(var i = 0; i < this.DataArray.length ; i++){
     this.PlotArray[i] = m_size_y*this.DataArray[i]/this.increaseMarginFactor; 
    }
  }

  this.drawPoints = function() {
   for (var i = 1; i < this.PlotArray.length ; i++) {
    //print(i);
    xi = m_size_x*i/this.PlotArray.length;
    xi_previous = m_size_x*(i-1)/this.PlotArray.length;
     //print(xi);
     strokeWeight(2);
     //stroke(0);
    stroke(this.colorFunction);
//    point(m_x+xi,m_y+m_size_y-this.PlotArray[i]);
     line(m_x+xi,m_y+m_size_y-this.PlotArray[i],m_x+xi_previous,m_y+m_size_y-this.PlotArray[i-1]);
   }
  }
  
    /*
  this.drawPoints = function () {
   this.minY = min(this.Array);
   this.maxY = this.increaseMarginFactor*max(this.Array);
    
   for(var xi = 0; xi < this.m_size_x ; xi++ ) {
     pos = this.Array.length*xi/m_size_x;
     
        x1 = oxi + m_x;
        y1 = oyi + m_y + m_size_y;
        x2 = xi + m_x;
        y2 = yi + m_y + m_size_y; 
   }*/
    
//  }  
  
}


function drawText( _str,  _x, _y){
    if (isNumeric(_str)){
	_str = round(10*_str)/10;
    }
    textSize(20);
    strokeWeight(1);
    text(_str, _x, height- _y);
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
