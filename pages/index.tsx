// @ts-nocheck
import Layout from "../components/Layout";
import { useState } from "react";

const IndexPage = () => {
  const [searchRadius, setSearchRadius] = useState("");
  const [searchAddress, setSearchAddress] = useState("");
  const [counter, setCounter] = useState(0);
  const [results, setResults] = useState([]);

  const parseMarker = (input) => {
    let newObj = {};
    newObj.lat = parseFloat(input.lat);
    newObj.lng = parseFloat(input.lng);
    newObj.isDC = parseInt(input.isDC, 10);
    newObj.isPOP = input.isPOP ? parseInt(input.isPOP, 10) : 0;
    newObj.isCELL = input.isCELL ? parseInt(input.isCELL, 10) : 0;
    newObj.fiberReady = parseInt(input.fiberReady, 10);
    newObj.coaxReady = parseInt(input.coaxReady, 10);
    newObj.wirelessReady = input.wirelessReady
      ? parseInt(input.wirelessReady, 10)
      : 0;
    newObj.ethernetReady = input.ethernetReady
      ? parseInt(input.ethernetReady, 10)
      : 0;

    return newObj;
  };

  const search = async () => {
    const lat = "39.9654502";
    const lng = "-105.1241617";
    // const radius = "1";
    // const address = "1255 Treat Blvd, Walnut Creek, CA 94597, USA";
    const center = "(39.9654502, -105.1241617)";

    const queryParams = new URLSearchParams({
      lat,
      lng,
      radius: searchRadius,
      address: searchAddress,
      center,
    }).toString();
    const apiUrl = `/api/maps?${queryParams}`;

    try {
      const interval = setInterval(() => {
        setCounter((prevCounter) => {
          if (prevCounter !== 99) {
            handleProgressBar(true, prevCounter + 1);
            return prevCounter + 1;
          }
          return prevCounter;
        });
      }, 500);
      const res = await fetch(apiUrl);
      clearInterval(interval);
      setCounter(0);
      const body = await res.json();
      const coords = body.map((marker) => parseMarker(marker));
      populateData(coords);
      handleProgressBar(false, 0);
    } catch (error) {
      console.error("failed to fetch markers for the entered address");
    }
  };

  const populateData = (coords) => {
    const mapComponent = document.querySelector("mass-google-map");
    mapComponent.center = {
      lat: coords[0]["lat"] || 39.9654502,
      lng: coords[0]["lng"] || -105.1241617,
    };
    mapComponent.coordinates = coords;
    mapComponent.legend = [
      {
        name: "mapCircle",
        color: "purple",
        title: "Fiber - Building",
      },
      {
        name: "mapCircle",
        color: "green",
        title: "Fiber - DataCenter",
      },
      {
        name: "mapCircle",
        color: "orange",
        title: "Fiber - Cell Site",
      },
      {
        name: "mapCircle",
        color: "red",
        title: "Fiber - POP",
      },
      {
        name: "mapCircle",
        color: "purple",
        title: "Ethernet - Copper",
      },
      {
        name: "mapCircle",
        color: "black",
        title: "Ethernet - Coax",
      },
    ];
    mapComponent.zoom = parseInt(searchRadius) || 0;
  };

  const handleProgressBar = (isVisible, progress) => {
    const progressBar = document.querySelector("mass-progress-bar");
    progressBar.isVisible = isVisible;
    progressBar.progress = progress;
  };
  return (
    <Layout title="Massive Networks Lit Building Locator">
      <mass-progress-bar />
      <div className="flex flex-col min-h-screen">
        <div
          style={{ position: "relative", zIndex: 10, backgroundColor: "white" }}
        >
          {/* Top row with search input and buttons */}
          <div
            style={{ display: "flex", width: "100%", alignItems: "center" }}
            className="flex w-full"
          >
            <div
              style={{ width: "50%", margin: "5px 10px" }}
              className="w-full"
            >
              <mass-text-field
                label-position="left"
                label-text="Search Location"
                input-placeholder-text="Placeholder"
                input-type="text"
                max-length={50}
                value={searchAddress}
                ref={(el) => {
                  if (el) {
                    el.addEventListener("valueChange", (event) => {
                      setSearchAddress(event.detail);
                    });
                  }
                }}
              />
            </div>
            <div
              style={{ width: "50%", margin: "5px 10px" }}
              className="w-full mb-4 lg:mb-0"
            >
              <mass-select-field
                input-id="input00"
                label="Search Radius"
                type="light"
                label-position="left"
                is-disabled={false}
                has-error={false}
                ref
                error-message="No this is wrong"
                options={JSON.stringify([
                  { name: "-", value: "-" },
                  { name: "200", value: "200 kms" },
                  { name: "20", value: "20 kms" },
                  { name: "10", value: "10 kms" },
                  { name: "5", value: "5 kms" },
                  { name: "1", value: "1 km" },
                  { name: ".5", value: ".5 km (1600ft)" },
                  { name: ".3", value: ".3 km (1000ft)" },
                ])}
                ref={(el) => {
                  if (el) {
                    el.addEventListener("valueChange", (event) => {
                      setSearchRadius(event.detail);
                    });
                  }
                }}
                value={searchRadius}
              />
            </div>
            <div
              style={{
                marginLeft: "auto",
                padding: "5px 2px",
                width: "240px",
                justifyContent: "space-around",
                display: "flex",
              }}
              className="flex space-x-2 ml-auto"
            >
              <mass-button
                button-id="SearchId"
                button-text="Search"
                disabled={false}
                icon-position="none"
                size="medium"
                type="green"
                tone="light"
                onClick={search}
                is-disabled={!searchAddress || !searchRadius}
              >
                Search
              </mass-button>
              <mass-button
                button-id="ResetId"
                button-text="Reset Map"
                disabled={false}
                icon-position="none"
                size="medium"
                type="red"
                tone="light"
                onClick={() => {
                  setSearchAddress("");
                  setSearchRadius("");
                }}
              >
                Reset Map
              </mass-button>
            </div>
          </div>

          {/* Second row with results select */}
          <div
            style={{ display: "flex", width: "100%", alignItems: "center" }}
            className="flex w-full"
          >
            <div
              style={{ width: "100%", margin: "5px 10px" }}
              className="w-full"
            >
              <mass-select-field
                input-id="input00"
                label="Results:"
                type="light"
                label-position="left"
                is-disabled={false}
                has-error={false}
                error-message="Select valid distance"
                options={JSON.stringify(results)}
              />
            </div>
          </div>
        </div>

        {/* Map component */}
        <div className="flex-grow w-full" style={{ width: "100%", zIndex: 1 }}>
          <mass-google-map style={{ width: "100%" }} />
        </div>
      </div>
    </Layout>
  );
};

export default IndexPage;
