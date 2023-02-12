import { useNavigate } from "react-router-dom";
import React ,{useState}from "react";
import { logout } from "../firebase";


const SpeechRecognizer=({isProfessor})=>{
    const navigate=useNavigate()
    let routes
    if(isProfessor)
        routes={
            "go to dashboard":()=>navigate("/professor/dashboard"),
            "go to project":()=>navigate("/professor/project"),
            "go to profile":()=>navigate("/professor/profile"),
            "go to report":()=>navigate("/professor/report"),
            "do logout":()=>logout()
        }
    else 
        routes={
            "go to dashboard":()=>navigate("/student/dashboard"),
            "go to project":()=>navigate("/student/project"),
            "go to profile":()=>navigate("/student/profile"),
            "go to report":()=>navigate("/student/report"),
            "do logout":()=>logout()
        }
const speechAPI=window.SpeechRecognition || window.webkitSpeechRecognition;
let speechRecognition = new speechAPI();
speechRecognition.continuous = true;
speechRecognition.interimResults = false;
speechRecognition.lang ="en-US"
let translations=[]
let final_transcript = "";
const [mic,setMic]=useState("mic_off")
let curInd=0



speechRecognition.onresult = (event) => {
final_transcript=event.results[curInd++][0].transcript
let arr=final_transcript.split(" ")
let string;
translations=[]
for(let i=0;i<arr.length;i++){
  string=arr[i]
  for(let j=i+1;j<arr.length;j++){
    string+=" "+arr[j]
    if(routes[string]){
        return routes[string]()
    }
  }
}
};

const handleAudio=()=>{
    if(mic==="mic_on"){
        setMic("mic_off")
        speechRecognition.stop()
    }
    else{
        curInd=0
        setMic("mic_on")
        speechRecognition.start()
    }
}


return <div class="mic-toggle-wrap action-icon-style display-center mr-2 cursor-pointer"  onClickCapture={handleAudio}>
<span class="material-icons " >{mic}</span>
</div> 

}
export default SpeechRecognizer