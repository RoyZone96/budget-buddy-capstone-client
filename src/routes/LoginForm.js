import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import AuthApiService from '../utilities/AuthApiService'
import TokenService from '../utilities/TokenService'



export default class LoginForm extends Component {
  static defaultProps = {
    onLoginSuccess: () => { }
  }

  constructor(props) {
    super(props);
    this.state = {
      username: {
        value: ''
      },
      password: {
        value: ''
      },
      LogInUserID: 0,
      error: null,

    };
  }

  handleLoginSuccess = () => {
    window.location = '/myBudget'
  }

  changeUsername(username) {
    this.setState({ userName: { value: username } });
  }

  changePassword(password) {
    this.setState({ password: { value: password } });
  }

  componentDidMount() {
    console.log('Stateful component LogIn successfully mounted.');
  }

  handleSubmitJwtAuth = (event) => {
    event.preventDefault();
    const { username, password } = event.target
    console.log('username:', username.value, "password:", password.value);
    AuthApiService.postLogin({
      username: username.value,
      password: password.value,
    })

      .then(response => {
        console.log("response ID", response)
        username.value = ''
        password.value = ''
        TokenService.saveAuthToken(response.authToken)
        TokenService.saveUserId(response.user_id)
        this.props.history.push('/myBudget')
      })
      .then(response => {
        console.log("response:", response)

      })
      .catch(err => {
        console.log(err);
      });
  }


  render() {
    const { error } = this.state
    return (
      <div className="wrapper">
        <form onSubmit={this.handleSubmitJwtAuth}>
          <div className="spacer">
            <label htmlFor="username"> Username </label>
            <input type="text" className="username" name="username" required />
          </div>
          <div className="spacer">
            <label htmlFor="password"> Password </label>
            <input type="text" className="password" name="password" required />
          </div>
          <div className="button-spacer">
            <button type="submit"> Login </button>
          </div>
          <div className="button-spacer">
            <Link to="/registration">
              <button type="button"> Register </button>
            </Link>
          </div>
          <div role='console.log'>
            {error && <p className='red'>{error}</p>}
          </div>
        </form>
      </div>
    )
  }



}