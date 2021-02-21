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
            .then(([budgets]) => {
                this.setState({ budgets });
                console.log(budgets)
            })
            .catch(error => {
                console.log({ error });
            });
    }
    handleAddBudget = (budgets) => {
        this.setState({
            budgets: [...this.state.budgets, budgets]
        })
    }

    



    render() {
        const budgets = this.state.budgets
        console.log(budgets)
        if(budgets.map == 0){}
        let budgetsOutput = budgets.map(budgets => {
            console.log(budgets)
            return (
                <ul>
                    <li className="menu-select">
                        <div className="menu-wrapper">
                            <div>
                                <p className="title">{budgets.budget_title}</p>
                                <p className="money_available">{budgets.money_available}</p>
                                <BudgetNav id={budgets.id} />
                            </div>
                        </div>
                    </li>
                </ul>
            )
        })
        return (
            <div>
                <LogoutButton />
                <div>
                    <Link to='/support'>
                        support
                    </Link>
                </div>
                <section key={budgets.id} className="budget-list">
                    {budgetsOutput}
                </section>
                <section className="new-wrapper">
                    <Link to="/newbudget">
                        <button className="new-board" type="button">NEW BUDGET +</button>
                    </Link>
                </section>
            </div>
        )
    }
}