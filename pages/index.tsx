// @ts-nocheck
import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import ServiceInquiryModal from "../components/ServiceInquiryModal";

const IndexPage = () => {
  const [searchRadius, setSearchRadius] = useState("");
  const [searchAddress, setSearchAddress] = useState("");
  const [displayLeftMenu, setDisplayLeftMenu] = useState(false);
  const [counter, setCounter] = useState(0);
  const [results, setResults] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalDetails, setModalDetails] = useState({});
  const [successToast, setSuccessToast] = useState(false);

  useEffect(() => {
    loadSearchesFromLocalStorage();
  }, []);

  const loadSearchesFromLocalStorage = () => {
    const savedSearches = JSON.parse(localStorage.getItem("searches")) || [];
    setSavedSearches(savedSearches);
  };

  const parseMarker = (input) => {
    let newObj = {};
    newObj.id = input.id;
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
    newObj.address = input.address;
    newObj.distance = input.distance;
    newObj.CID = input.CID;
    newObj.target = input.target;
    newObj.paths = input.paths;

    return newObj;
  };

  const saveSearchToLocalStorage = (searchData) => {
    const searches = JSON.parse(localStorage.getItem("searches")) || [];

    searches.unshift(searchData);

    if (searches.length > 100) {
      searches.length = 100;
    }

    localStorage.setItem("searches", JSON.stringify(searches));
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
      saveSearchToLocalStorage({
        search: { searchAddress, searchRadius },
        coords,
      });
    } catch (error) {
      console.error("failed to fetch markers for the entered address");
    }
  };

  const populateData = (coords, manualRadius = "") => {
    setDisplayLeftMenu(false);
    const mapComponent = document.querySelector("mass-google-map");
    mapComponent.center = {
      lat: coords[0]["lat"] || 39.9654502,
      lng: coords[0]["lng"] || -105.1241617,
    };
    mapComponent.searchResults = coords;
    mapComponent.legend = [
      {
        name: "markerPurple",
        color: "purple",
        title: "Fiber - Building",
      },
      {
        name: "markerGreen",
        color: "green",
        title: "Fiber - DataCenter",
      },
      {
        name: "markerOrange",
        color: "orange",
        title: "Fiber - Cell Site",
      },
      {
        name: "markerRed",
        color: "red",
        title: "Fiber - POP",
      },
      {
        name: "wifi",
        color: "purple",
        title: "Fiber - Wireless",
      },
      {
        name: "markerPurple",
        color: "purple",
        title: "Ethernet - Copper",
      },
      {
        name: "markerWhite",
        color: "black",
        title: "Ethernet - Coax",
      },
    ];
    mapComponent.zoom = parseInt(manualRadius || searchRadius) || 0;
    mapComponent.handleGetQuote = handleGetQuote;
  };

  const handleProgressBar = (isVisible, progress) => {
    const progressBar = document.querySelector("mass-progress-bar");
    progressBar.isVisible = isVisible;
    progressBar.progress = progress;
  };

  const handleGetQuote = (detail) => {
    setModalDetails({
      address: detail.address,
      recordID: detail.id,
      center: encodeURI(`(${detail.lat}, ${detail.lng})`),
      carriers: detail.CID,
    });
    setIsModalVisible(true);
  };
  return (
    <Layout title="Massive Networks Lit Building Locator">
      <mass-progress-bar />
      {isModalVisible && (
        <ServiceInquiryModal
          isVisible={isModalVisible}
          details={modalDetails}
          onClose={() => {
            setIsModalVisible(false);
            setSuccessToast(true);
          }}
        />
      )}

      {successToast && (
        <div
          id="toast-success"
          class="flex items-center w-full max-w-xs p-4 mr-4 mt-4 text-gray-500 bg-white rounded-lg shadow z-[100] absolute top-0 right-0"
          role="alert"
          onClick={() => setSuccessToast(false)}
        >
          <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg">
            <svg
              class="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
            </svg>
            <span class="sr-only">Check icon</span>
          </div>
          <div class="ms-3 text-sm font-normal">
            Quote submitted successfully
          </div>
          <button
            type="button"
            class="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8"
            data-dismiss-target="#toast-success"
            aria-label="Close"
          >
            <span class="sr-only">Close</span>
            <svg
              class="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
        </div>
      )}

      {displayLeftMenu && (
        <mass-leftmenu>
          <div className="flex flex-col items-center p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6 absolute top-4 left-4"
              onClick={() => setDisplayLeftMenu(false)}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>

            <h1>Last Searches</h1>
          </div>
          <div className="flex flex-col items-center overflow-y-auto h-screen">
            {savedSearches.map((item, index) => (
              <div
                className="max-w-sm mt-2 mb-2 p-6 bg-white border border-gray-200 rounded-lg shadow"
                key={index.toString}
              >
                <div className="flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-8 h-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                    />
                  </svg>

                  <div className="ml-3">
                    <p className="mb-3 font-normal text-gray-700">
                      {item.search.searchAddress}{" "}
                      <span className="font-normal text-grey-400">
                        (Radius: {item.search.searchRadius}km)
                      </span>
                    </p>
                    <a
                      href="#"
                      onClick={() =>
                        populateData(item.coords, item.search.searchRadius)
                      }
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Search
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-4 h-4 ml-2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </mass-leftmenu>
      )}

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
                width: "310px",
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
                Reset
              </mass-button>
              <mass-button
                button-id="ResetId"
                button-text="Reset Map"
                disabled={false}
                icon-position="none"
                size="medium"
                type="blue"
                tone="light"
                onClick={() => {
                  setDisplayLeftMenu(true);
                }}
              >
                History
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
