import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import config from './config'
import ApiContext from './ApiContext'
import TokenService from './services/TokenService'

export default class AddBoard extends Component {
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
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    static contextType = ApiContext



    handleBudgetCreate = (event) => {
        event.preventDefault();

        const newBudget = JSON.stringify({
            user_id: TokenService.getUserId(),
            budget_title: this.state.budget_title.value,
            money_available: this.state.money_available.value
        })

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
            .then(response => this.context.addBoard(response))
            .then(() => {
                this.props.history.push('/myBudgets')
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
            <section class="pop-up">
                <Link to="/mybudgets">
                    <button className="close"> X </button>
                </Link>
                <form className="new-budget" onSubmit={this.handleBudgetCreate()}>

                    <p className="instructions"> Enter amount you have available </p>
                    <input className="title" placeholder="title" onChange={this.setBudgetTitle} required />
                    <span>$</span><input className="money" placeholder="0" onChange={this.setTargetAmount} required />
                    <div>
                        <button className="post-button" type="submit" disabled={this.validateBoardTitle()}>Publish Budget</button>
                    </div>
                </form>
            </section>
        )
    }
}
