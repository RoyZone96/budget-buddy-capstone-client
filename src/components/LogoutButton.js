import React from 'react'
import { Redirect } from 'react-router-dom'
import TokenService from '../services/TokenService'

export default class LougoutButton extends React.Component {
    state = {
        navigate: false
    }

    logout = (event) => {
        TokenService. clearAuthToken()
        this.setState({ navigate: true })
    }

    render(){
        const { navigate } = this.state;

        if (navigate) {
            return <Redirect to="/" push={true} />
        }

        return <button className="logout" onClick={this.logout}>Log Out</button>
    }


}