import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import config from '../config'
import ApiContext from '../utilities/ApiContext'
import TokenService from '../utilities/TokenService'

export default class AddBudget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            budget_title: {
                value: '',
                touched: false
            },
            money_available: {
                value: 0,
                touched: false
            }
        }

    }

    static contextType = ApiContext

    handleBudgetCreate = (event) => {
        event.preventDefault();

        const newBudget = JSON.stringify({
            user_id: TokenService.getUserId(),
            budget_title: this.state.budget_title.value,
            money_available: this.state.money_available.value
        })
        console.log(this.context)

        fetch(`${config.API_ENDPOINT}/budgets`,
            {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: newBudget,
            })
            .then(res => {
                if (!res.ok)
                    return res.json().then(e => Promise.reject(e))
                return res.json()
            })
            .then(() => {
                this.props.history.push('/mybudgets')
            })
            .catch(error => {
                console.log(error);
                console.log(error.message)
            })
    }

    setBudgetTitle = (budget_title) => {
        this.setState({
            budget_title: {
                value: budget_title,
                touched: true
            }
        })
    }

    setTargetAmount = (money_available) => {
        this.setState({
            money_available: {
                value: money_available,
                touched: true
            }
        })
    }



    render() {
        return (
            <section className="new">
                <div className="close">
                    <Link to="/mybudgets">
                        <button className="delete">
                            X
                    </button>
                    </Link>
                </div>
                <form className="new-budget" onSubmit={this.handleBudgetCreate}>
                    <p className="instructions"> Enter amount you have available </p>
                    <div className="spacer">
                        <input
                            className="input_title"
                            placeholder="title" type="text"
                            onChange={event => this.setBudgetTitle(event.target.value)} required />
                    </div>
                    <div className="spacer">
                        <input className="money"
                            placeholder="$0.00"
                            onChange={event => this.setTargetAmount(event.target.value)} required />
                    </div>
                    <div>
                        <button className="post-button" type="submit">Publish Budget</button>
                    </div>
                </form>
            </section>
        )
    }
}
