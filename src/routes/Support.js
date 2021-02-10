import React from 'react'
import SupportForm from '../components/SupportForm'
import NavLinks from '../components/NavLinks'
import { Link } from 'react-router-dom'


export default function Support() {
    return (
        <div>
            <Link to="/mybudgets">
                <button className="back">
                    <-- Back
                </button>
            </Link>
            <SupportForm />
        </div>
    )
}