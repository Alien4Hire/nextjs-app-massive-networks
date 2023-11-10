// @ts-nocheck
import Link from "next/link";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";

const IndexPage = () => {
  const [searchRadius, setSearchRadius] = useState("1");
  const [searchAddress, setSearchAddress] = useState("");

  const search = async () => {
    const lat = "37.9277412";
    const lng = "-122.0589753";
    const radius = "1";
    const address = "1255 Treat Blvd, Walnut Creek, CA 94597, USA";
    const center = "(37.9277412, -122.0589753)";

    const queryParams = new URLSearchParams({
      lat,
      lng,
      radius: searchRadius,
      address: searchAddress,
      center,
    }).toString();
    const apiUrl = `/api/maps?${queryParams}`;

    try {
      const res = await fetch(apiUrl);
      const body = await res.json();
      const coords = body.map((marker) => ({
        lat: parseFloat(marker.lat),
        lng: parseFloat(marker.lng),
        ...(marker.isDC !== "1" ? {} : { isDC: marker.isDC }),
        ...(marker.isCELL !== "1" ? {} : { isCELL: marker.isCELL }),
        ...(marker.isPOP !== "1" ? {} : { isPOP: marker.isPOP }),
        ...(marker.wirelessReady !== "1"
          ? {}
          : { wirelessReady: marker.wirelessReady }),
        ...(marker.fiberReady !== "1" ? {} : { fiberReady: marker.fiberReady }),
      }));
      populateData(coords);
    } catch (error) {
      console.error("failed to fetch markers for the entered address");
    }
  };

  const populateData = (coords) => {
    console.log(coords);
    const mapComponent = document.querySelector("mass-google-map");
    mapComponent.center = {
      lat: coords[0]["lat"] || 37.7749,
      lng: coords[0]["lng"] || -122.4194,
    };
    mapComponent.coordinates = coords;
    mapComponent.legend = {
      items: [
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
          name: "wifi",
          color: "purple",
          title: "Fiber - Wireless",
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
      ],
    };
    console.log(mapComponent);
  };
  return (
    <Layout title="Home | Next.js + TypeScript Example">
      <div className="bg-custom-gray flex flex-col min-h-screen container mx-auto px-4 ">
        <div
          style={{ position: "relative", zIndex: 10, backgroundColor: "white" }}
        >
          {/* Top row with search input and buttons */}
          <div
            style={{ display: "flex", width: "100%", alignItems: "center" }}
            className="bg-custom-gray flex w-full mb-4"
          >
            <div
              style={{ width: "38%", margin: "5px 10px" }}
              className="w-full pr-4 mb-4 lg:mb-0"
            >
              <mass-text-field
                label-position="left"
                label-text="Search Location:"
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
              style={{ width: "38%", margin: "5px 10px" }}
              className="w-full pr-4 mb-4 lg:mb-0"
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
                size="large"
                type="green"
                tone="light"
                onClick={search}
              >
                Search
              </mass-button>
              <mass-button
                button-id="ResetId"
                button-text="Reset Map"
                disabled={false}
                icon-position="none"
                size="large"
                type="red"
                tone="light"
              >
                Reset Map
              </mass-button>
            </div>
          </div>

          {/* Second row with results select */}
          <div style={{ paddingBottom: "10px" }} className="flex-none mb-4">
            <mass-select-field
              input-id="input00"
              label="Results:"
              type="light"
              label-position="left"
              is-disabled={false}
              has-error={false}
              error-message="Select valid distance"
              options={JSON.stringify([
                {
                  name: "5406 CROSSINGS DR, ROCKLIN, CA 95677",
                  value: "5406 CROSSINGS DR, ROCKLIN, CA 95677",
                },
                {
                  name: "8050 N PALM AVE, FRESNO, CA, 93711-5510, US",
                  value: "8050 N PALM AVE, FRESNO, CA, 93711-5510, US",
                },
                {
                  name: "4615 SARATOGA PL, HUBER HEIGHTS, OH, 45424-3683, US",
                  value: "4615 SARATOGA PL, HUBER HEIGHTS, OH, 45424-3683, US",
                },
                {
                  name: "4615 SARATOGA PL, HUBER HEIGHTS, OH, 45424, US",
                  value: "4615 SARATOGA PL, HUBER HEIGHTS, OH, 45424, US",
                },
                {
                  name: "255 OLD SANFORD OVIEDO RD, WINTER SPRINGS, FL, 32708-2651, US",
                  value:
                    "255 OLD SANFORD OVIEDO RD, WINTER SPRINGS, FL, 32708-2651, US",
                },
                {
                  name: "255 OLD SANFORD OVIEDO RD, WINTER SPGS, FL, 32708, US",
                  value:
                    "255 OLD SANFORD OVIEDO RD, WINTER SPGS, FL, 32708, US",
                },
              ])}
            />
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
