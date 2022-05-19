const Swal = require('sweetalert2');


// variable declaration
let audioCtx;
let analyser;
let bufferLength;
let dataArray;
const tapPopup = () => {
    Swal.fire({
        titleText: "Gently tap the SKOP's membrane",
        text: "If sound is detected, this means that the SKOP is active",
        icon: "info",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        showConfirmButton: false,
    })
}


async function detection(mediaStream) {

    //Detect if user is on a iOS device
    if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i)) {
        Swal.fire({
            titleText: "Make sure that the Skop is plugged in",
            icon: "info",
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            showConfirmButton: false,
        })
       return;
    }
    audioCtx = new(window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;

    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);
    analyser.getByteFrequencyData(dataArray);

    let source = audioCtx.createMediaStreamSource(mediaStream);
    source.connect(analyser);

    Swal.fire({
        titleText: "Gently tap the SKOP's membrane",
        text: "If sound is detected, this means that the SKOP is active",
        icon: "info",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        showConfirmButton: false,
    })
    return detectTap()
}

function detectTap(){
    let id = setInterval(detect, 70);
    let count = 0;
    function detect(){


        analyser.getByteTimeDomainData(dataArray);
        for (var i = 0; i < bufferLength; i++) {
            var v = dataArray[i] / 128.0;
            var y = v * 1500 / 2;
            if(y > 1200){
                console.log(y);
                clearInterval(id);
                Swal.fire({
                    title: 'The SKOP seems to be ready !',
                    text: 'Sound is detected',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
                return true;
            }
        }

        count++;
        if (count > 100) {
            clearInterval(id);
            Swal.fire({
                titleText: "SKOP is not active",
                text: "Please try again",
                icon: "error",
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false,
                confirmButtonText: "Try again",
            }).then((res)=>{
                if (res.value){
                    id = setInterval(detect, 70);
                    tapPopup();
                    count = 0;
                }
            })
        }
    }
}

module.exports = detection;