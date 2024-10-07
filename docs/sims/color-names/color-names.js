function setup() {
    createCanvas(1300, 600);
    textSize(20);
    // load JSON with callback
    loadJSON("https://raw.githubusercontent.com/dariusk/corpora/master/data/colors/web_colors.json", printData);
    
    background(100);
    noLoop();
  }
  
  function printData(data) {
    // console.log(data);
    
    let x = 28;
    // loop through and offset the text
    for (let i = 0; i < data.colors.length; i++) {
      if (i != 0 && i % 26 == 0) {
        x += 220;
      }
      // use the fill color 
      fill(data.colors[i].hex)
      // write out the names of the colors
      text(data.colors[i].color, x+10, (i % 26) * 22 + 30);
      // print it all out to the console
      // console.log(i + ' ' + data.colors[i].color);
    }
    
  }