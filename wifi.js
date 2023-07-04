fetch("https://smartcity.gimhae.go.kr/smart_tour/dashboard/api/publicData/location/ap") // 김해시 WIFI 위치 정보 json 파일
.then(result => result.json()) // json 파일을 객체로 변환
.then(json => {                     
  const data = json.data;

  const lat = 35.228561889611385; // 김해 시청 위도
  const lng = 128.8893538313036; // 김해 시청 경도

  var mapContainer = document.getElementById('map'), // 지도를 표시할 div
  mapOption = { 
    center: new kakao.maps.LatLng(lat, lng), // 지도의 중심좌표 - 김해 시청
    level: 9 // 지도의 확대 레벨
  };

  // 지도를 표시할 div와 지도 옵션으로 지도를 생성합니다
  var map = new kakao.maps.Map(mapContainer, mapOption); 

  // 마커 클러스터러를 생성합니다 
  var clusterer = new kakao.maps.MarkerClusterer({
    map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체 
    averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정 
    minLevel: 8 // 클러스터 할 최소 지도 레벨 
  });

  // 마커들을 모아놓을 변수
  var markers = [];

  for(let i = 0; i < data.length; i++){
    // 마커를 생성합니다.
    var marker = new kakao.maps.Marker({
      map: map,
      position: new kakao.maps.LatLng(data[i].yCoordinate, data[i].xCoordinate)
    });

    markers.push(marker);  // 마커를 배열에 추가합니다

    var iwcontent = `
      <div style="width: 500px; height: 50px; padding:5px;">
      WIFI명: ${data[i].name}<br>주소: ${data[i].addr}</div>`; // 인포윈도우에 표시될 내용과 스타일

    var infowindow = new kakao.maps.InfoWindow({
      content: iwcontent
    });

    // 마커에 이벤트를 등록합니다
    // 이벤트 리스너로는 클로저를 만들어 등록합니다 
    // 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다

    // 마커에 마우스오버하면 makeOverListener() 실행
    kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(map, marker, infowindow));  
    // 마커에서 마우스아웃하면 makeOutListener() 실행
    kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(infowindow));   
  }

  // 인포윈도우를 표시하는 클로저를 만드는 함수입니다 
  function makeOverListener(map, marker, infowindow) {
    return function() {
      infowindow.open(map, marker);
    };
  }

  // 인포윈도우를 닫는 클로저를 만드는 함수입니다 
  function makeOutListener(infowindow) {
    return function() {
      infowindow.close();
    };
  }

  clusterer.addMarkers(markers);
});