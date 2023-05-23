import React, { useEffect, useRef } from 'react';
import Axios from 'axios';

const WebcamCapture = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    let mediaRecorder;
    let chunks = [];

    const handleDataAvailable = (event) => {
      chunks.push(event.data);
    };

    const captureFrames = () => {
      const videoElement = videoRef.current;

      // 캔버스 요소를 생성합니다.
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      const ctx = canvas.getContext('2d');

      // 현재 비디오 프레임을 캔버스에 그립니다.
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      // 캔버스 이미지를 데이터 URL로 변환합니다.
      const frame = canvas.toDataURL('image/jpeg');

      // 데이터 URL로부터 Blob을 생성합니다.
      const imageBlob = dataURItoBlob(frame);
      console.log(imageBlob);

      // Blob으로부터 파일 객체를 생성합니다.
      const imageFile = new File([imageBlob], 'frame.jpg');
      console.log(imageFile);

      // FormData를 생성하고 이미지 파일을 추가합니다.
      const formData = new FormData();
      formData.append('image', imageFile);

      console.log(formData);

      const imageElement = document.createElement('img');
      imageElement.src = frame;
      document.body.appendChild(imageElement);

      // FormData를 서버로 전송합니다.
      Axios.post('/api/upload', formData)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    };

    const startCapture = () => {
      const videoElement = videoRef.current;

      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoElement.srcObject = stream;

          mediaRecorder = new MediaRecorder(stream);
          mediaRecorder.addEventListener('dataavailable', handleDataAvailable);
          mediaRecorder.start();

          const animationId = requestAnimationFrame(captureFrames);

          return () => {
            cancelAnimationFrame(animationId);
            mediaRecorder.removeEventListener(
              'dataavailable',
              handleDataAvailable
            );
            mediaRecorder.stop();
            stream.getTracks().forEach((track) => track.stop());
          };
        })
        .catch((error) => {
          console.error('웹캠 접근 오류:', error);
        });
    };

    startCapture();
  }, []);

  function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    return new Blob([arrayBuffer], { type: mimeString });
  }

  return (
    <div>
      <video ref={videoRef} autoPlay muted />
    </div>
  );
};

export default WebcamCapture;
