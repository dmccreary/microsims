function setup() {
    createCanvas(800, 600);
    // load JSON with callback
    loadJSON("https://raw.githubusercontent.com/dariusk/corpora/master/data/colors/web_colors.json", printData);
    
    background(100);
    noLoop();
  }
  
  function printData(data) {
    console.log(data);
    
    let x = 10;
    // loop through and offset the text
    for (let i = 0; i < data.colors.length; i++) {
      if (i != 0 && i % 50 == 0) {
        x += 150;
      }
      // use the fill color 
      fill(data.colors[i].hex)
      // write out the names of the colors
      text(data.colors[i].color, x, (i % 50) * 12 + 12);
      // print it all out to the console
      console.log(i + ' ' + data.colors[i].color);
    }
    
  }