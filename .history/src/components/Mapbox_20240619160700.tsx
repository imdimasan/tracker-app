// components/Mapbox.js
import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

const Mapbox = () => {
  const [map, setMap] = useState(null);
  const [coordinates, setCoordinates] = useState([]);

  useEffect(() => {
    const initializeMap = ({ setMap, mapboxgl }) => {
      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-74.5, 40],
        zoom: 9,
      });

      map.on('load', () => {
        setMap(map);
        map.resize();

        navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const newCoordinates = [...coordinates, [longitude, latitude]];
            setCoordinates(newCoordinates);
            console.log(newCoordinates);

            if (map.getSource('route')) {
              map.getSource('route').setData({
                type: 'Feature',
                geometry: {
                  type: 'LineString',
                  coordinates: newCoordinates,
                },
              });
            } else {
              map.addSource('route', {
                type: 'geojson',
                data: {
                  type: 'Feature',
                  geometry: {
                    type: 'LineString',
                    coordinates: newCoordinates,
                  },
                },
              });

              map.addLayer({
                id: 'route',
                type: 'line',
                source: 'route',
                layout: {
                  'line-join': 'round',
                  'line-cap': 'round',
                },
                paint: {
                  'line-color': '#888',
                  'line-width': 8,
                },
              });
            }
          },
          (error) => console.error(error),
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
      });
    };

    if (!map) initializeMap({ setMap, mapboxgl });
  }, [map, coordinates]);

  return <div id="map" style={{ width: '100%', height: '500px' }} />;
};

export default Mapbox;
