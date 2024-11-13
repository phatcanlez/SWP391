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
    const request = {
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING,
    };

    this.directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsRenderer.setDirections(result);
        const distance = result.routes[0].legs[0].distance.text;
        const duration = result.routes[0].legs[0].duration.text;
        this.setState({ distance, duration }, () => {
          if (distance > 0) {
            console.log("Calculated distance:", distance);
            this.props.getDistance(distance);
          }
        });
      } else {
        console.error("Error fetching directions", status);
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
          <h3>Distance: {this.state.distance}</h3>
          {/* <h3>Duration: {this.state.duration}</h3> */}
        </div>
      </div>
    );
  }
}
export default App;
