import React, { useState, useEffect } from 'react';
import styles from './Home.module.css';
import Axios from 'axios';

const { kakao } = window;

function Home() {
  const [selected, setSelected] = useState({});
  let currMarker = null;
  let currCircle = null;
  let markers = [];
  let map;

  const markPothole = (pothole) => {
    const markerPos = new kakao.maps.LatLng(
      pothole.latitude,
      pothole.longitude
    );
    const marker = new kakao.maps.Marker({
      position: markerPos,
    });
    marker.setMap(map);

    kakao.maps.event.addListener(marker, 'click', () => {
      const dialog = document.querySelector('dialog');
      setSelected(pothole);
      console.log(pothole);
      dialog.showModal();
    });

    return marker;
  };

  const removeMarker = (marker) => {
    marker.setMap(null);
  };

  const markPotholes = (potholes) => {
    markers.forEach(removeMarker);
    markers = [];

    potholes.forEach((pothole) => {
      markers.push(markPothole(pothole));
    });
  };

  const onClick = () => {
    console.log(selected);
    document.querySelector('dialog').showModal();
  };

  useEffect(() => {
    const container = document.getElementById('map');
    navigator.geolocation.getCurrentPosition((pos) => {
      const latitude = pos.coords.latitude;
      const longitude = pos.coords.longitude;

      const options = {
        center: new kakao.maps.LatLng(latitude, longitude),
        level: 4,
      };
      map = new kakao.maps.Map(container, options);

      const markerPos = new kakao.maps.LatLng(latitude, longitude);
      const marker = new kakao.maps.Marker({
        position: markerPos,
      });
      marker.setMap(map);
      currMarker = marker;

      currCircle = new kakao.maps.Circle({
        map: map,
        center: new kakao.maps.LatLng(latitude, longitude),
        radius: 500,
        strokeWeight: 2,
        strokeColor: '#FF00FF',
        strokeOpacity: 0.8,
        strokeStyle: 'dashed',
        fillColor: '#00EEEE',
        fillOpacity: 0.5,
      });
    });

    setInterval(() => {
      Axios.get('/api/potholes').then((response) => {
        if (response.data.success !== false) {
          markPotholes(response.data);
        }
      });

      navigator.geolocation.getCurrentPosition((pos) => {
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;
        map.setCenter(new kakao.maps.LatLng(latitude, longitude));
        currMarker.setPosition(new kakao.maps.LatLng(latitude, longitude));
        currCircle.setPosition(new kakao.maps.LatLng(latitude, longitude));

        const center = currCircle.getPosition();
        const radius = currCircle.getRadius();
        const line = new kakao.maps.Polyline();

        let count = 0;

        markers.forEach((marker) => {
          // 마커의 위치와 원의 중심을 경로로 하는 폴리라인 설정
          const path = [marker.getPosition(), center];
          line.setPath(path);

          // 마커와 원의 중심 사이의 거리
          const dist = line.getLength();

          // 이 거리가 원의 반지름보다 작거나 같다면
          if (dist <= radius) {
            // 해당 marker는 원 안에 있는 것
            count++;
            // 여기에 핵심 코드를 넣으면 되겠다
          }
        });
        if (count) {
          console.log(`주변에 ${count}개의 포트홀!`);
        }
      });
    }, 3000);
  }, []);

  return (
    <div>
      <section id="map" className={styles.map}></section>
      <button onClick={onClick}>click</button>
      <dialog>
        <img
          src="http://localhost:5000/save_imgs/2023-04-15/2.jpg"
          alt="pothole"
        />
        <span>일시: {selected.date}</span>
        <button>신고하기</button>
      </dialog>
    </div>
  );
}

export default Home;
