import React, { useEffect, useRef } from 'react';

const VideoComponent = React.forwardRef((props, ref) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const setupCamera = async () => {
      try {
        const constraints = { audio: props.isAudioOn, video: props.isCameraOn };
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
  }, [props.isCameraOn, props.isAudioOn]);  // Removed the cleanup function dependency, as it may cause issues

  React.useImperativeHandle(ref, () => ({
    toggleAudio: () => {
      console.log('Toggle Audio called');
    },
  }));

  return <video ref={videoRef} className="video-component" style={props.style} />;
});

export default VideoComponent;