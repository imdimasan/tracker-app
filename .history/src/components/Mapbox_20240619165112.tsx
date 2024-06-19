'use client'
import React, { useState } from 'react';
import Map, { GeolocateControl, Marker, Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const Mapbox = () => {
  const [viewport, setViewport] = useState({
    latitude: 40.0,
    longitude: -74.5,
    zoom: 15,
  });
  const [coordinates, setCoordinates] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(null);

  const handleGeolocate = (position) => {
    const { latitude, longitude } = position.coords;
    setCurrentPosition([longitude, latitude]);
    setViewport((prev) => ({
      ...prev,
      latitude,
      longitude,
    }));
  };

  const handleMove = (evt) => {
    setViewport(evt.viewState);
  };

  console.log("currentPosition", currentPosition);
  

  const handleGeolocateUpdate = (position) => {
    const { latitude, longitude } = position.coords;
    const newCoordinates = [...coordinates, [longitude, latitude]];
    setCoordinates(newCoordinates);
    setCurrentPosition([longitude, latitude]);
  };

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <Map
        initialViewState={viewport}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        onMove={handleMove}
      >
        <GeolocateControl
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
          showUserLocation={true}
          onGeolocate={handleGeolocateUpdate}
        //   onLocationUpdate={handleGeolocateUpdate}
        />
        {currentPosition && (
          <Marker longitude={currentPosition[0]} latitude={currentPosition[1]} />
        )}
        {coordinates.length > 1 && (
          <Source
            id="route"
            type="geojson"
            data={{
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates,
              },
            }}
          >
            <Layer
              id="route"
              type="line"
              paint={{
                'line-color': '#888',
                'line-width': 8,
              }}
            />
          </Source>
        )}
      </Map>
    </div>
  );
};

export default Mapbox;
