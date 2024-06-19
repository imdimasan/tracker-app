'use client';
import React, { useEffect, useState } from 'react';
import Map, { Marker, Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const Mapbox = () => {
  const [viewport, setViewport] = useState({
    latitude: 40.0,
    longitude: -74.5,
    zoom: 15,
  });
  const [coordinates, setCoordinates] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(null);

  useEffect(() => {
    //@ts-ignore
    const handlePositionUpdate = (position) => {
        const { latitude, longitude } = position.coords;
        const newCoordinates = [...coordinates, [longitude, latitude]];
        //@ts-ignore
        setCoordinates(newCoordinates);
        //@ts-ignore
        setCurrentPosition([longitude, latitude]);
    };
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            //@ts-ignore
        setCurrentPosition([longitude, latitude]);
        setViewport((prev) => ({
          ...prev,
          latitude,
          longitude,
        }));
      },
      (error) => console.error(error),
      { enableHighAccuracy: true }
    );

    const watchId = navigator.geolocation.watchPosition(
      handlePositionUpdate,
      (error) => console.error(error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
    //@ts-ignore
  }, []);

  useEffect(() => {
    if (currentPosition) {
      setViewport((prev) => ({
        ...prev,
        latitude: currentPosition[1],
        longitude: currentPosition[0],
      }));
    }
  }, [currentPosition]);

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <Map
        initialViewState={viewport}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        onMove={(evt) => setViewport(evt.viewState)}
      >
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
