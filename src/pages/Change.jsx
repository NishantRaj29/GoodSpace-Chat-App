import brand from '../images/vector.png';
import video from '../videos/video.mp4';
import vimg from '../images/video_img.png'
import mute from '../images/mute.svg';
import send from'../images/send.svg';
import React, { useEffect, useRef, useState } from 'react';
import VideoComponent from '../components/VideoComponent';
import el1 from '../images/el1.svg';
import el2 from '../images/el2.svg';
import icp from '../images/icp.svg';
import speech from "../images/speech.png"
import videobtn from '../images/videobtn.svg'
import { useLocation, useNavigate } from 'react-router-dom';
import { getDatabase, push, ref, set,onChildAdded } from "firebase/database";

const Change = (props) => {
    const [isCameraOn, setIsCameraOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);

  const videoRef = useRef(null);
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [work,setWork]=useState(false);
  
  const toggleCamera = () => {
    setIsCameraOn((prev) => !prev);
  };

  const toggleAudio = () => {
    setIsAudioOn((prev) => !prev);
  };

  useEffect(() => {
    const setupCamera = async () => {
      try {
        const constraints = { audio: isAudioOn, video: isCameraOn };
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        const videoElement = videoRef.current;

        if (videoElement) {
          videoElement.srcObject = mediaStream;
          videoElement.play();
        }
      } catch (error) {
        console.error('Error accessing webcam:', error.message);
      }
    };

    setupCamera();

    // Cleanup function when component unmounts
    return () => {
      const videoElement = videoRef.current;
      if (videoElement) {
        const stream = videoElement.srcObject;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop());
        }
      }
    };
  }, [isCameraOn, isAudioOn]);

  // Chat 
  const location=useLocation();
  
  const [user, setUser] = useState({
    name:location.state.name,
    email:location.state.email
  });
  const [chats, setChats] = useState([]);
  const [msg, setMsg] = useState('');

  const db = getDatabase();
  const chatListRef = ref(db, 'chats');


  
  const updateHeight=()=>{
    const el = document.getElementById('chat');
    if(el){
      el.scrollTop = el.scrollHeight;
    }
  }


  useEffect(()=>{

    onChildAdded(chatListRef, (data) => {
        setChats(chats=>[...chats,data.val()])
        setTimeout(()=>{
        updateHeight()

      },100)
    });
  },[])
  
  const navigate=useNavigate()
  const sendChat = () => {
    if(user.name==='')    navigate('/')
    const chatRef = push(chatListRef);

    set(chatRef, {
      user, message: transcript !== '' ? transcript : msg, 
    });
    setTranscript('');
    setMsg('');
    
  };

//   Speech To Text


  const startSpeechRecognition = () => {
    setListening(true);
    setWork(true);
    const recognition = new window.webkitSpeechRecognition();
    setRecognition(recognition);

    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      console.log('Speech recognition started');
    };

    // ...

recognition.onresult = (event) => {
    const last = event.results.length - 1;
    const text = event.results[last][0].transcript;
    setTranscript(text);
    console.log('Transcript:', text);
  
    // Correct OpenAI API endpoint
    fetch(`https://api.openai.com/v1/engines/davinci-codex/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': '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',  
      },
      body: JSON.stringify({ prompt: text }),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  };

    recognition.onend = () => {
      console.log('Speech recognition ended');
      setListening(false);
    };

    recognition.start();
  };

  const stopSpeechRecognition = () => {
    if (recognition) {
        setWork(false);
      recognition.stop();
    }
  };





  return (
    <>
    
    <div className="video-background-nxt">
        <video autoPlay loop muted>
        <source src={video} type="video/mp4" />
        Your browser does not support the video tag.
        </video>
        <div className="navbar">
        <div className="brand"> <img src= {brand} alt="" /> </div>
        </div>
        <div className="chat-frame-top">
            <div id="chat" className="chat-container">
                  {chats.map((c,i) => (
                  <div key={i} className={`container ${c.user.email === user.email ? 'me' : ''}`}>
                      <p className="chatbox">
                      <strong>{c.user.name}: </strong>
                      <span>{c.message}</span>
                      </p>
                  </div>
                  ))}
            </div>
            <div className="btm">
                <input
                type="text"
                onInput={(e) => setMsg(e.target.value)}
                value={transcript !== '' ? transcript : msg}
                placeholder="enter your chat"
                ></input>
                <button onClick={(e) => sendChat()}><img src={send} alt="" /></button>
                <button onClick={work?stopSpeechRecognition:startSpeechRecognition} disabled={work?!listening:listening}><img src={speech} alt="" className='speech'/></button>
            </div>
        </div>
        <div className="bottom">
            <div className="chat-bottom">
            <div className="video_img">{isCameraOn?<VideoComponent ref={videoRef} isCameraOn={isCameraOn} isAudioOn={isAudioOn}/>:<img src={vimg} alt="" />}</div>
              <div className="flip-chat">
              <img src={videobtn} alt="" onClick={(e)=>navigate('/Homes',{state:{name:user.name,email:user.email}})}/>
                <span>Video</span>
              </div>
            </div>
            <div className="pause">
                <div className="icon" onClick={toggleCamera}>
                    <img src={el1} alt="" />
                    <img src={el2} alt="" />
                    <img src={icp} alt="" />
                </div>
                <span>Pause</span>
            </div>
        </div>
    </div>
    </>
  )
}

export default Change