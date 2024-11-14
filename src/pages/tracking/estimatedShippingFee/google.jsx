import { Component } from "react";

class App extends Component {
  constructor(props) {
    super(props);
    this.directionsService = null;
    this.directionsRenderer = null;
    this.state = {
      distance: "",
      duration: "",
    };
  }

  componentDidMount() {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${
      import.meta.env.VITE_GOOGLE_API_KEY
    }`; // Load Google Maps API
    script.async = true;
    script.defer = true;
    script.onload = () => {
      this.initializeMap(); // Call a function to initialize your map
    };
    document.body.appendChild(script);
  }

  initializeMap() {
    this.directionsService = new google.maps.DirectionsService(); // Now google is defined
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    const center = { lat: 21.0285, lng: 105.8542 }; // Hà Nội, Việt Nam

    const map = new google.maps.Map(document.getElementById("map"), {
      center: center,
      zoom: 12,
    });
    this.directionsRenderer.setMap(map); // Set the map for the directions renderer

    // Example addresses
  }

  calculateDistance(origin, destination) {
    const matrixService = new google.maps.DistanceMatrixService();

    matrixService.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false,
      },
      (response, status) => {
        if (status === "OK") {
          if (response.rows[0].elements[0].status === "OK") {
            const distance = response.rows[0].elements[0].distance.value / 1000;
            const duration = response.rows[0].elements[0].duration.text;

            this.setState({ distance, duration }, () => {
              console.log("Calculated distance (matrix):", distance);
              this.props.getDistance(distance);
            });

            this.tryShowRoute(origin, destination);
          } else {
            console.log(
              "Cannot calculate exact distance. Using approximate calculation."
            );
            this.calculateApproximateDistance(origin, destination);
          }
        } else {
          console.error("Error calculating distance:", status);
          this.calculateApproximateDistance(origin, destination);
        }
      }
    );
  }

  calculateApproximateDistance(origin, destination) {
    const geocoder = new google.maps.Geocoder();

    Promise.all([
      new Promise((resolve) =>
        geocoder.geocode({ address: origin }, (results, status) => {
          if (status === "OK") resolve(results[0].geometry.location);
          else resolve(null);
        })
      ),
      new Promise((resolve) =>
        geocoder.geocode({ address: destination }, (results, status) => {
          if (status === "OK") resolve(results[0].geometry.location);
          else resolve(null);
        })
      ),
    ]).then(([originLocation, destLocation]) => {
      if (originLocation && destLocation) {
        const distance =
          google.maps.geometry.spherical.computeDistanceBetween(
            originLocation,
            destLocation
          ) / 1000;

        const adjustedDistance = distance * 1.2;

        this.setState(
          {
            distance: Math.round(adjustedDistance * 100) / 100,
            duration: "Estimated time not available",
          },
          () => {
            console.log("Calculated approximate distance:", adjustedDistance);
            this.props.getDistance(adjustedDistance);
          }
        );
      }
    });
  }

  tryShowRoute(origin, destination) {
    const request = {
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING,
    };

    this.directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsRenderer.setDirections(result);
      } else {
        this.showMarkers(origin, destination);
      }
    });
  }

  showMarkers(origin, destination) {
    const geocoder = new google.maps.Geocoder();
    const bounds = new google.maps.LatLngBounds();

    geocoder.geocode({ address: origin }, (results, status) => {
      if (status === "OK") {
        const marker = new google.maps.Marker({
          map: this.directionsRenderer.getMap(),
          position: results[0].geometry.location,
          title: "Origin",
        });
        bounds.extend(results[0].geometry.location);
      }
    });

    geocoder.geocode({ address: destination }, (results, status) => {
      if (status === "OK") {
        const marker = new google.maps.Marker({
          map: this.directionsRenderer.getMap(),
          position: results[0].geometry.location,
          title: "Destination",
        });
        bounds.extend(results[0].geometry.location);
        this.directionsRenderer.getMap().fitBounds(bounds);
      }
    });
  }

  // New method to set origin and destination from outside
  setLocations = (origin, destination) => {
    this.setState({ origin, destination }, () => {
      this.calculateDistance(origin, destination); // Call calculateDistance after setting state
    });
  };

  render() {
    return (
      <div>
        <div
          id="map"
          style={{
            height: "500px",
            width: "80%",
            marginLeft: "10%",
            marginRight: "10%",
          }}
        ></div>{" "}
        {/* Map container */}
        <div>
          <h3 style={{ fontSize: 20, color: "#e25822" }}>
            Distance: {this.state.distance}
          </h3>
          <h3 style={{ fontSize: 20, color: "#e25822" }}>
            Duration: {this.state.duration}
          </h3>
        </div>
      </div>
    );
  }
}
export default App;
