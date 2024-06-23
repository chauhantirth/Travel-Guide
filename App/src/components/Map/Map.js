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
  InfoWindow
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

const Mapp = ({ coords, places, setCoords, setBounds, setChildClicked, weatherData }) => {
  const matches = useMediaQuery('(min-width:600px)');
  const classes = useStyles();
  const [mapInstance, setMapInstance] = useState(null); 

  const updateBounds = () => {
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
          on
          defaultZoom={13}
          defaultCenter = {coords}
          // center={coords}
          disableDefaultUI={false}
          zoomControl={true}
          styles={mapStyles}
          onCenterChanged={(e) => {
            // console.log("Coords Changed")
            setCoords({ lat: e.detail.center.lat, lng:e.detail.center.lng});
            // updateBounds();
          }}
          onBoundsChanged={(e) => {
            console.log("Changing Bounds")
            updateBounds();
          }}
          // TODO: Add onZoomChange to handle bounds and coords changes
          >
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
  //       {places.length && places.map((place, i) => (
  //         <div
  //           className={classes.markerContainer}
  //           lat={Number(place.latitude)}
  //           lng={Number(place.longitude)}
  //           key={i}
  //         >
  //           {!matches
  //             ? <LocationOnOutlinedIcon color="primary" fontSize="large" />
  //             : (
  //               <Paper elevation={3} className={classes.paper}>
  //                 <Typography className={classes.typography} variant="subtitle2" gutterBottom> {place.name}</Typography>
  //                 <img
  //                   className={classes.pointer}
  //                   src={place.photo ? place.photo.images.large.url : 'https://www.foodserviceandhospitality.com/wp-content/uploads/2016/09/Restaurant-Placeholder-001.jpg'}
  //                  alt='a'
  //                  />
  //                 <Rating name="read-only" size="small" value={Number(place.rating)} readOnly />
  //               </Paper>
  //             )}
  //         </div>
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
