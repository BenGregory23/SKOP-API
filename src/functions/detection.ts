import Swal, {SweetAlertResult} from "sweetalert2";


// variable declaration
let audioCtx: AudioContext;
let analyser: AnalyserNode;
let bufferLength: number;
let dataArray: Uint8Array;

const tapPopup = () => {
    Swal.fire({
        titleText: "Gently tap the SKOP's membrane",
        text: "If sound is detected, this means that the Skop is active",
        icon: "info",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        showConfirmButton: false,
    })
}

async function detection(mediaStream:MediaStream){
    if(mediaStream == null) {
        throw new Error("MediaStream is not defined - Detection function");
    }
    //Detect if user is on a iOS device
    if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i)) {
        Swal.fire({
            titleText: "Verification",
            text: "Make sure that the Skop is plugged in.",
            icon: "info",
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            showConfirmButton: true,
        })
        return;
    }
    audioCtx = new window.AudioContext;
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
    let count:number = 0;
    function detect(){


        analyser.getByteTimeDomainData(dataArray);
        for (let i = 0; i < bufferLength; i++) {
            let v:number = dataArray[i] / 128.0;
            let y:number = v * 1500 / 2;
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
                showCloseButton: true,
            }).then((res:SweetAlertResult)=>{
                if (res.value){
                    id = setInterval(detect, 70);
                    tapPopup();
                    count = 0;
                }
            })
        }
    }
}

export{detection}
