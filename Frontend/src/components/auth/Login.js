import React, { Component } from "react";
import axios from "axios";

export default class Login extends Component {
    constructor(props) {
    super(props);
this.state = {
      email: "",
      password: "",
      loginErrors: ""
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);

}  

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit(event) {
    const { email, password } = this.state;

    axios
      .post(
        "http://localhost:3001/sessions",
        {
          user: {
            email: email,
            password: password
          }
        },
        { withCredentials: true }
      )
      .then(response => {
        if (response.data.status === "created") {
          this.props.handleSuccessfullAuth(response.data);
        }
      })
      .catch(error => {
        console.log("login error", error);
      });
    event.preventDefault();
  }

  render() {
    return (
<form onSubmit={this.handleSubmit}>
    <input className="input-signin-data"
    type="email" value={this.state.email}
            onChange={this.handleChange}
            required name="email"
    placeholder ="Email or phone number"
    />
    <br/>
    <input className="input-signin-data"
    type="password" value={this.state.password}
            onChange={this.handleChange}
            required name ="password"
    placeholder ="Password"
    />
    <br/>
    <button type="submit" className="btn btn-secondary border-signin-btn-search" >Signin</button>
      </form>
);
  }
}