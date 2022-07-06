import React, { Component } from "react";
import axios from "axios";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Navbar} from 'react-bootstrap';
import { Button} from 'react-bootstrap';
import Dashboard from "./Dashboard";
import Login from "./auth/Login";

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      loggedInStatus: "NOT_LOGGED_IN",
      user: {}
    };

    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleSuccessfulAuth = this.handleSuccessfulAuth.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
  }

  handleSuccessfulAuth(data) {
    this.handleLogin(data);   
    this.props.history.push("/dashboard");
  }

  handleLogoutClick() {
    axios
      .delete("http://localhost:3000/logout", { withCredentials: true })
      .then(response => {
        this.props.handleLogout();
      })
      .catch(error => {
        console.log("logout error", error);
      });
  }

  checkLoginStatus() {
    axios
      .get("http://localhost:3000/logged_in", { withCredentials: true })
      .then(response => {
        if (
          response.data.logged_in &&
          this.state.loggedInStatus === "NOT_LOGGED_IN"
        ) {
          this.setState({
            loggedInStatus: "LOGGED_IN",
            user: response.data.user
          });
        } else if (
          !response.data.logged_in &
          (this.state.loggedInStatus === "LOGGED_IN")
        ) {
          this.setState({
            loggedInStatus: "NOT_LOGGED_IN",
            user: {}
          });
        }
      })
      .catch(error => {
        console.log("check login error", error);
      });
  }

  componentDidMount() {
    this.checkLoginStatus();
  }

  handleLogout() {
    this.setState({
      loggedInStatus: "NOT_LOGGED_IN",
      user: {}
    });
  }

  handleLogin(data) {
    this.setState({
      loggedInStatus: "LOGGED_IN",
      user: data.user
    });
  }

  render() {
    return (
      <div className="container-fluid app-container">
           <Router>
      <div className="container-fluid main-conatiner">
      <Navbar>
          <Navbar.Brand  className="brand1" >  
          <Link to="/"><Button className="border-btn" >Jobsenlist</Button></Link>
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
           <Navbar.Text className="brand2">
           <Link to="/login"><Button className="border-btn mr-3" >Signin </Button></Link>
          </Navbar.Text>
          </Navbar.Collapse>
      </Navbar>
          <Switch>
          
          <Route path="/login"><Login /></Route> 
          </Switch>
                <p>Status: {this.props.loggedInStatus}</p>
        <button onClick={() => this.handleLogoutClick()}>Logout</button>
        </div>
        </Router>
      </div>
    );
  }
}