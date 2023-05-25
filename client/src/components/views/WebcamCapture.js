import React, { useEffect, useRef } from 'react';
import Axios from 'axios';

const WebcamCapture = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    // 웹캠 스트림 받아오기
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error('웹캠 스트림을 받아오는 중 오류가 발생했습니다:', error);
      });

    return () => {
      // 컴포넌트 언마운트 시 웹캠 스트림 해제
      if (videoRef.current) {
        const stream = videoRef.current.srcObject;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop());
        }
      }
    };
  }, []);

  const handleCaptureFrame = () => {
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      // 웹캠 프레임을 캔버스에 그리기
      canvas
        .getContext('2d')
        .drawImage(video, 0, 0, canvas.width, canvas.height);

      // 캔버스 이미지 데이터를 Blob 객체로 변환
      canvas.toBlob((blob) => {
        // Blob 객체를 파일로 저장
        const file = new File([blob], 'frame.jpg', {
          type: 'image/jpeg',
        });
        console.log(file); // 저장된 파일 객체 출력

        // FormData 생성 및 파일 추가
        const formData = new FormData();
        formData.append('file', file);

        // FormData를 서버로 전송
        Axios.post('/api/upload', formData)
          .then((response) => {
            console.log('파일 전송 성공:', response.data);
          })
          .catch((error) => {
            console.error('파일 전송 중 오류 발생:', error);
          });
      }, 'image/jpeg');
    }
  };

  return (
    <div>
      <video ref={videoRef} autoPlay />
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        style={{ display: 'none' }}
      />
      <button onClick={handleCaptureFrame}>프레임 저장</button>
    </div>
  );
};

export default WebcamCapture;
