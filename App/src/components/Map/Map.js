import React, { useState, useEffect } from 'react';

import {
  Pin,
  Map,
  useMap,
  InfoWindow,
  APIProvider,
  AdvancedMarker,
  useMapsLibrary
} from "@vis.gl/react-google-maps";

import mapStyles from './mapStyles';
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

const Mapp = ({ 
  coords, setCoords, setBounds, places, 
  setChildClicked, firstVal, setfirstVal, 
  farthestPlace, showRoute, routeItems }) => {
  
  const classes = useStyles();
  const [tempCoords, setTempCoords] = useState({});
  const [mapInstance, setMapInstance] = useState(null); 
  const [userLocBox, setuserLocBox] = useState(false);

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
          defaultZoom={13}
          // mapId={process.env.REACT_APP_GOOGLE_MAP_ID}
          mapId={"e3d114b3215310c7"}
          defaultCenter = {coords}
          disableDefaultUI={false}
          fullscreenControl={false}
          zoomControl={true}
          styles={mapStyles}
          onCenterChanged={(e) => {
            if(e.detail.center.lng > coords.lng) {
              if (e.detail.center.lng - coords.lng > 0.10) {
                setCoords({ lat: e.detail.center.lat, lng:e.detail.center.lng});
                updateBounds();
              }
            } else {
              if(coords.lng - e.detail.center.lng > 0.10) {
                setCoords({ lat: e.detail.center.lat, lng:e.detail.center.lng});
                updateBounds();
              }
            }

            if(e.detail.center.lat > coords.lat) {
              if (e.detail.center.lat - coords.lat > 0.10) {
                setCoords({ lat: e.detail.center.lat, lng:e.detail.center.lng});
                updateBounds();
              }
            } else {
              if(coords.lat - e.detail.center.lat > 0.10) {
                setCoords({ lat: e.detail.center.lat, lng:e.detail.center.lng});
                updateBounds();
              }
            }

            setTempCoords({ lat: e.detail.center.lat, lng:e.detail.center.lng});
          }}
          onBoundsChanged={(e) => {
            if (firstVal == 1) {
              updateBounds();
              setfirstVal(0);
            }
          }}
          >
          {!coords.lat ? <></> : (
            showRoute ? <div key={"userLocPointer"}></div> : (
              <div key={'unique-key099'}>
                <AdvancedMarker
                position={coords}
                draggable={false}
                onClick={() => {setuserLocBox(true)}}
                >
                  <Pin/>
                </AdvancedMarker>
              {userLocBox && (
                <InfoWindow position={coords} onCloseClick={() => {setuserLocBox(false)}}>
                  <p>Your Current Location.</p>
                </InfoWindow>
              )}
            </div>
            )
          )}

          {places.length && places.map((place, i) => (
            showRoute ? <div key={i}></div> : (
              <AdvancedMarker 
              position={{lat: Number(place.latitude), lng: Number(place.longitude)}} 
              key={i}
              draggable={false}
              onClick={() => {setChildClicked(i)}}
              >
                <Pin
                  key={i}
                  background={'#0f9d58'}
                  borderColor={'#006425'}
                  glyphColor={'#1A2130'}  // 60d98f
                  scale={0.8}
                >
                </Pin>
              </AdvancedMarker>
            )
          ))}

          {!mapInstance ? <></> : (
          <Directions 
          coords={coords}
          mapInstance={mapInstance}
          showRoute={showRoute}
          farthestPlace={farthestPlace}
          routeItems={routeItems}
          />
          )}
        </Map>
        <MapComponent onMapLoaded={handleMapLoad}/>
      </div>
    </APIProvider>
  )
};

const Directions = ({
    coords,
    mapInstance,
    showRoute,
    farthestPlace,
    routeItems,
  }) => {
  const map = useMap('main-map')
  const routesLibrary = useMapsLibrary("routes");

  const [directionsService, setDirectionsService] = useState();
  const [directionsRenderer, setDirectionsRenderer] = useState();
  const [currRoute, setCurrRoute] = useState();

  const mode = window.google.maps.TravelMode.DRIVING;

  useEffect(() => {
    if(!mapInstance || !routesLibrary) return;
    setDirectionsService(new routesLibrary.DirectionsService()); 
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer());
  }, [mapInstance, routesLibrary])


  useEffect(() => {
    try {
      const drr = directionsRenderer.getDirections();
      if(drr) {
        setCurrRoute(null);
        directionsRenderer.setDirections(null);
        directionsRenderer.setMap(null);
      }      
    } catch(TypeError) {
      console.log("")
    }

    if(!showRoute || routeItems.length == 0) return;

    const tempWaypoints = routeItems.map(item => ({
      location: {
        lat: Number(item.latitude),
        lng: Number(item.longitude)
      },
      stopover: true
    }));

    directionsService.route({
      origin: {lat: coords.lat, lng: coords.lng},
      destination: {lat: Number(farthestPlace.plc.latitude), lng: Number(farthestPlace.plc.longitude)},
      travelMode: mode,
      provideRouteAlternatives: false,
      optimizeWaypoints: true,
      waypoints: tempWaypoints
    }).then(response => {
      directionsRenderer.setMap(map);
      directionsRenderer.setDirections(response);
      setCurrRoute(response.routes);
    })
  }, [routeItems, showRoute])

  return null;
};


export default Mapp;
