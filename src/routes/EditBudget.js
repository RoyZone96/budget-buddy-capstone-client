import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import config from '../config'
import ApiContext from '../utilities/ApiContext'



export default class EditBudget extends Component {

    static contextType = ApiContext;


    constructor(props) {
        super(props);
        this.state = {
            budget_title: "",
            money_available: 0,
            income: 0,
            purchase: {
                purchase_name: "",
                purchase_cost: 0
            },
            purchases: [],
            existingPurchases: {}
        }
        this.addIncome = this.addIncome.bind(this)

    }


    componentDidMount() {
        const budget_id = this.props.match.params.id
        const incomes_id = this.props.match.params.incomes_id
        const purchases_id = this.props.match.params.purchases_id
        console.log(budget_id, incomes_id, purchases_id)

        let budgetUrl = `${config.API_ENDPOINT}/budgets/${budget_id}`


        fetch(budgetUrl)
            .then(res => {
                if (!res.ok)
                    return res.json().then(e => Promise.reject(e))
                return res.json()
            })
            .then((res) => {
                console.log(res)
                this.setState({
                    budget_title: res.budget_title,
                    money_available: res.money_available
                })
                console.log(this.state)
            })
            .catch(error => console.log({ error }))

        
        let purchasesUrl = `${config.API_ENDPOINT}/purchases`
        
        fetch(purchasesUrl)
            .then((purchasesRes) => {
                console.log(purchasesRes)
                if (!purchasesRes.ok)
                    return purchasesRes.json().then(e => Promise.reject(e));
                return purchasesRes.json();
            })
            .then((purchases) => {
                console.log(purchases)
                console.log(budget_id)
                let filterPurchases = [];
                for (let i = 0; i < purchases.length; i++) {
                    if (purchases[i].budget_id == budget_id) {
                        filterPurchases.push(purchases[i]);
                    }
                }
                //check if the validated data is structured in a new array objects
                console.log(filterPurchases);

                this.setState({ purchases: filterPurchases });
                console.log(this.state)
            })
            .catch(error => {
                console.log({ error });
            });
    }


    addIncome = (event) => {
        event.preventDefault();
        const userData = {}

        //get all the from data from the form component
        const formData = new FormData(event.target)

        //for each of the keys in form data populate it with form value
        for (let value of formData) {
            userData[value[0]] = value[1]
        }

        let x = this.state.money_available
        console.log(x)
        let y = userData.income
        console.log(y)

        this.addMoney(parseInt(x), parseInt(y))
        


        console.log('triggered')
    }

    addMoney = (x, y) => {
        const updatedBudget = {
            money_available: x + y
        }

        const budget_id = this.props.match.params.id

        console.log(updatedBudget)
        console.log(budget_id)

        fetch(`${config.API_ENDPOINT}/budgets/${budget_id}`,
            {
                method: 'PATCH',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(updatedBudget),
            })
            .then(res => {
                if (!res.ok)
                    return res.json().then(e => Promise.reject(e))
                return res.json()
            })
            .then(
                this.setState({
                    money_available: this.state.money_available
                }),
                this.props.history.push(`/budget/${budget_id}`)
            )
            .catch(error => {
                console.log(error.message)
            })
    }


    subtractMoney = (x, y) => {
        const updatedBudget = {
            money_available: x - y
        }

        console.log(updatedBudget)
        console.log(budget_id)

        const budget_id = this.props.match.params.id

        fetch(`${config.API_ENDPOINT}/budgets/${budget_id}`,
            {
                method: 'PATCH',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(updatedBudget),
            })
            .then(res => {
                if (!res.ok)
                    return res.json().then(e => Promise.reject(e))
                return res.json()
            })
            .then(
                this.setState({
                    money_available: this.state.money_available
                }),
                this.props.history.push(`/budget/${budget_id}`)
            )
            .catch(error => {
                console.log(error.message)
            })

    }


    addPurchase = (event) => {
        event.preventDefault();
        this.setState({
            purchases: [...this.state.purchases, { name: this.state.name, price: this.state.price }],
            name: "",
            price: 0
        })

        const budget_id = this.props.match.params.id

        const newPurchase = {
            budget_id: budget_id,
            purchase_name: this.state.purchase.purchase_name,
            purchase_cost: this.state.purchase.purchase_cost
        }
        console.log(newPurchase)

        fetch(`${config.API_ENDPOINT}/purchases`,
            {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(newPurchase),
            })
            .then(res => {
                if (!res.ok)
                    return res.json().then(e => Promise.reject(e))
                return res.json()
            })
            .then(response => {
                this.setState({
                    budget_id: response.budget_id,
                    purchase_name: this.state.purchase.purchase_name,
                    purchase_cost: this.state.purchase.purchase_cost
                })
            })
            .catch(error => {
                console.log(error.message)
            })
    }


    calculateDifference = (event) => {
        event.preventDefault();
        const userData = {}

        //get all the from data from the form component
        const formData = new FormData(event.target)

        //for each of the keys in form data populate it with form value
        for (let value of formData) {
            userData[value[0]] = value[1]
        }
        console.log(userData)
        console.log("triggered")

        let x = this.state.money_available
        console.log(x)
        let y = userData.purchase_cost
        console.log(y)

        this.subtractMoney(parseInt(x), parseInt(y))
    }


    handleClickDelete = e => {
        e.preventDefault()
        const { id } = this.props;

        fetch(`${config.API_ENDPOINT}/purchases/${id}`, {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json'
            },
        })
            .then(res => {
                if (!res.ok)
                    return res.json().then(e => Promise.reject(e))
                return res
            })
            .then(() => {
                this.props.onDeletePurchase(id)
                // let x = this.state.money_available
                // let y = purchase_cost

                // this.addMoney(parseInt(x), parseInt(y))
            })
            .catch(error => {
                console.error({ error })
            })
    }




    render() {
        const budget_title = this.state.budget_title
        const money_available = this.state.money_available
        const income = this.state.income
        const currentBudgetId = this.props.match.params.id

        let purchaseOutput = `budget/${currentBudgetId}purchases/:id`

        let purchases = this.state.purchases.map((purchases, idx) => (
            <li className="purchase">
                <form onSubmit={this.calculateDifference}>
                    <span><input defaultValue="" name="purchase_name" placeholder="purchase_name"></input></span>
                    <span><input defaultValue="0" name="price" className="price" placeholder="0.00"></input></span>
                    <Link to={purchaseOutput}><button className="link" type="button">Edit</button></Link>
                    <button type="submit">Calculate</button>
                    <button onClick={this.handleClickDelete} className="close"> X </button>
                </form>
            </li>
        ))
        return (
            <div>
                <section>
                    <div className="back">
                        <Link to="/mybudgets">
                            <button className="close">
                                Back
              </button>
                        </Link>
                    </div>
                    <div className="available">
                        <h1> {budget_title} </h1>
                        <span>Available money:</span><span className="amount-left">$<span>{money_available}</span></span>
                    </div>
                    <form onSubmit={this.addIncome} className="income-container">
                        <input className="income" name="income" placeholder={income}></input>
                        <button type="submit" >Add Income</button>
                    </form>
                    <div className="subtraction-section">
                        <button onClick={this.addPurchase}>Add a purchases</button>
                        <ul>
                            {purchases}
                        </ul>
                    </div>
                </section>
            </div >
        )
    }
}