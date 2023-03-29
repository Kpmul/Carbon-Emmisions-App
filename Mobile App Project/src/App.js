import "./styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { Component } from "react";
import { CFormCheck } from "@coreui/bootstrap-react";
import { CFormSelect } from "@coreui/bootstrap-react";
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";

import SecondChild from "./Carousel";
import Sample3 from "./Sample3";
import logo from "./images/leaf.jpeg";
import Badge from "react-bootstrap/Badge";
import Cities from "./CitiesAndCarbon";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      choice: "Home",
      //variableForFlight: 0,
      //variableForCar: 0,
      //variableForTrain: 0,
      distance: null,
      locations: Cities,
      destination: { name: null, gps: [0, 0], drivability: 0, flights: null },
      origin: { name: null, gps: [0, 0], drivability: 0, flights: null },
      connection: { name: null, gps: [0, 0], drivability: 0, flights: null }, //In case of connecting flights
      trip: 1, //trip = 1 for one trip and 2 for return trip
      conarray: [],
      fuelType: null,
      fuelValues: [0.192, 0.171, 0.053], //Petrol, Diesel, Electric
      carbonValues: { Flight: 0.255, Car: null, Train: 0.006 }
    };

    this.buttonFlightAction = this.buttonFlightAction.bind(this);
    this.buttonCarAction = this.buttonCarAction.bind(this);
    this.buttonTrainAction = this.buttonTrainAction.bind(this);
    this.handleDestinationChange = this.handleDestinationChange.bind(this);
    this.handleOriginChange = this.handleOriginChange.bind(this);
    this.handleDistanceChange = this.handleDistanceChange.bind(this);
    this.handleRoundTrip = this.handleRoundTrip.bind(this);
    this.handleOneTrip = this.handleOneTrip.bind(this);
    this.handleCarDistanceChange = this.handleCarDistanceChange.bind(this);
    this.handleTrainDistanceChange = this.handleTrainDistanceChange.bind(this);
    this.handleFuelChange = this.handleFuelChange.bind(this);

    this.buttonHomeAction = this.buttonHomeAction.bind(this);
  }

  handleListChange(event) {
    this.setState({ choice: event.target.value });
  }

  handleDistanceChange(event) {
    //Calculates Value of CO2 emitted for flight component
    if (this.state.origin.name === this.state.destination.name) {
      this.setState({ distance: 0 });
      this.setState({
        connection: { name: null, gps: [0, 0], drivability: 0, flights: null }
      });
    } else if (
      this.state.origin.flights.includes(this.state.destination.name)
    ) {
      const R = 6371.0;
      const pi = Math.PI;
      const lon1 = (pi / 180.0) * this.state.origin.gps[1];
      const lon2 = (pi / 180.0) * this.state.destination.gps[1];
      const lat1 = (pi / 180.0) * this.state.origin.gps[0];
      const lat2 = (pi / 180.0) * this.state.destination.gps[0];
      const dLat = lat2 - lat1;
      const dLon = lon2 - lon1;
      console.log(dLat);

      const a =
        Math.sin(dLat / 2.0) * Math.sin(dLat / 2.0) +
        Math.cos(lat1) *
          Math.cos(lat2) *
          Math.sin(dLon / 2.0) *
          Math.sin(dLon / 2.0);

      const c = 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1.0 - a));
      const d = R * c;
      console.log(d);
      var d1 = (this.state.trip * d * this.state.carbonValues.Flight).toFixed(
        2
      );

      /*const a = this.state.origingps[0] * Math.PI/180, b = this.state.destinationgps[0] * Math.PI/180, dlon = (this.state.destinationgps[1]-this.state.origingps[1]) * Math.PI/180, R = 6371;
  const d = Math.acos( Math.sin(a)*Math.sin(b) + Math.cos(a)*Math.cos(b) * Math.cos(dlon) ) * R;*/

      this.setState({ distance: d1 });

      console.log(this.state.trip);
      this.setState({
        connection: { name: null, gps: [0, 0], drivability: 0, flights: null }
      });
      //this.setState({con: "N"})
    } else {
      //In case of no direct flight calculates where the most efficient connecting flight would be in terms of total distance travlled
      //this.setState({distance: null})
      var a = null;
      for (let i = 0; i < this.state.locations.length; i++) {
        if (
          this.state.locations[i].flights.includes(this.state.origin.name) &&
          this.state.locations[i].flights.includes(this.state.destination.name)
        ) {
          const R = 6371.0;
          const pi = Math.PI;
          const lon1 = (pi / 180.0) * this.state.origin.gps[1];
          const lon2 = (pi / 180.0) * this.state.destination.gps[1];
          const lon3 = (pi / 180.0) * this.state.locations[i].gps[1];

          const lat1 = (pi / 180.0) * this.state.origin.gps[0];
          const lat2 = (pi / 180.0) * this.state.destination.gps[0];
          const lat3 = (pi / 180.0) * this.state.locations[i].gps[0];
          const dLat1 = lat2 - lat3;
          const dLon1 = lon2 - lon3;
          const dLat2 = lat1 - lat3;
          const dLon2 = lon1 - lon3;
          //console.log(lon3)
          const a1 =
            Math.sin(dLat1 / 2.0) * Math.sin(dLat1 / 2.0) +
            Math.cos(lat3) *
              Math.cos(lat2) *
              Math.sin(dLon1 / 2.0) *
              Math.sin(dLon1 / 2.0);

          const c1 = 2.0 * Math.atan2(Math.sqrt(a1), Math.sqrt(1.0 - a1));
          const d1 = R * c1;

          const a2 =
            Math.sin(dLat2 / 2.0) * Math.sin(dLat2 / 2.0) +
            Math.cos(lat3) *
              Math.cos(lat1) *
              Math.sin(dLon2 / 2.0) *
              Math.sin(dLon2 / 2.0);

          const c2 = 2.0 * Math.atan2(Math.sqrt(a2), Math.sqrt(1.0 - a2));
          const d2 = R * c2;

          //a=a.concat(d1+d2)
          //console.log(a[i-1])
          //this.setState({conarray: this.state.conarray.concat({name: this.state.locations[i].name, distance: d1+d2})})
          if (a === null || d1 + d2 < a) {
            a = d1 + d2;
            var b = i;
          }
          console.log(a);
          var c = (
            this.state.trip *
            a *
            this.state.carbonValues.Flight
          ).toFixed(2);

          //if(a[i]<a){
          this.setState({ distance: c });
          this.setState({ connection: this.state.locations[b] });
          //}

          /*if(d1+d2 < this.state.distance){
            
            this.setState({connection: this.state.locations[i]});
            this.setState({distance: (this.state.trip)*(d1+d2)});
            //this.setState({con: "Y"})
          }
          else if(this.state.connection.name === null){
            
            this.setState({connection: this.state.locations[i]});
            this.setState({distance: (this.state.trip)*(d1+d2)});
          }*/
        }
      }
    }
  }

  handleDestinationChange(event) {
    //changes destination value
    console.log("this has been clicked", event.target.value);
    this.setState({ destination: this.state.locations[event.target.value] });

    console.log(this.state.destination.gps);
  }

  handleOriginChange(event) {
    //changes origin value
    console.log("this has been clicked", event.target.value);
    this.setState({ origin: this.state.locations[event.target.value] });

    console.log(this.state.origin.gps);
  }

  handleOneTrip() {
    //Change the trip to non-return
    this.setState({ trip: 1 });
    if (this.state.trip === 2) {
      this.setState({ distance: this.state.distance / 2 });
    }
  }
  handleRoundTrip() {
    //Change the trip to return
    this.setState({ trip: 2 });
    if (this.state.trip === 1) {
      this.setState({ distance: this.state.distance * 2 });
    }
  }

  handleCarDistanceChange(event) {
    //CO2 emitted for car trip
    if (this.state.carbonValues.Car !== null) {
      //ie if fuel value has been selected
      if (
        this.state.origin.drivability === this.state.destination.drivability //if it's possible to drive from origin to destination
      ) {
        const R = 6371.0;
        const pi = Math.PI;
        const lon1 = (pi / 180.0) * this.state.origin.gps[1];
        const lon2 = (pi / 180.0) * this.state.destination.gps[1];
        const lat1 = (pi / 180.0) * this.state.origin.gps[0];
        const lat2 = (pi / 180.0) * this.state.destination.gps[0];
        const dLat = lat2 - lat1;
        const dLon = lon2 - lon1;

        const a =
          Math.sin(dLat / 2.0) * Math.sin(dLat / 2.0) +
          Math.cos(lat1) *
            Math.cos(lat2) *
            Math.sin(dLon / 2.0) *
            Math.sin(dLon / 2.0);

        const c = 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1.0 - a));
        const d = R * c;
        var d1 =
          1.2 * (this.state.trip * d * this.state.carbonValues.Car).toFixed(2); //1.2 factor added to account for difference in distance by car vs. by flight

        /*const a = this.state.origingps[0] * Math.PI/180, b = this.state.destinationgps[0] * Math.PI/180, dlon = (this.state.destinationgps[1]-this.state.origingps[1]) * Math.PI/180, R = 6371;
const d = Math.acos( Math.sin(a)*Math.sin(b) + Math.cos(a)*Math.cos(b) * Math.cos(dlon) ) * R;*/

        this.setState({ distance: d1 });
      } else {
        this.setState({ distance: "Cannot drive between locations" });
      }
    } else {
      this.setState({ distance: "Please choose a fuel type" });
    }
  }

  handleTrainDistanceChange(event) {
    //calculates CO2 emitted by train journey
    if (
      this.state.origin.trainability === this.state.destination.trainability
    ) {
      const R = 6371.0;
      const pi = Math.PI;
      const lon1 = (pi / 180.0) * this.state.origin.gps[1];
      const lon2 = (pi / 180.0) * this.state.destination.gps[1];
      const lat1 = (pi / 180.0) * this.state.origin.gps[0];
      const lat2 = (pi / 180.0) * this.state.destination.gps[0];
      const dLat = lat2 - lat1;
      const dLon = lon2 - lon1;

      const a =
        Math.sin(dLat / 2.0) * Math.sin(dLat / 2.0) +
        Math.cos(lat1) *
          Math.cos(lat2) *
          Math.sin(dLon / 2.0) *
          Math.sin(dLon / 2.0);

      const c = 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1.0 - a));
      const d = R * c;
      var d1 = (
        1.2 *
        (this.state.trip * d * this.state.carbonValues.Train)
      ).toFixed(2); //1.2 value added to account for difference in distance between flight and train journey

      /*const a = this.state.origingps[0] * Math.PI/180, b = this.state.destinationgps[0] * Math.PI/180, dlon = (this.state.destinationgps[1]-this.state.origingps[1]) * Math.PI/180, R = 6371;
  const d = Math.acos( Math.sin(a)*Math.sin(b) + Math.cos(a)*Math.cos(b) * Math.cos(dlon) ) * R;*/

      this.setState({ distance: d1 });
    } else {
      this.setState({ distance: "No train connection found" });
    }
  }

  handleFuelChange(event) {
    this.setState({
      carbonValues: {
        Flight: 0.255,
        Car: this.state.fuelValues[event.target.value],
        Train: 0.006
      } //Changes the fuel choice for car
    });
    console.log(this.state.carbonValues);
  }

  buttonFlightAction() {
    this.setState({ choice: "Flight" });
    this.setState({ distance: null });
    this.setState({
      connection: { name: null, gps: [0, 0], drivability: 0, flights: null }
    });
    this.setState({ trip: 1 });
    this.setState({ carbonValues: { Flight: 0.255, Car: null, Train: 0.006 } }); //Flight component clicked
  }
  buttonCarAction() {
    this.setState({ choice: "Car" });
    this.setState({ distance: null });
    this.setState({
      connection: { name: null, gps: [0, 0], drivability: 0, flights: null } //Car Component clicked
    });
    this.setState({ trip: 1 });
    this.setState({ carbonValues: { Flight: 0.255, Car: null, Train: 0.006 } });
  }
  buttonTrainAction() {
    this.setState({ choice: "Train" });
    this.setState({ distance: null });
    this.setState({
      connection: { name: null, gps: [0, 0], drivability: 0, flights: null }
    });
    this.setState({ trip: 1 });
    this.setState({ carbonValues: { Flight: 0.255, Car: null, Train: 0.006 } }); //Train clicked
  }

  buttonHomeAction() {
    this.setState({ choice: "Home" });
    this.setState({ distance: null });
    this.setState({
      connection: { name: null, gps: [0, 0], drivability: 0, flights: null } //Hpme clicked
    });
  }
  render() {
    return (
      <div className="App">
        {/* // ---header--------------------------//} */}
        <>
          <Navbar bg="dark" variant="dark">
            <Container>
              <Navbar.Brand href="#home">
                <img
                  alt=""
                  src={logo}
                  width="30"
                  height="30"
                  className="d-inline-block align-top"
                />{" "}
                Carbon Dioxide Trip Calculator
              </Navbar.Brand>
            </Container>
          </Navbar>
        </>

        <>
          <Navbar bg="light" variant="light">
            <Container>
              <Navbar.Brand href="#home">
                Make a difference, make the smarter choice
              </Navbar.Brand>
            </Container>
          </Navbar>
        </>

        {/*-------end of header code----------- */}

        <p>Current Page: {this.state.choice}</p>
        <button onClick={this.buttonHomeAction}>Home</button>
        {/* flight button */}
        <button onClick={this.buttonFlightAction}>
          Flight &nbsp;
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-airplane"
            viewBox="0 0 16 16"
          >
            <path d="M6.428 1.151C6.708.591 7.213 0 8 0s1.292.592 1.572 1.151C9.861 1.73 10 2.431 10 3v3.691l5.17 2.585a1.5 1.5 0 0 1 .83 1.342V12a.5.5 0 0 1-.582.493l-5.507-.918-.375 2.253 1.318 1.318A.5.5 0 0 1 10.5 16h-5a.5.5 0 0 1-.354-.854l1.319-1.318-.376-2.253-5.507.918A.5.5 0 0 1 0 12v-1.382a1.5 1.5 0 0 1 .83-1.342L6 6.691V3c0-.568.14-1.271.428-1.849Zm.894.448C7.111 2.02 7 2.569 7 3v4a.5.5 0 0 1-.276.447l-5.448 2.724a.5.5 0 0 0-.276.447v.792l5.418-.903a.5.5 0 0 1 .575.41l.5 3a.5.5 0 0 1-.14.437L6.708 15h2.586l-.647-.646a.5.5 0 0 1-.14-.436l.5-3a.5.5 0 0 1 .576-.411L15 11.41v-.792a.5.5 0 0 0-.276-.447L9.276 7.447A.5.5 0 0 1 9 7V3c0-.432-.11-.979-.322-1.401C8.458 1.159 8.213 1 8 1c-.213 0-.458.158-.678.599Z" />
          </svg>
        </button>
        {/* car button */}
        <button onClick={this.buttonCarAction}>
          {" "}
          Car &nbsp;
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-car-front"
            viewBox="0 0 16 16"
          >
            <path d="M4 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm10 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2H6ZM4.862 4.276 3.906 6.19a.51.51 0 0 0 .497.731c.91-.073 2.35-.17 3.597-.17 1.247 0 2.688.097 3.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 10.691 4H5.309a.5.5 0 0 0-.447.276Z" />
            <path d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679c.033.161.049.325.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.807.807 0 0 0 .381-.404l.792-1.848ZM4.82 3a1.5 1.5 0 0 0-1.379.91l-.792 1.847a1.8 1.8 0 0 1-.853.904.807.807 0 0 0-.43.564L1.03 8.904a1.5 1.5 0 0 0-.03.294v.413c0 .796.62 1.448 1.408 1.484 1.555.07 3.786.155 5.592.155 1.806 0 4.037-.084 5.592-.155A1.479 1.479 0 0 0 15 9.611v-.413c0-.099-.01-.197-.03-.294l-.335-1.68a.807.807 0 0 0-.43-.563 1.807 1.807 0 0 1-.853-.904l-.792-1.848A1.5 1.5 0 0 0 11.18 3H4.82Z" />
          </svg>
        </button>
        {/* Train button */}
        <button onClick={this.buttonTrainAction}>
          Train &nbsp;
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-train-front"
            viewBox="0 0 16 16"
          >
            <path d="M5.621 1.485c1.815-.454 2.943-.454 4.758 0 .784.196 1.743.673 2.527 1.119.688.39 1.094 1.148 1.094 1.979V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V4.583c0-.831.406-1.588 1.094-1.98.784-.445 1.744-.922 2.527-1.118Zm5-.97C8.647.02 7.353.02 5.38.515c-.924.23-1.982.766-2.78 1.22C1.566 2.322 1 3.432 1 4.582V13.5A2.5 2.5 0 0 0 3.5 16h9a2.5 2.5 0 0 0 2.5-2.5V4.583c0-1.15-.565-2.26-1.6-2.849-.797-.453-1.855-.988-2.779-1.22ZM5 13a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm0 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm7 1a1 1 0 1 0-1-1 1 1 0 1 0-2 0 1 1 0 0 0 2 0 1 1 0 0 0 1 1ZM4.5 5a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h3V5h-3Zm4 0v3h3a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5h-3ZM3 5.5A1.5 1.5 0 0 1 4.5 4h7A1.5 1.5 0 0 1 13 5.5v2A1.5 1.5 0 0 1 11.5 9h-7A1.5 1.5 0 0 1 3 7.5v-2ZM6.5 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3Z" />
          </svg>
        </button>

        {this.state.choice === "Flight" && (
          <FlightComponent
            //varA={this.state.variableForPlane}
            localHandle={this.handleDestinationChange}
            localHandle2={this.handleOriginChange}
            localHandle3={this.handleDistanceChange}
            localHandle4={this.handleOneTrip}
            localHandle5={this.handleRoundTrip}
            distance={this.state.distance}
            connection={this.state.connection}
            locations={this.state.locations}
          />
        )}
        {this.state.choice === "Car" && (
          <CarComponent
            //varCar={this.state.variableForCar}
            localHandle={this.handleDestinationChange}
            localHandle2={this.handleOriginChange}
            localHandle3={this.handleCarDistanceChange}
            localHandle4={this.handleOneTrip}
            localHandle5={this.handleRoundTrip}
            localHandle6={this.handleFuelChange}
            distance={this.state.distance}
            locations={this.state.locations}
          />
        )}
        {this.state.choice === "Train" && (
          <ComponentC //varCar={this.state.variableForCar}
            localHandle={this.handleDestinationChange}
            localHandle2={this.handleOriginChange}
            localHandle3={this.handleTrainDistanceChange}
            localHandle4={this.handleOneTrip}
            localHandle5={this.handleRoundTrip}
            distance={this.state.distance}
            locations={this.state.locations}
          />
        )}

        {this.state.choice === "Home" && (
          <>
            <hr />
            <SecondChild />

            <hr />
            {/* carousel */}

            <h3> Select one of the pages to calculate your co2 footprint </h3>
          </>
        )}
      </div>
    ); // end of return statement
  } // end of render function
}
// ----------------------------------------------------

// -------------------------------------------------
//**************************************************//
class FlightComponent extends Component {
  render() {
    // const varAFromProps = this.props.varFlight;
    return (
      <div className="FlightComponent">
        <hr />
        <div class="bg-success p-2 text-dark bg-opacity-50">
          {/* --------------check buttons----------------*/}
          <br />
          <CFormCheck
            inline
            type="radio"
            name="inlineRadioOptions"
            id="inlineCheckbox1"
            value="option1"
            label="One Trip"
            onChange={this.props.localHandle4} //button for single trip
          />

          <CFormCheck
            inline
            type="radio"
            name="inlineRadioOptions"
            id="inlineCheckbox2"
            value="option2"
            label="Round Trip"
            onChange={this.props.localHandle5} //button for round trip
          />
          <br />

          {/* -------------------------------------------------------- */}
          <br />
          <div class="container text-center">
            <div class="row justify-content-between">
              <div class="col-6"></div>
              <div class="col">
                <div className="d-grid gap-5">
                  <CFormSelect
                    onChange={this.props.localHandle2}
                    id="inlineFormSelectPref"
                  >
                    <option>Origin..</option>
                    {this.props.locations &&
                      this.props.locations.map((
                        k,
                        key //dropdown list for origin choice
                      ) => (
                        <option key={key} value={key}>
                          {k.name}
                        </option>
                      ))}
                  </CFormSelect>
                </div>
              </div>
            </div>
          </div>

          {/* --------------image/distance/dropdown----------------*/}

          <br />
          <div class="container text-center">
            <div class="row justify-content-end">
              <div class="col-6">
                <Sample3 />
              </div>

              <div class="col">
                <CFormSelect
                  onChange={this.props.localHandle}
                  id="inlineFormSelectPref"
                >
                  <option>Destination..</option>
                  {this.props.locations.map((
                    k,
                    key //dropdown list for destination choice
                  ) => (
                    <option key={key} value={key}>
                      {k.name}
                    </option>
                  ))}
                </CFormSelect>
              </div>
            </div>
          </div>

          {/*-----------------result bar--------button calculate */}
          <div class="container text-center">
            <div class="row justify-content-between">
              <div class="col-6">
                <Badge bg="danger">
                  <h6>Result: &nbsp;</h6>

                  {this.props.distance !== null && (
                    <h6> {this.props.distance} kg CO2</h6> //display amount of CO2 emitted
                  )}
                  {this.props.connection.name !== null && (
                    <h6>
                      Connecting Flight Through: {this.props.connection.name}
                    </h6> //if there is a connecting flight occurring
                  )}
                </Badge>{" "}
              </div>

              <div class="col-5">
                <div className="d-grid gap-5">
                  <Button
                    onClick={this.props.localHandle3}
                    variant="secondary"
                    size="xl"
                  >
                    Calculate
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr />
      </div> //end of div component
    );
  }
} // close the ComponentA component
//**************************************************
class CarComponent extends Component {
  render() {
    //const varBFromProps = this.props.varCar;
    return (
      <div className="ComponentB">
        <hr />
        <div class="bg-success p-2 text-dark bg-opacity-50">
          {/* --------------check buttons----------------*/}
          <br />
          <CFormCheck
            inline
            type="radio"
            name="inlineRadioOptions"
            id="inlineCheckbox1"
            value="option1"
            label="One Trip"
            onChange={this.props.localHandle4} //Single trip button
          />

          <CFormCheck
            inline
            type="radio"
            name="inlineRadioOptions"
            id="inlineCheckbox2"
            value="option2"
            label="Round Trip"
            onChange={this.props.localHandle5} //Return trip button
          />
          <br />
          {/* --------------image/distance/dropdown----------------*/}

          <br />
          <div class="container text-center">
            <div class="row justify-content-end">
              <div class="col-4">
                <h4>
                  <b>Fuel Type:</b>
                </h4>
              </div>

              <div class="col-4">
                <CFormSelect
                  onChange={this.props.localHandle6} //Dropdown list for fuel choice of car
                  id="inlineFormSelectPref"
                >
                  <option>Fuel Type...</option>
                  <option value="0">Gas</option>
                  <option value="1">Diesel</option>
                  <option value="2">Electric</option>
                </CFormSelect>
              </div>
            </div>
          </div>
          {/* ------------------Distance bar----------------------------- */}
          <br />
          <div class="container text-center">
            <div class="row justify-content-between">
              <div class="col-6"></div>
              <div class="col">
                <div className="d-grid gap-5">
                  <CFormSelect
                    onChange={this.props.localHandle2}
                    id="inlineFormSelectPref"
                  >
                    <option>Origin..</option>
                    {this.props.locations &&
                      this.props.locations.map((
                        k,
                        key //Origin Dropdown list
                      ) => (
                        <option key={key} value={key}>
                          {k.name}
                        </option>
                      ))}
                  </CFormSelect>
                </div>
              </div>
            </div>
          </div>
          <br />

          <div class="container text-center">
            <div class="row justify-content-between">
              <div class="col-6"></div>
              <div class="col">
                <div className="d-grid gap-5">
                  <CFormSelect
                    onChange={this.props.localHandle}
                    id="inlineFormSelectPref"
                  >
                    <option>Destination..</option>
                    {this.props.locations &&
                      this.props.locations.map((
                        k,
                        key //Destination Dropdown list
                      ) => (
                        <option key={key} value={key}>
                          {k.name}
                        </option>
                      ))}
                  </CFormSelect>
                </div>
              </div>
            </div>
          </div>

          {/*-----------------LOGO ------*/}
          <br />
          <div class="container text-center">
            <div class="row justify-content-end">
              <div class="col">
                <Sample3 />
              </div>
            </div>
          </div>

          {/*-----------------result bar--------button calculate */}
          <div class="container text-center">
            <div class="row justify-content-between">
              <div class="col-6">
                <Badge bg="danger">
                  <h6>Result: &nbsp; </h6>
                  {this.props.distance !== null &&
                    this.props.distance !== "Cannot drive between locations" &&
                    this.props.distance !== "Please choose a fuel type" && (
                      <h6> {this.props.distance} kg CO2</h6> //if CO2 value is a number display this
                    )}
                  {(this.props.distance === "Cannot drive between locations" ||
                    this.props.distance === "Please choose a fuel type") && (
                    <h6>{this.props.distance}</h6> //if it is one of the two strings display this
                  )}
                </Badge>{" "}
              </div>
              <div class="col">
                <div className="d-grid gap-5">
                  <Button
                    onClick={this.props.localHandle3} //Calculate CO2 emission
                    variant="secondary"
                    size="xl"
                  >
                    Calculate
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr />
      </div>
    );
  }
} // close the ComponentB component

//**************************************************//
class ComponentC extends Component {
  render() {
    return (
      <div className="ComponentC">
        <hr />
        <div class="bg-success p-2 text-dark bg-opacity-50">
          {/* --------------check buttons----------------*/}
          <br />
          <CFormCheck
            inline
            type="radio"
            name="inlineRadioOptions"
            id="inlineCheckbox1"
            value="option1"
            label="One Trip"
            onChange={this.props.localHandle4} //Single Trip Button
          />

          <CFormCheck
            inline
            type="radio"
            name="inlineRadioOptions"
            id="inlineCheckbox2"
            value="option2"
            label="Round Trip"
            onChange={this.props.localHandle5} //Return Trip Button
          />
          <br />
          <br />

          {/* -------------------------------------------------------- */}
          <br />
          <div class="container text-center">
            <div class="row justify-content-between">
              <div class="col-6"></div>
              <div class="col">
                <div className="d-grid gap-5">
                  <CFormSelect
                    onChange={this.props.localHandle2}
                    id="inlineFormSelectPref"
                  >
                    <option>Origin..</option>
                    {this.props.locations &&
                      this.props.locations.map((
                        k,
                        key //Origin Dropdown list
                      ) => (
                        <option key={key} value={key}>
                          {k.name}
                        </option>
                      ))}
                  </CFormSelect>
                </div>
              </div>
            </div>
          </div>

          {/* --------------image/distance/dropdown----------------*/}

          <br />
          <div class="container text-center">
            <div class="row justify-content-end">
              <div class="col-6">
                <Sample3 />
              </div>

              <div class="col">
                <CFormSelect
                  onChange={this.props.localHandle}
                  id="inlineFormSelectPref"
                >
                  <option>Destination..</option>
                  {this.props.locations.map((
                    k,
                    key //Destination Dropdown List
                  ) => (
                    <option key={key} value={key}>
                      {k.name}
                    </option>
                  ))}
                </CFormSelect>
              </div>
            </div>
          </div>
          {/*-----------------result bar--------button calculate */}
          <div class="container text-center">
            <div class="row justify-content-between">
              <div class="col-6">
                <Badge bg="danger">
                  <h6>Result: &nbsp; </h6>
                  {this.props.distance !== null &&
                    this.props.distance !== "No train connection found" && (
                      <h6> {this.props.distance} kg CO2</h6>
                    )}
                  {this.props.distance === "No train connection found" && (
                    <h6>{this.props.distance}</h6>
                  )}
                </Badge>{" "}
              </div>
              <div class="col">
                <div className="d-grid gap-5">
                  <Button
                    onClick={this.props.localHandle3}
                    variant="secondary"
                    size="xl"
                  >
                    Calculate
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr />
      </div>
    );
  }
} // close the ComponentC component
//**************************************************//

export default App;
