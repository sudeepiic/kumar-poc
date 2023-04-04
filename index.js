function initMap() {
  const bounds = new google.maps.LatLngBounds();
  const markersArray = [];
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 13.10017592780984, lng: 77.59410554160017 },
    zoom: 10,
  });
  // initialize services
  // const geocoder = new google.maps.Geocoder();
  const service = new google.maps.DistanceMatrixService();
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);
  // build request
  const originArray = [{ lat: 13.10017592780984, lng: 77.59410554160017 }];
  const destinationArray = [
    { lat: 13.0623983, lng: 77.51820989999999 },
    { lat: 13.0627621, lng: 77.51799740000001 },
    { lat: 13.0648311, lng: 77.517247 },
    { lat: 13.056048, lng: 77.51347400000009 },
    { lat: 13.042341019101595, lng: 77.55467234499216 },
    { lat: 13.0575157, lng: 77.51066370000001 },
    { lat: 13.16704440373213, lng: 77.68160944716794 },
  ];
  function calculateAndDisplayRoute(
    index,
    directionsService,
    directionsRenderer
  ) {
    directionsService
      .route({
        origin: originArray[0],
        destination: destinationArray[index],
        travelMode: google.maps.TravelMode.DRIVING,
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
      })
      .catch((e) => window.alert("Directions request failed due to " + status));
  }
  function drawPath(e) {
    let index = e.target.parentNode.getAttribute("data-val");
    if (index) {
      calculateAndDisplayRoute(
        index - 1,
        directionsService,
        directionsRenderer
      );
    }
  }
  document.getElementById("sidebar-text").addEventListener("click", drawPath);

  const request = {
    origins: originArray,
    destinations: destinationArray,
    travelMode: google.maps.TravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.METRIC,
    avoidHighways: false,
    avoidTolls: false,
  };

  // get distance matrix response
  service.getDistanceMatrix(request).then((response) => {
    // put response
    response.rows[0].elements.forEach((res, index) => {
      const distance = res.distance.text;
      const duration = res.duration.text;
      console.log(`distance: ${distance}, duration: ${duration}`);
      const html = `
        <div class="path-marker">
          <div class="distance">${distance}</div>
          <div class="duration">${duration}</div>
        </div>`;
      document
        .querySelectorAll(".path-mark")
        [index].insertAdjacentHTML("beforeend", html);
    });

    // show on map
    const originList = response.originAddresses;
    const destinationList = response.destinationAddresses;
    console.log(originList, destinationList);
    deleteMarkers(markersArray);

    const showGeocodedAddressOnMap = (asDestination) => {
      const handler = ({ results }) => {
        map.fitBounds(bounds.extend(results[0].geometry.location));
        markersArray.push(
          new google.maps.Marker({
            map,
            position: results[0].geometry.location,
            label: asDestination ? "D" : "O",
          })
        );
      };
      return handler;
    };

    // for (let i = 0; i < originList.length; i++) {
    //   const results = response.rows[i].elements;

    //   geocoder
    //     .geocode({ address: originList[i] })
    //     .then(showGeocodedAddressOnMap(false));

    //   for (let j = 0; j < results.length; j++) {
    //     geocoder
    //       .geocode({ address: destinationList[j] })
    //       .then(showGeocodedAddressOnMap(true));
    //   }
    // }
  });
}

function deleteMarkers(markersArray) {
  for (let i = 0; i < markersArray.length; i++) {
    markersArray[i].setMap(null);
  }

  markersArray = [];
}

window.initMap = initMap;
