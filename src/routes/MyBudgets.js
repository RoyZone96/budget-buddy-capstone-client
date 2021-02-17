import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { Link } from 'react-router-dom'
import BudgetNav from '../components/BudgetNav'
import LogoutButton from "../components/LogoutButton"
import config from "../config"
import ApiContext from '../utilities/ApiContext'
import TokenService from '../utilities/TokenService'



export default class MyBudgets extends Component {


    state = {
        budgets: []
    }

    componentDidMount() {
        Promise.all([
            fetch(`${config.API_ENDPOINT}/budgets`)
        ])
            .then(([boardsRes]) => {
                if (!boardsRes.ok)
                    return boardsRes.json().then(e => Promise.reject(e));
                return Promise.all([boardsRes.json()]);
            })
            .then(([budget]) => {
                this.setState({ budget });
                console.log(budget)
            })
            .catch(error => {
                console.log({ error });
            });
    }
    handleAddBudget = (budget) => {
        this.setState({
            budget: [...this.state.budget, budget]
        })
    }

    



    render() {
        const budget = this.state.budget
        console.log(budget)
        let budgetsOutput = budget.map(budget => {
            console.log(budget)
            return (
                <ul>
                    <li className="menu-select">
                        <div className="menu-wrapper">
                            <div>
                                <p className="title">{budget.budget_title}</p>
                                <BudgetNav id={budget.id} />
                            </div>
                        </div>
                    </li>
                </ul>
            )
        })
        return (
            <div>
                <LogoutButton />
                <section key={budget.id} className="budget-list">
                    {budgetsOutput}
                </section>
                <section className="new-wrapper">
                    <Link to="/newbudget">
                        <button className="new-board" type="button">NEW BOARD +</button>
                    </Link>
                </section>
            </div>
        )
    }
}