import React, { useState, useEffect } from 'react';
import { CssBaseline, Grid } from '@material-ui/core';

import { getPlacesData, getWeatherData } from './api/index.js';
import Header from './components/Header/Header';
import List from './components/List/List';
import Map from './components/Map/Map';

const App = () => {
  const [type, setType] = useState('restaurants');
  const [rating, setRating] = useState('');

  const [coords, setCoords] = useState({});
  const [bounds, setBounds] = useState(null);

  const [weatherData, setWeatherData] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [places, setPlaces] = useState([]);

  const [autocomplete, setAutocomplete] = useState(null);
  const [childClicked, setChildClicked] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {

    const options = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 0,
    };
  
    const success = (pos) => {
      const crd = pos.coords;
      console.log("Your current position is:");
      console.log(`Latitude : ${crd.latitude}`);
      console.log(`Longitude: ${crd.longitude}`);
      // console.log(`More or less ${crd.accuracy} meters.`);

      setCoords({ lat: crd.latitude, lng: crd.longitude});
    }
  
    const error = (err) => {
      console.warn(`ERROR(${err.code}): ${err.message}`);
      console.log("Using Default Co-ordinates for now.")
      setCoords({ lat: 42.1596, lng: -70.8217 });
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
  }, []);
  // console.log("New Co-Ords"+coords);
  // console.log("Changed Bounds" + bounds);
  
  useEffect(() => {
    const filtered = places.filter((place) => Number(place.rating) > rating);
    setFilteredPlaces(filtered);
  }, [rating]);

  useEffect(() => {
    if (bounds) {
      setIsLoading(true);

      // getWeatherData(coords.lat, coords.lng)
      //   .then((data) => setWeatherData(data));

      // getPlacesData(type, bounds.sw, bounds.ne)
      //   .then((data) => {
      //     setPlaces(data.filter((place) => place.name && place.num_reviews > 0));
      //     setFilteredPlaces([]);
      //     setRating('');
      //     setIsLoading(false);
      //   });
    }
  }, [bounds, type]);

  const onLoad = (autoC) => setAutocomplete(autoC);

  const onPlaceChanged = () => {
    const lat = autocomplete.getPlace().geometry.location.lat();
    const lng = autocomplete.getPlace().geometry.location.lng();

    setCoords({ lat, lng });
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
            places={filteredPlaces.length ? filteredPlaces : places}
            type={type}
            setType={setType}
            rating={rating}
            setRating={setRating}
          />
        </Grid>
        <Grid item xs={12} md={8} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Map
            setChildClicked={setChildClicked}
            setBounds={setBounds}
            setCoords={setCoords}
            coords={coords}
            places={filteredPlaces.length ? filteredPlaces : places}
            weatherData={weatherData}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default App;
