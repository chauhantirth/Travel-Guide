import React, { useState, useEffect, createRef } from 'react';
import { CircularProgress, Grid, Typography, InputLabel, MenuItem, FormControl, Select, Button } from '@material-ui/core';

import PlaceDetails from '../PlaceDetails/PlaceDetails';
import useStyles from './styles.js';

const List = ({ 
  isLoading, childClicked, setChildClicked, 
  places, type, setType, rating, setRating,
  routeItems, setRouteItems, showRoute, setShowRoute, 
  handleCheckboxChange
  }) => {

  const [elRefs, setElRefs] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    setElRefs((refs) => Array(places.length).fill().map((_, i) => refs[i] || createRef()));
  }, [places]);

  return (
    <div className={classes.container}>
      <Typography variant="h5">Restaurants, Hotels & Attractions around You</Typography>
      {isLoading ? (
        <div className={classes.loading}>
          <CircularProgress size="5rem" />
        </div>
      ) : (
        <>
          <FormControl className={classes.formControl}>
            <InputLabel id="type">Type</InputLabel>
            <Select id="type" value={type} onChange={(e) => setType(e.target.value)}>
              <MenuItem value="restaurants">Restaurants</MenuItem>
              <MenuItem value="hotels">Hotels</MenuItem>
              <MenuItem value="attractions">Attractions</MenuItem>
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel id="rating">Rating</InputLabel>
            <Select id="rating" value={rating} onChange={(e) => setRating(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="3">Above 3.0</MenuItem>
              <MenuItem value="4">Above 4.0</MenuItem>
              <MenuItem value="4.5">Above 4.5</MenuItem>
            </Select>
          </FormControl>

          {!showRoute ?
            <Button size="small" color="primary" className={classes.routeButton} 
            onClick={() => setShowRoute(true)}
            disabled={routeItems.length == 0}
            >
            Show Route
          </Button> : (
            <Button size="small" color="primary" className={classes.routeButton} 
            onClick={() => {
              setShowRoute(false);
              setRouteItems([]);
              }}>
            Disable Route
            </Button>
          )}
          
          <Grid container spacing={3} className={classes.list}>
            {places?.map((place, i) => (
              <Grid ref={elRefs[i]} key={i} item xs={12}>
                <PlaceDetails 
                place={place} 
                selected={Number(childClicked) === i} 
                refProp={elRefs[i]} 
                setChildClicked={setChildClicked}
                routeItems={routeItems}
                indexNumber={i}
                handleCheckboxChange={handleCheckboxChange}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </div>
  );
};

export default List;
