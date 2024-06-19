'use client'
import React, { useState } from 'react'
import ReactMapGL, { Marker, WebMercatorViewport } from 'react-map-gl'

const applyToArray = (func, array) => func.apply(Math, array)

const getBoundsForPoints = (points) => {
  // Calculate corner values of bounds
  const pointsLong = points.map(point => point.coordinates._long)
  const pointsLat = points.map(point => point.coordinates._lat)
  const cornersLongLat = [
    [applyToArray(Math.min, pointsLong), applyToArray(Math.min, pointsLat)],
    [applyToArray(Math.max, pointsLong), applyToArray(Math.max, pointsLat)]
  ]
  // Use WebMercatorViewport to get center longitude/latitude and zoom
  const viewport = new WebMercatorViewport({ width: 800, height: 600 })
    .fitBounds(cornersLongLat, { padding: 200 }) // Can also use option: offset: [0, -100]
  const { longitude, latitude, zoom } = viewport
  return { longitude, latitude, zoom }
}

const Map = ({ points }) => {
  const bounds = getBoundsForPoints(points)

  const [viewport, setViewport] = useState({
    width: '100%',
    height: '50vh',
    ...bounds
  })

  return (
    <ReactMapGL
      {...viewport}
      onViewportChange={setViewport}
      mapStyle='mapbox://styles/mapbox/streets-v9'
      mapboxApiAccessToken={NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
    >
      {points.map((point, index) => (
        <Marker
          key={index}
          latitude={point.coordinates._lat}
          longitude={point.coordinates._long}
          offsetLeft={-20}
          offsetTop={-10}
        >
          <div>{point.name}</div>
        </Marker>
      ))}
    </ReactMapGL>
  )
}
export default Map