const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

let wh = window.innerHeight;
let ww = window.innerWidth;

canvas.width = ww;
canvas.height = wh;

window.addEventListener('resize',(event)=>{
    let wh = window.innerHeight;
    let ww = window.innerWidth;

    canvas.width = ww;
    canvas.height = wh;

    maxColumns = ww/fontSize;

})

const img = document.getElementById("image");
const imgWidth = img.width;
const imgHeight = img.height;

let d, d2;

img.onload = function () {
    context.drawImage(img,0,0);
    let imgData = context.getImageData(0,0,img.width,img.height);
    d = imgData.data;
    for (let i=0;i<=d.length;i++)
    {
        let med = (d[i]+d[i+1]+d[i+2])/3.0;
        d[i]=d[i+1]=d[i+2]=med;
    }
    d2 = [];
    for (let i =0 ;i<imgHeight*4;i+=4)
    {
        let singleRow = [];
        for (let j=0;j<imgWidth*4;j+=4)
        {
            singleRow.push(d[j*imgWidth+i]);
        }
        d2.push(singleRow);
    }
}

let charArr = [
    'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'
];

let maxCharCount = 1000;
let fallinCharArr = [];
let fontSize = 12;
let maxColumns = img.width/fontSize;

let frames=0;
let sequenceLength = 1000;
let sequenceLengthRandomness = 5;

let getMeanValueOfBlackAndWhiteInArea = (x,y,fontSize) => {
    let sum = 0;
    let count = 0;
    for (let i = Math.floor(y); i<y+fontSize && i <imgWidth;i++)
    {
        for (let j=Math.floor(x); j<x+fontSize && j < imgHeight; j++)
        {
            if (d2[j][i] && !Number.isNaN(d2[j][i]))
            {
                sum += d2[j][i];
                count++;
            }
        }
    }
    if (count == 0) return 0;
    return sum/count;
}


class FallinChar {
    constructor(x,y,opacity){
        this.x = x;
        this.y = y;
        this.opacity = opacity;

    }

    draw(context){
        this.value = charArr[Math.floor(Math.random() * (charArr.length-1))].toUpperCase()
        this.speed = (Math.random() * fontSize * 1)/4 + (fontSize*1)/4;
        this.opacity = getMeanValueOfBlackAndWhiteInArea(this.x,this.y,fontSize/255)

        if (Number.isNaN(this.opacity))
        {
            this.opacity = 0;
        }
        if (this.opacity < 0.5)
        {
            this.opacity /=2;
        }
        context.fillStyle = "rgba(0,255,0,"+this.opacity+")";
        context.font = fontSize + "px sans-serif";
        context.fillText(this.value,this.x,this.y);
        this.y += this.speed;
    }
}

let update = ()=>{
    context.fillStyle = "rgba(0,0,0,0.1)";
    if (fallinCharArr.length < maxCharCount)
    {
        let columnPixel = Math.floor(Math.random()*maxColumns)*fontSize;
        let rowPixel = (Math.floor() * wh)/2 - 200;
        for (let i = 0; i < sequenceLength + Math.floor(sequenceLengthRandomness*Math.random());i++)
        {
            setTimeout(()=>{
                let fallinchar = new FallinChar(columnPixel,rowPixel+i*fontSize,0);
                fallinCharArr.push(fallinchar);
            },100*i);
        }
    }

    for (let i=0; i<fallinCharArr.length; i++)
    {
        if (fallinCharArr[i].y >= img.height)
        {
            fallinCharArr.splice(i,1);
            i--;
        }
    }
    context.fillRect(0,0,ww,wh);
    for (let i=0;i<fallinCharArr.length;i++)
    {
        fallinCharArr[i].draw(context);
    }
    requestAnimationFrame(update);
}
update();