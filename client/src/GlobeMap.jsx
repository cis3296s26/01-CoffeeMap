import { useEffect, useRef } from "react";

Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxYzY2OTJjZC1hYWUwLTQ2MTAtYmQ5ZS00MmUzZjc0ZjQzZDMiLCJpZCI6NDIxODEwLCJpYXQiOjE3NzY4NjAzNjZ9.KHUvngWOczOWaxffl0WzjGiMx0mwLTEKoEyxUxRbbKw";

function GlobeMap({ countryData }) {
  const ref = useRef();

  useEffect(() => {
    const Cesium = window.Cesium;

    const viewer = new Cesium.Viewer(ref.current, {
        animation: false,
        timeline: false,
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        fullscreenButton: false
    });

    countryData.forEach((country) => {
      if (!country.coords) return;

      const [lat, lng] = country.coords;

      viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(lng, lat),
        point: {
          pixelSize: 10,
          color: Cesium.Color.BROWN,
        },
      });
    });

    return () => viewer.destroy();
  }, [countryData]);

    return (
    <div
        ref={ref}
        style={{
        height: "100%",
        width: "100%",
        position: "relative",
        overflow: "hidden"
        }}
    />
    );
}

export default GlobeMap;