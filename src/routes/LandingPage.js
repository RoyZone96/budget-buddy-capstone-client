import React from 'react'
import { Link } from 'react-router-dom'


export default function LandingPage() {
    return (
        <div className="wrapper">
            <h1 className="app-title">Budget Buddy</h1>
            <div>
                <h2>A better way to plan your daily shopping, traveling or hobbyist needs</h2>
            </div>
            <div className="menu">
                <div className="spacer">
                <Link to="/login">Login</Link>{' '}
                </div>
                <div className="spacer">
                <Link to="/registration">Register</Link>
                </div>
            </div>
        </div>
    )
}