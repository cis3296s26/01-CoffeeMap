import { useEffect, useRef, useState} from "react";

Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxYzY2OTJjZC1hYWUwLTQ2MTAtYmQ5ZS00MmUzZjc0ZjQzZDMiLCJpZCI6NDIxODEwLCJpYXQiOjE3NzY4NjAzNjZ9.KHUvngWOczOWaxffl0WzjGiMx0mwLTEKoEyxUxRbbKw";

function GlobeMap({ countryData, reviewsByCountry }) {
  const ref = useRef();
  const [selectedCountry, setSelectedCountry] = useState(null);

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
          pixelSize: 15,
          color: Cesium.Color.BROWN,
        },
        properties: {
          countryData: country,
          reviews: reviewsByCountry[country.name] || []
    }
      });
    });

    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    handler.setInputAction((click) => {
      const pickedObject = viewer.scene.pick(click.position);
      console.log("clicked:", pickedObject);
      if (Cesium.defined(pickedObject) && pickedObject.id) {
        const entity = pickedObject.id;

        const country = entity.properties?.countryData?.getValue();
        const reviews = entity.properties?.reviews?.getValue();

        setSelectedCountry({
          ...country,
          reviews
        });
      } else {
        setSelectedCountry(null);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    return () => {
      handler.destroy();
      viewer.destroy();
  }; 

},[countryData, reviewsByCountry]);

    return (
          <div style={{ position: "relative", height: "100%", width: "100%" }}>
    <div
        ref={ref}
        style={{
        height: "100%",
        width: "100%",
        overflow: "hidden"
        }}
    />
          {selectedCountry && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "20px",
            background: "white",
            padding: "15px",
            borderRadius: "8px",
            width: "300px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            zIndex: 1000
          }}
        >
          <h5>{selectedCountry.name}</h5>

          <p><strong>Samples:</strong> {selectedCountry.sampleCount}</p>

          {selectedCountry.avgScore && (
            <p><strong>Avg Score:</strong> {selectedCountry.avgScore}</p>
          )}

          {selectedCountry.reviews?.length > 0 && (
            <>
              <p><strong>Reviews:</strong> {selectedCountry.reviews.length}</p>
              <ul style={{ paddingLeft: "18px" }}>
                {selectedCountry.reviews.slice(0, 3).map((r) => (
                  <li key={r.id}>
                    <strong>{r.title}</strong>
                    <div style={{ fontSize: "0.85em" }}>
                      {r.roaster || "Unknown"} {r.rating ? `• ${r.rating}` : ""}
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}

          <button
            onClick={() => setSelectedCountry(null)}
            className="btn btn-sm btn-dark mt-2"
          >
            Close
          </button>
        </div>
      )}
    </div>
    );
}

export default GlobeMap;