import React, { Component } from 'react'
import AuthApiService from '../services/AuthApiService'
import TokenService from '../services/TokenService'


export default class RegistrationForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: {
                value: '',
                touched: false
            },
            password: {
                value: '',
                touched: false
            },
            repeatPassword: {
                value: '',
                touched: false
            },
            LogInUserID: 0,
            isActive: true
        };
    }

    componentDidMount() {
        console.log('Stateful component Sign Up successfully mounted.');
    }

    handleShow = () => {
        this.setState({
            isActive: false
        })
    }

    changeusername(username) {
        this.setState({
            username: { value: username, touched: true }
        });
    }

    changePassword(password) {
        this.setState({
            password: { value: password, touched: true }
        });
    }

    updateRepeatPassword(repeatPassword) {
        this.setState({ repeatPassword: { value: repeatPassword, touched: true } });
    }

    handleLoginSuccess = user => {
        window.location = '/user/dash'
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const { username, password, confirmPassword, email } = event.target;
        console.log('username:', username.value, 'password:', password.value, 'email', email.value);
        this.setState({ error: null })
        AuthApiService.postUser({
            username: username.value,
            password: password.value,
            email: email.value
        })
            .then(response => {
                console.log('user:', response)
                username.value = ''
                password.value = ''
                confirmPassword.value = ''
                email.value = ''
                TokenService.saveAuthToken(response.authToken)
                TokenService.saveUserId(response.id)
                window.location = '/login'
            })

            .catch(res => {
                this.setState({ error: res.error })
            })
    }

    validateusername() {
        const username = this.state.username.value.trim();
        if (username.length === 0) {
            return <p className='input-error'>username is required</p>;
        } else if (username.length < 2) {
            return <p className='input-error'>username must be at least 2 characters long</p>;
        }
    }

    validatePassword() {
        const password = this.state.password.value.trim();
        if (password.length === 0) {
            return <p className='input-error'>Password is required</p>;
        } else if (password.length < 6 || password.length > 72) {
            return <p className='input-error'>Password must be between 6 and 72 characters long</p>;
        } else if (!password.match(/[0-9]/)) {
            return <p className='input-error'>Password must contain at least one number</p>;
        }
    }

    validateRepeatPassword() {
        const repeatPassword = this.state.repeatPassword.value.trim();
        const password = this.state.password.value.trim();
        // this.setState({submitButtonDisabled: 'disabled'});
        if (repeatPassword != password) {
            return <p className='input-error'>Passwords do not match</p>;
        }
        // else {
        //     this.setState({submitButtonDisabled: ''});
        // }
    }

    render() {
        return (
            <div className="wrapper">
                <form className="registration" onSubmit={this.handleSubmit}>
                    <div className="spacer">
                        <label htmlFor="username"> username </label>
                        <input type="text" className="username" name="username" required />
                    </div>
                    <div className="spacer">
                        <label htmlFor="password"> Password </label>
                        <input type="text" className="password" name="password" minLength="8" required />
                    </div>
                    <div className="spacer">
                        <label htmlFor="confirmPassword"> Confirm Password </label>
                        <input type="text" className="confirmPassword" name="confirmPassword" required />
                    </div>
                    <div className="spacer">
                        <label htmlFor="email"> E-mail </label>
                        <input type="text" className="email" name="email" required />
                    </div>
                    <div className="spacer">
                        <button type="submit"> Submit </button>
                    </div>
                </form>
                <a href="/login">Already have an account? Login in here.</a>
            </div>
        )
    }
}