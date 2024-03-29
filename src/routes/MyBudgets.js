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
        const user_id = TokenService.getUserId()
        console.log(user_id)

        let budgetUrl = `${config.API_ENDPOINT}/budgets`

        console.log(budgetUrl)

        fetch(budgetUrl)
            .then((budgetsRes) => {
                if (!budgetsRes.ok)
                    return budgetsRes.json().then(e => Promise.reject(e));
                return budgetsRes.json();
            })
            .then((budgets) => {

                console.log(budgets)
                console.log(user_id)

                let filteredBudgets = [];
                for (let i = 0; i < budgets.length; i++) {
                    if (budgets[i].user_id == user_id) {
                        filteredBudgets.push(budgets[i]);
                    }
                }
                this.setState({ budgets: filteredBudgets });
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
        let money_available = this.state.budgets.money_available
        let budgetsOutput = budgets.map(budget => {
            console.log(budget)
            if (money_available <= 0) {
                <ul className="under" key={budget.id}>
                    <li className="menu-select">
                        <div className="menu-wrapper">
                            <div>
                                <p className="title">{budget.budget_title}</p>
                                <p className="money_available">{budget.money_available}</p>
                                <BudgetNav id={budget.id} />
                            </div>
                        </div>
                    </li>
                </ul>
            }
            return (
                <ul key={budget.id}>
                    <li className="menu-select">
                        <div className="menu-wrapper">
                            <div>
                                <p className="title">{budget.budget_title}</p>
                                <p className="money_available">${budget.money_available}</p>
                                <BudgetNav id={budget.id} />
                            </div>
                        </div>
                    </li>
                </ul>
            )
        })
        return (
            <div> 
                <div className="top_menu">
                    <LogoutButton />
                    <Link to='/support'>
                        <button type="button">
                            Support
                        </button>
                    </Link>
                </div>
                <section className="new-wrapper">
                    <Link to="/newbudget">
                        <button className="new-board" type="button">NEW BUDGET +</button>
                    </Link>
                </section>
                <section key={budgets.id} className="budget-list">
                    {budgetsOutput}
                </section>
            </div>
        )
    }
}