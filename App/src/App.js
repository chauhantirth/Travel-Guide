import React, { useState, useEffect, useCallback } from 'react';
import { CssBaseline, Grid } from '@material-ui/core';

import { getPlacesData } from './api/index.js';
import Header from './components/Header/Header';
import List from './components/List/List';
import Map from './components/Map/Map';
import DistanceCalculator from './components/Distance/Distance';

const App = () => {
  const [type, setType] = useState('restaurants');
  const [rating, setRating] = useState('');

  const [coords, setCoords] = useState({});
  const [bounds, setBounds] = useState(null);
  const [firstVal, setfirstVal] = useState(1);

  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [places, setPlaces] = useState([]);

  const [autocomplete, setAutocomplete] = useState(null);
  const [childClicked, setChildClicked] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [Temp, setTemp] = useState(1);

  const [showRoute, setShowRoute] = useState(false);
  const [routeItems, setRouteItems] = useState([]);
  const [farthestPlace, setFarthestPlace] = useState({place_id: null, dist: 0, unit: 'kms', plc: {}});

  
  const handleCheckboxChange = useCallback((item) => {
    setRouteItems(prevRouteItems => {
      if (prevRouteItems.includes(item)) {
        // Remove item if already selected
        return prevRouteItems.filter(place => place.location_id !== item.location_id);
      } else {
        // Add item if not selected
        return [...prevRouteItems, item];
      }
    });
  });



  useEffect(() => {
    if (!routeItems.length) {
      setFarthestPlace({ place_id: null, dist: 0, unit: 'kms', plc: {}});
      return;
    }

    const farthest = routeItems.reduce((max, place) => {
      const itemDist = DistanceCalculator(coords, { lat: place.latitude, lng: place.longitude });
      if (itemDist > max.dist) {
        return { place_id: place.location_id, dist: itemDist, unit: 'kms', plc: place };
      }
      return max;
    }, { place_id: null, dist: 0, unit: 'kms', plc: {}});

    setFarthestPlace(farthest);

  }, [routeItems]);



  useEffect(() => {

    const options = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 0,
    };
    const success = (pos) => {
      const crd = pos.coords;
      setCoords({ lat: crd.latitude, lng: crd.longitude});
    }
    const error = (err) => {
      setCoords({ lat: 23.0272933, lng: 72.5574949 });
    }
    navigator.geolocation.getCurrentPosition(success, error, options);
  }, []);
  

  useEffect(() => {
    const filtered = places.filter((place) => Number(place.rating) > rating);
    setFilteredPlaces(filtered);
  }, [rating]);


  useEffect(() => {
    if (bounds && Temp <= 40) {
      setIsLoading(true);

      getPlacesData(type, bounds.southWest, bounds.northEast)
        .then((data) => {
          setPlaces(data.filter((place) => place.name && place.num_reviews >= 0));
          setFilteredPlaces([]);
          setRating('');
          setIsLoading(false);
        });
      setTemp(Temp + 1);
    }
  }, [bounds, type]);


  const onLoad = (autoC) => setAutocomplete(autoC);


  const onPlaceChanged = () => {
    setCoords({});
    setfirstVal(1);
    const lat = autocomplete.getPlace().geometry.location.lat();
    const lng = autocomplete.getPlace().geometry.location.lng();
    setCoords({ lat: lat, lng: lng });
  };


  return (
    <>
      <CssBaseline />
      <Header onPlaceChanged={onPlaceChanged} onLoad={onLoad} />
      <Grid container spacing={3} style={{ width: '100%' }}>
        <Grid item xs={12} md={4}>
          <List
            isLoading={isLoading}
            childClicked={childClicked}
            setChildClicked={setChildClicked}
            places={filteredPlaces.length ? filteredPlaces : places}
            type={type}
            setType={setType}
            rating={rating}
            setRating={setRating}
            routeItems={routeItems}
            setRouteItems={setRouteItems}
            showRoute={showRoute}
            setShowRoute={setShowRoute}
            handleCheckboxChange={handleCheckboxChange}
          />
        </Grid>
        <Grid item xs={12} md={8} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Map
            coords={coords}
            setCoords={setCoords}
            setBounds={setBounds}
            places={filteredPlaces.length ? filteredPlaces : places}
            setChildClicked={setChildClicked}
            firstVal={firstVal}
            setfirstVal={setfirstVal}
            farthestPlace={farthestPlace}
            showRoute={showRoute}
            routeItems={routeItems}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default App;
