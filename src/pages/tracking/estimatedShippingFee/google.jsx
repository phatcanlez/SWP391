import { Component } from "react";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      distance: "",
      duration: "",
      origin: "",
      destination: "",
    };
  }

  componentDidMount() {
    // No need to load a script for MapQuest, we will use fetch for API calls
  }

  calculateDistance(origin, destination) {
    const apiKey = "q2nZLaYsfNSKkjKB3ovJuaTnAwK3KX3i"; // Replace with your MapQuest API key
    const requestUrl = `http://www.mapquestapi.com/directions/v2/route?key=${apiKey}&from=${encodeURIComponent(
      origin
    )}&to=${encodeURIComponent(destination)}`;

    fetch(requestUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.info.statuscode === 0) {
          const distance = data.route.distance; // Distance in miles
          const duration = data.route.formattedTime; // Duration in HH:MM:SS
          const distanceInKm = (distance * 1.60934).toFixed(2); // Convert miles to kilometers
          this.setState({ distance: distanceInKm, duration });
        } else {
          console.error("Error fetching directions", data.info.messages);
        }
      })
      .catch((error) => {
        console.error("Error fetching directions", error);
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
        <div>
          <h3>Distance: {this.state.distance} km</h3>
          <h3>Duration: {this.state.duration}</h3>
        </div>
      </div>
    );
  }
}

export default App;
