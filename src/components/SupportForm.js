import React, { Component } from 'react'
import config from '../config'
import ApiContext from '../ApiContext'



export default class SupportForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: "",
            subject: "",
            content: ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    static contextType = ApiContext

    handleChange(event) {
        event.preventDefault()
        this.setState({ value: event.target.value })
    }

    handleSubmit(event) {
        event.preventDefault();

        const newSupport = {
            email: this.state.email,
            subject: this.state.subject,
            content: this.state.content
        }

        console.log(newSupport)

        fetch(`${config.API_ENDPOINT}/supports`,
            {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(newSupport),
            })
            .then(res => {
                if (!res.ok)
                    return res.json().then(e => Promise.reject(e))
                return res.json()
            })
            .then(response =>
                this.context.requestSupport(response)
            )
            .then(
                console.log(newSupport),
                window.location = "/"
            )
            .catch(error => {
                console.log(error.message)
            })
        console.log('Thank you for your submission. The admin will look over this as soon as possible')

    }

    validateSubmission(){
        const email = this.state.email.trim()
        const subject = this.state.subject.trim()
        const content = this.state.content.trim()
        if (email.length === 0) {
            return <p className='input-error'>.</p>;
          } 
        else if (subject.length === 0) {
            return <p className='input-error'>.</p>;
        }
        else if (content.length === 0) {
            return <p className='input-error'>.</p>;
        }
    }

    render() {
        return (
            <div>
                <form className="support" onSubmit={this.handleSubmit}>
                    <div className="spacer">
                        <input type="text" value={this.state.email.value} onChange={this.handleChange} className="email" name="email" placeholder="E-mail" required />
                    </div>
                    <div className="spacer">
                        <input type="text" value={this.state.subject.value} onChange={this.handleChange} className="subject" name="subject" placeholder="Subject" required />
                    </div>
                    <div className="spacer">
                        <textarea name="content" value={this.state.content.value} onChange={this.handleChange} className="content" placeholder="Your content here" required />
                    </div>
                    <div className="spacer">
                        <button type="submit">
                            Submit
                         </button>
                    </div>
                </form>
            </div>
        )
    }
}