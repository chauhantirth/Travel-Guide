import React, { useState, useEffect, useCallback } from 'react';
// import GoogleMapReact from 'google-map-react';
import { Paper, Typography, useMediaQuery } from '@material-ui/core';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import Rating from '@material-ui/lab/Rating';

import {
  APIProvider,
  Map,
  useMap,
  Pin,
  InfoWindow,
  AdvancedMarker
} from "@vis.gl/react-google-maps";

import mapStyles from '../../mapStyles';
import useStyles from './styles.js';

const MapComponent = ({ onMapLoaded }) => {
  const map = useMap('main-map');
  useEffect(() => {
    if (map) {
      onMapLoaded(map);
    }
  }, [map, onMapLoaded]);
  return <>...</>;
};

const Mapp = ({ coords, bounds, places, setCoords, setBounds, setChildClicked, weatherData, firstVal, setfirstVal }) => {
  const matches = useMediaQuery('(min-width:600px)');
  const classes = useStyles();
  const [tempCoords, setTempCoords] = useState({});
  const [mapInstance, setMapInstance] = useState(null); 

  const updateBounds = () => {
    console.log("Updating Bounds")
    if (mapInstance) {
      const bnds = mapInstance.getBounds();
      if (bnds) {
        const ne = bnds.getNorthEast();
        const sw = bnds.getSouthWest();
        setBounds({ northEast: {lat: ne.lat(), lng: ne.lng()}, southWest: {lat: sw.lat(), lng: sw.lng()} });
      }
    }
  };

  const handleMapLoad = (map) => {
    setMapInstance(map);
  };

  if (!coords.lat) return <>Getting Location...</>
  return (
    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY}>
      <div className={classes.mapContainer}>
        <Map
          id={'main-map'}
          defaultZoom={13}
          // mapId={process.env.REACT_APP_GOOGLE_MAP_ID}
          mapId={"e3d114b3215310c7"}
          defaultCenter = {coords}
          disableDefaultUI={false}
          zoomControl={true}
          styles={mapStyles}
          onCenterChanged={(e) => {
            if(e.detail.center.lng > coords.lng) {
              if (e.detail.center.lng - coords.lng > 0.10) {
                setCoords({ lat: e.detail.center.lat, lng:e.detail.center.lng});
                updateBounds();
                console.log("(moved right) lng diff > .10");
              }
            } else {
              if(coords.lng - e.detail.center.lng > 0.10) {
                setCoords({ lat: e.detail.center.lat, lng:e.detail.center.lng});
                updateBounds();
                console.log("(moved left) lng diff > .10");
              }
            }

            if(e.detail.center.lat > coords.lat) {
              if (e.detail.center.lat - coords.lat > 0.10) {
                setCoords({ lat: e.detail.center.lat, lng:e.detail.center.lng});
                updateBounds();
                console.log("(moved up) lat diff > .10");
              }
            } else {
              if(coords.lat - e.detail.center.lat > 0.10) {
                setCoords({ lat: e.detail.center.lat, lng:e.detail.center.lng});
                updateBounds();
                console.log("(moved down) lat diff > .10");
              }
            }

            setTempCoords({ lat: e.detail.center.lat, lng:e.detail.center.lng});
            // console.log("Temp Coords: "+tempCoords);
          }}
          onBoundsChanged={(e) => {
            if (firstVal == 1) {
              updateBounds();
              setfirstVal(0);
            }
          }}
          >

          {places.length && places.map((place, i) => (
            <AdvancedMarker 
            position={{lat: Number(place.latitude), lng: Number(place.longitude)}} 
            key={i}
            draggable={false}
            onClick={() => {setChildClicked(i)}}>
              <Pin
                key={i}
                background={'#0f9d58'}
                borderColor={'#006425'}
                glyphColor={'#60d98f'}
                scale={0.8}
              >
              </Pin>
            </AdvancedMarker>
          ))}

          {/* {places.length && places.map((place, i) => (
          <div
            className={classes.markerContainer}
            lat={Number(place.latitude)}
            lng={Number(place.longitude)}
            key={i}
          >
            {!matches
              ? <LocationOnOutlinedIcon color="primary" fontSize="large" />
              : (
                <Paper elevation={3} className={classes.paper}>
                  <Typography className={classes.typography} variant="subtitle2" gutterBottom> {place.name}</Typography>
                  <img
                    className={classes.pointer}
                    src={place.photo ? place.photo.images.large.url : 'https://www.foodserviceandhospitality.com/wp-content/uploads/2016/09/Restaurant-Placeholder-001.jpg'}
                   alt='a'
                   />
                  <Rating name="read-only" size="small" value={Number(place.rating)} readOnly />
                </Paper>
              )}
          </div>
          ))} */}
        </Map>
        <MapComponent onMapLoaded={handleMapLoad}/>
      </div>
    </APIProvider>
  )

  // return (
  //   <div className={classes.mapContainer}>
  //     <GoogleMapReact
  //       bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAP_API_KEY }}
  //       defaultCenter={coords}
  //       center={coords}
  //       defaultZoom={14}
  //       margin={[50, 50, 50, 50]}
  //       options={{ disableDefaultUI: true, zoomControl: true, styles: mapStyles }}
  //       onChange={(e) => {
  //         setCoords({ lat: e.center.lat, lng: e.center.lng });
  //         setBounds({ ne: e.marginBounds.ne, sw: e.marginBounds.sw });
  //       }}
  //       onChildClick={(child) => setChildClicked(child)}
  //     >
        // {places.length && places.map((place, i) => (
        //   <div
        //     className={classes.markerContainer}
        //     lat={Number(place.latitude)}
        //     lng={Number(place.longitude)}
        //     key={i}
        //   >
        //     {!matches
        //       ? <LocationOnOutlinedIcon color="primary" fontSize="large" />
        //       : (
        //         <Paper elevation={3} className={classes.paper}>
        //           <Typography className={classes.typography} variant="subtitle2" gutterBottom> {place.name}</Typography>
        //           <img
        //             className={classes.pointer}
        //             src={place.photo ? place.photo.images.large.url : 'https://www.foodserviceandhospitality.com/wp-content/uploads/2016/09/Restaurant-Placeholder-001.jpg'}
        //            alt='a'
        //            />
        //           <Rating name="read-only" size="small" value={Number(place.rating)} readOnly />
        //         </Paper>
        //       )}
        //   </div>
  //       ))}
  //       {weatherData?.list?.length && weatherData.list.map((data, i) => (
  //         <div key={i} lat={data.coord.lat} lng={data.coord.lon}>
  //           <img src={`http://openweathermap.org/img/w/${data.weather[0].icon}.png`} height="70px" alt='a' />
  //         </div>
  //       ))}
  //     </GoogleMapReact>
  //   </div>
  // );
};

export default Mapp;
