import brand from '../images/vector.png';
import video from '../videos/video.mp4';
import vimg from '../images/video_img.png'
import mute from '../images/mute.svg'
import React, { useEffect, useRef, useState } from 'react';
import VideoComponent from '../components/VideoComponent';
import el1 from '../images/el1.svg';
import el2 from '../images/el2.svg';
import icp from '../images/icp.svg';
import chatbtn from '../images/chatbtn.svg'
import { useNavigate } from 'react-router-dom';
import { getDatabase, push, ref, set,onChildAdded } from "firebase/database";

const Homes = (props) => {
    const [isCameraOn, setIsCameraOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);

  const videoRef = useRef(null);

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
  const [user, setUser] = useState({
    name:props.name,
    email:props.email
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
        console.log(data.val())
        console.log('this')
        console.log([...chats,data.val()])
        setChats(chats=>[...chats,data.val()])
        setTimeout(()=>{
        updateHeight()

      },100)
    //   console.log(chats)
    });
  },[])
  console.log(chatListRef)
  
  const navigate=useNavigate()
  const sendChat = () => {
    if(user.name==='')    navigate('/login')
    const chatRef = push(chatListRef);
    set(chatRef, {
      user, message: msg 
    });
    setMsg('');
    
  };




  return (
    <>
    
    <div className="video-background">
        <video autoPlay loop muted>
        <source src={video} type="video/mp4" />
        Your browser does not support the video tag.
        </video>
        <div className="navbar">
        <div className="brand"> <img src= {brand} alt="" /> </div>
        </div>
        <div className="video-frame-top">
            <div className="video_img">{isCameraOn?<VideoComponent ref={videoRef} isCameraOn={isCameraOn} isAudioOn={isAudioOn}/>:<img src={vimg} alt="" />}</div>
            <div className="mic">
            <img src={mute} alt="" onClick={toggleAudio}/>
            <span>{isAudioOn ? 'Mute' : 'Unmute'}</span>
            </div>
            <div className="volume">
                <div className="rectangle">
                    <div className="bar">

                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">
                    <path d="M17.4375 6.74973C17.4372 6.59096 17.3856 6.43548 17.2884 6.30115C17.1912 6.16682 17.0525 6.0591 16.8882 5.99036C16.7239 5.92162 16.5406 5.89466 16.3595 5.91257C16.1783 5.93048 16.0067 5.99253 15.8643 6.09161L11.2859 9.28098H6.78125C6.52432 9.28098 6.27792 9.36988 6.09624 9.52811C5.91456 9.68634 5.8125 9.90095 5.8125 10.1247V16.8747C5.8125 17.0985 5.91456 17.3131 6.09624 17.4714C6.27792 17.6296 6.52432 17.7185 6.78125 17.7185H11.2859L15.8643 20.9079C16.0067 21.0069 16.1783 21.069 16.3595 21.0869C16.5406 21.1048 16.7239 21.0778 16.8882 21.0091C17.0525 20.9404 17.1912 20.8326 17.2884 20.6983C17.3856 20.564 17.4372 20.4085 17.4375 20.2497V6.74973ZM23.2984 13.4997C23.2999 14.4972 23.0751 15.485 22.6369 16.4065C22.1986 17.328 21.5556 18.165 20.7448 18.8694L19.375 17.6763C20.0056 17.1284 20.5057 16.4774 20.8465 15.7606C21.1874 15.0439 21.3622 14.2755 21.3609 13.4997C21.3621 12.724 21.1872 11.9556 20.8464 11.2389C20.5056 10.5221 20.0055 9.8711 19.375 9.32317L20.7448 8.13011C21.5556 8.83448 22.1986 9.67147 22.6369 10.593C23.0751 11.5145 23.2999 12.5023 23.2984 13.4997Z" fill="white"/>
                    </svg>
                </div>
                <span>Volume</span>
            </div>
        </div>
        <div className="bottom">
            <div className="chat-bottom">
            <div id="chat" className="chat-container">
                  {chats.map((c,i) => (
                  <div key={i} className={`container ${c.user.email === props.email ? 'me' : ''}`}>
                      <p className="chatbox">
                      <strong>{c.user.name}: </strong>
                      <span>{c.message}</span>
                      </p>
                  </div>
                  ))}
              </div>
              <div className="flip-chat">
              <img src={chatbtn} alt="" />
                <span>Chat</span>
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

export default Homes