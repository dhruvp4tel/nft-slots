
const getRandomNumber = (r1, r2) => {
  return Math.floor(Math.random() * (r2 - r1 + 1) + r1);
}

const isNumberInRange = (number, range) => {
  return (number >= range[0] && number <= range[1]);
}


const getCanvasCtx  = (chartId) => {
  return document.getElementById(chartId).getContext('2d');
}