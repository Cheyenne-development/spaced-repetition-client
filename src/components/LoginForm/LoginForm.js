import React, { Component } from "react";
import { Input, Label } from "../Form/Form";
import AuthApiService from "../../services/auth-api-service";
import UserContext from "../../contexts/UserContext";
import Button from "../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";

import "./LoginForm.css";

class LoginForm extends Component {
  static defaultProps = {
    onLoginSuccess: () => {},
  };

  static contextType = UserContext;

  state = { error: null };

  firstInput = React.createRef();

  handleSubmit = (ev) => {
    ev.preventDefault();
    const { username, password } = ev.target;

    this.setState({ error: null });

    AuthApiService.postLogin({
      username: username.value,
      password: password.value,
    })
      .then((res) => {
        username.value = "";
        password.value = "";
        this.context.processLogin(res.authToken);
        this.props.onLoginSuccess();
      })
      .catch((res) => {
        this.setState({ error: res.error });
      });
  };

  componentDidMount() {
    this.firstInput.current.focus();
  }

  render() {
    const { error } = this.state;
    return (
      <form className="LoginForm" autoComplete="off" onSubmit={this.handleSubmit}>
        <div role="alert">{error && <p>{error}</p>}</div>
        <div className="login-input">
          <Label htmlFor="login-username-input"></Label>

         <p> <Input
            autoComplete="off"
            type="text"
            ref={this.firstInput}
            id="login-username-input"
            aria-required="true"
            aria-label="Enter your Username"
            name="username"
            placeholder="Username"
        
            required
          />
          <FontAwesomeIcon icon={faUser} size="lg" className="login-icon" /></p>
        </div>
        <div className="login-input">
          <Label htmlFor="login-password-input"></Label>

          <p><Input
            autoComplete="new-password"
            placeholder="Password"
            aria-required="true"
            aria-label="Enter your Password"
            id="login-password-input"
            name="password"
            type="password"
          
            required
          />
          <FontAwesomeIcon icon={faLock} size="lg" className="login-icon" /></p>
        </div>
        <footer>
          <Button type="submit">Login</Button>
        </footer>
      </form>
    );
  }
}

export default LoginForm;
