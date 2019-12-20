const defaultCode = `
// A basic code editor for expressions

// Import eKeys library
const eKeys = footage('eKeys.jsx').sourceData;

// Create an array of keyframes
const inKeys = [
  {
    keyTime: 1,
    keyValue: 0,
    easeIn: 0,
    easeOut: 66,
  },{
    keyTime: 2,
    keyValue: 250,
    easeIn: 90,
    easeOut: 0,
  }
];

// Animate
eKeys.animate(inKeys, time);
`

export default defaultCode;