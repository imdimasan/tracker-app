'use client'
import React, { useEffect, useRef, useState } from 'react';
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
  const geoControlRef = useRef(null);
  const mapRef = useRef(null);

  const handleGeolocate = (position) => {
    const { latitude, longitude } = position.coords;
    setCurrentPosition([longitude, latitude]);
    setViewport({
      latitude,
      longitude,
      zoom: 15,
    });
    mapRef.current.flyTo({ center: [longitude, latitude], zoom: 15 });
  };

  const handleMove = (evt) => {
    setViewport(evt.viewState);
  };

  const handleGeolocateUpdate = (position) => {
    const { latitude, longitude } = position.coords;
    const newCoordinates = [...coordinates, [longitude, latitude]];
    setCoordinates(newCoordinates);
    setCurrentPosition([longitude, latitude]);
  };

  const handleLoad = () => {
    if (geoControlRef.current) {
      geoControlRef.current.trigger();
    }
  };

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <Map
        ref={mapRef}
        initialViewState={viewport}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        onMove={handleMove}
        onLoad={handleLoad}
      >
        <GeolocateControl
          ref={geoControlRef}
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
          showUserLocation={true}
          onGeolocate={handleGeolocate}
          onLocationUpdate={handleGeolocateUpdate}
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
