import * as tf from '@tensorflow/tfjs-core';
import * as blazeface from '@tensorflow-models/blazeface';

require("@tensorflow/tfjs-backend-webgl");

let model;
let video: HTMLVideoElement;
let intervalId;
let prediction;
let cWidth:number;
let cHeight:number;
let canvas;
let ctx:CanvasRenderingContext2D;
let currentFoyer:string;

function setupAR(userCanvas:string|HTMLCanvasElement, width:number, height:number){
    if(userCanvas === undefined || userCanvas === null){
        throw new Error("Canvas is undefined or null");
    }

    cWidth = width;
    cHeight = height;

    //check if canvas is a string
    if(typeof userCanvas === "string") canvas = document.getElementById(userCanvas);
    else if(userCanvas.nodeName === "CANVAS") canvas = userCanvas;
    else throw new Error("Canvas is not a string nor a canvas");

}

/**
 * Initiates the logic for augmented reality.
 * Todo make it possible to use 16:9 ratio.
 */
async function init(){
    //show canvas
    canvas.style.display = "block";
    ctx = canvas.getContext('2d');
    canvas.width = cWidth;
    canvas.height = cHeight;
    await tf.ready();

    // TODO peut etre enlever ce morceau de l'api pour laisser le choix au dev de cacher la camera ou non
    //hide video
    const videoVonage = document.getElementById("publisher");
    videoVonage.style.display = "none";

    //Getting video stream
    video = document.createElement('video');
    navigator.mediaDevices
        .getUserMedia({
            video: true,
            audio: false,
        })
        .then((stream) => {
            video.srcObject = stream;

            video.width = cWidth;
            video.height = cHeight;

            console.log(video.width);
            video.play();
        });

    // When the video stream is ready, load the model
    video.addEventListener("play", async () => {
        model = await blazeface.load();

    })
    let canvasStream = canvas.captureStream(30);
    return canvas.captureStream(30)
}

const detectFaces = async () => {
    try{
        let rateX = cWidth/640;
        let rateY = cHeight/480;
        if(model === undefined) return;
        prediction = await model.estimateFaces(video, false).then(prediction => {
            if(prediction.length > 0) {
                //flip the video
                ctx.clearRect(0, 0, cWidth, cHeight);
                ctx.save();
                ctx.translate(cWidth, 0);
                ctx.scale(-1, 1);
                ctx.drawImage(video, 0, 0, video.width, video.height);

                // TODO enlever le dessin des yeux
                /*
                // draw eyes
                ctx.beginPath(); //right eye
                ctx.arc(prediction[0].landmarks[0][0] * rateX, prediction[0].landmarks[0][1]*rateY, 3, 0, 2 * Math.PI);
                ctx.fillStyle = 'blue';
                ctx.fill();

                //left eye
                ctx.beginPath();
                ctx.arc(prediction[0].landmarks[1][0]* rateX, prediction[0].landmarks[1][1]*rateY, 3, 0, 2 * Math.PI);
                ctx.fillStyle = 'red';
                ctx.fill();
                ctx.stroke();
                 */

                //get center between eyes
                //let centerX = (prediction[0].landmarks[0][0] + prediction[0].landmarks[1][0]) / 2;
                //let centerY = (prediction[0].landmarks[0][1] + prediction[0].landmarks[1][1]) / 2;

                //get distance between eyes
                let distance = Math.sqrt(Math.pow(prediction[0].landmarks[0][0] - prediction[0].landmarks[1][0], 2) + Math.pow(prediction[0].landmarks[0][1] - prediction[0].landmarks[1][1], 2));
                drawFocuses(distance, prediction[0].landmarks[0][0], prediction[0].landmarks[0][1], prediction[0].landmarks[1][0]);
                ctx.restore();
            }else{
                // if no face detected, write "no face detected"
                ctx.font = "30px Arial";
                ctx.fillStyle = "rgb(255,7,7)";
                ctx.fillText("No face detected", (cWidth/3) *rateX , (cHeight/2) *rateY);
            }
        })
    }catch (e) {
        console.error(e)
    }


};

function drawFocuses(eyeDistance:number, rightEyeX, rightEyeY, leftEyeX){

    //test pour pulmonaire
    let xMultiplier;
    let yMultiplier;
    let rateX = cWidth/640;
    let rateY = cHeight/480;
    let color;

    switch (currentFoyer) {
        case "Pulmonary":
            xMultiplier = 1.4;
            yMultiplier = 3.2;
            break;
        case "Mitral":
            xMultiplier = 2;
            yMultiplier = 4.3;
            color = "red";
            break;
        case "Aortic":
            xMultiplier = -0.2;
            yMultiplier = 3;
            break;
        case "Tricuspid":
            xMultiplier = 0.9;
            yMultiplier = 4.5;
            break;
        default:
            xMultiplier = 100;
            yMultiplier = 100;
            console.error("Unknown zone, please give a zone that is in the list");
            break;

    }
    drawPoint((rightEyeX + (leftEyeX-rightEyeX) * xMultiplier) * rateX , (rightEyeY + (leftEyeX -rightEyeX) * yMultiplier) * rateY, color);

}

function drawPoint(x:number, y:number, color:string = "#a2d2ff"){
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.stroke();
}

async function start(foyer:string){
    currentFoyer = foyer;
    intervalId = setInterval(detectFaces, 100);
}

function stop(){
    canvas.style.display = "none";
    const videoVonage = document.getElementById("publisher");
    videoVonage.style.display = "block";
    clearInterval(intervalId);
}

export {setupAR ,init, start, stop};