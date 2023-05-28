const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let cw = window.innerWidth;
let ch = window.innerHeight;

canvas.width = cw;
canvas.height = ch;

window.addEventListener("resize", function (event) {
  cw = window.innerWidth;
  ch = window.innerHeight;
  canvas.width = cw;
  canvas.height = ch;
  maxColums = cw / fontSize;
});

var url = 'file:///C:/Users/Rahul/Project/Face%20Rain/images/emiliaClark.png';

const img = document.getElementById("image");
// img.src = url + '?' + new Date().getTime();
// img.setAttribute('crossOrigin', '');
img.crossOrigin = "anonymous";
const imgWidth = img.width;
const imgHeight = img.height;

let d;
let dTwoD;

img.onload = async function () {
  ctx.drawImage(img, 0, 0);
  let imgData = await ctx.getImageData(0, 0, 640, 640);
  d = imgData.data;
  for (let i = 0; i < d.length; i++) {
    let med = (d[i] + d[i + 1] + d[i + 2]) / 3.0;
    d[i] = d[i + 1] = d[i + 2] = med;
  }
  dTwoD = [];
  for (let i = 0; i < imgHeight * 4; i += 4) {
    let singleRow = [];
    for (let j = 0; j < imgWidth * 4; j += 4) {
      singleRow.push(d[j * imgWidth + i]);
    }
    dTwoD.push(singleRow);
  }
};
let charArr = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "А",
  "В",
  "Г",
  "Д",
  "Є",
  "Ѕ",
  "З",
  "И",
  "Ѳ",
  "І",
  "К",
  "Л",
  "М",
  "Н",
  "Ѯ",
  "Ѻ",
  "П",
  "Ч",
  "Р",
  "С",
  "Т",
  "Ѵ",
  "Ф",
  "Х",
  "Ѱ",
  "Ѿ",
  "Ц",
];

let maxCharCount = 10000;
let fallinCharArr = [];
let fontSize = 12;
let maxColums = img.width / fontSize;

let frames = 0;
let sequenceLength = 1000;
let sequenceLengthRandomness = 5;

let getMeanValueOfBlackAndWhiteInAnArea = (dTwoD, x, y, fontSize) => {
  let sum = 0;
  let count = 0;
    if (!dTwoD) return 0;
  for (let i = Math.floor(y); i < y + fontSize && i < imgWidth; i++) {
    for (let j = Math.floor(x); j < x + fontSize && j < imgHeight; j++) {
      if (dTwoD[j][i] && !Number.isNaN(dTwoD[j][i])) {
        sum += dTwoD[j][i];
        count++;
      }
    }
  }

  return sum / count;
};

class FallingChar {
  constructor(x, y, opacity) {
    this.x = x;
    this.y = y;
    this.opacity = opacity;
  }

  draw(ctx) {
    this.value =
      charArr[Math.floor(Math.random() * (charArr.length - 1))].toUpperCase();
    this.speed = (Math.random() * fontSize * 1) / 4 + (fontSize * 1) / 4;
    this.opacity =
      getMeanValueOfBlackAndWhiteInAnArea(dTwoD, this.x, this.y, fontSize) / 255;

    if (Number.isNaN(this.opacity)) {
      this.opacity = 0;
    }
    if (this.opacity < 0.6) {
      this.opacity /= 5;
    }
    ctx.fillStyle = "rgba(0,255,0," + this.opacity + " )";
    ctx.font = fontSize + "px sans-serif";
    ctx.fillText(this.value, this.x, this.y);
    this.y += this.speed;
  }
}

let update = async () => {
  ctx.fillStyle = "rgba(0,0,0,0.1)";
  if (fallinCharArr.length < maxCharCount) {
    let columnPx = Math.floor(Math.random() * maxColums) * fontSize;
    let rowPx = (Math.random() * ch) / 2 - 200;
    for (
      let i = 0;
      i < sequenceLength + Math.floor(Math.random() * sequenceLengthRandomness);
      i++
    ) {
      setTimeout(() => {
        let fallingChar = new FallingChar(columnPx, rowPx + i * fontSize, 0);

        fallinCharArr.push(fallingChar);
      }, 100 * i);
    }
  }

  for (let i = 0; i < fallinCharArr.length; i++) {
    if (fallinCharArr[i].y >= img.height) {
      fallinCharArr.splice(i, 1);
      i--;
    }
  }
  ctx.fillRect(0, 0, cw, ch);
  for (let i = 0; i < fallinCharArr.length; i++) {
    fallinCharArr[i].draw(ctx);
  }
  await requestAnimationFrame(update);
};

update();