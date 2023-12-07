let slider;
let colorList = [
  'AliceBlue', 'AntiqueWhite', 'Aqua', 'Aquamarine', 'Azure', 
  'Beige', 'Bisque', 'Black', 'BlanchedAlmond', 'Blue', 
  'BlueViolet', 'Brown', 'BurlyWood', 'CadetBlue', 'Chartreuse', 
  'Chocolate', 'Coral', 'CornflowerBlue', 'Cornsilk', 'Crimson', 
  'Cyan', 'DarkBlue', 'DarkCyan', 'DarkGoldenRod', 'DarkGray', 
  'DarkGrey', 'DarkGreen', 'DarkKhaki', 'DarkMagenta', 'DarkOliveGreen', 
  'Darkorange', 'DarkOrchid', 'DarkRed', 'DarkSalmon', 'DarkSeaGreen', 
  'DarkSlateBlue', 'DarkSlateGray', 'DarkSlateGrey', 'DarkTurquoise', 'DarkViolet', 
  'DeepPink', 'DeepSkyBlue', 'DimGray', 'DimGrey', 'DodgerBlue', 
  'FireBrick', 'FloralWhite', 'ForestGreen', 'Fuchsia', 'Gainsboro', 
  'GhostWhite', 'Gold', 'GoldenRod', 'Gray', 'Grey', 
  'Green', 'GreenYellow', 'HoneyDew', 'HotPink', 'IndianRed',  
  'Indigo', 'Ivory', 'Khaki', 'Lavender', 'LavenderBlush', 
  'LawnGreen', 'LemonChiffon', 'LightBlue', 'LightCoral', 'LightCyan', 
  'LightGoldenRodYellow', 'LightGray', 'LightGrey', 'LightGreen', 'LightPink', 
  'LightSalmon', 'LightSeaGreen', 'LightSkyBlue', 'LightSlateGray', 'LightSlateGrey', 
  'LightSteelBlue', 'LightYellow', 'Lime', 'LimeGreen', 'Linen', 
  'Magenta', 'Maroon', 'MediumAquaMarine', 'MediumBlue', 'MediumOrchid', 
  'MediumPurple', 'MediumSeaGreen', 'MediumSlateBlue', 'MediumSpringGreen', 'MediumTurquoise', 
  'MediumVioletRed', 'MidnightBlue', 'MintCream', 'MistyRose', 'Moccasin', 
  'NavajoWhite', 'Navy', 'OldLace', 'Olive', 'OliveDrab', 
  'Orange', 'OrangeRed', 'Orchid', 'PaleGoldenRod', 'PaleGreen', 
  'PaleTurquoise', 'PaleVioletRed', 'PapayaWhip', 'PeachPuff', 'Peru', 
  'Pink', 'Plum', 'PowderBlue', 'Purple', 'RebeccaPurple', 
  'Red', 'RosyBrown', 'RoyalBlue', 'SaddleBrown', 'Salmon', 
  'SandyBrown', 'SeaGreen', 'SeaShell', 'Sienna', 'Silver', 
  'SkyBlue', 'SlateBlue', 'SlateGray', 'SlateGrey', 'Snow', 
  'SpringGreen', 'SteelBlue', 'Tan', 'Teal', 'Thistle', 
  'Tomato', 'Turquoise', 'Violet', 'Wheat', 'White', 
  'WhiteSmoke', 'Yellow', 'YellowGreen'
];
let currentColorIndex = 0;

function setup() {
  createCanvas(600, 400);
  slider = createSlider(0, colorList.length - 1, 0, 1);
  slider.position(10, height - 30);
  slider.style('width', 600 - 20 + 'px')
}

function draw() {
  background(245);
  currentColorIndex = slider.value();
  let currentColor = colorList[currentColorIndex];

  // Check if currentColor is a valid color, else default to white
  if (currentColor && isValidColor(currentColor)) {
    fill(currentColor);
  } else {
    fill('white');
  }

  rect((width - 500) / 2, (height - 300) / 2, 500, 300);

  fill('black');
  textSize(32);
  textAlign(CENTER, CENTER);
  text(currentColor ? currentColor : 'Invalid Color', width / 2, height / 2);
}

// Function to check if a string is a valid color
function isValidColor(strColor) {
  let s = new Option().style;
  s.color = strColor;
  return s.color !== '';
}