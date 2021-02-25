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
            purchases: [],
            existingPurchases: []
        }
        // this.handleChange = this.handleChange.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this)
    }


    componentDidMount() {
        const budget_id = this.props.match.params.id
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

        let purchasesUrl = `${config.API_ENDPOINT}/purchases/`

        console.log(purchasesUrl)
        fetch(purchasesUrl)
            .then((purchasesRes) => {
                if (!purchasesRes.ok)
                    return purchasesRes.json().then(e => Promise.reject(e));
                return Promise.all([purchasesRes.json()]);
            })
            .then((purchases) => {
                console.log(purchases)
                this.setState({ purchases: purchases[0] });
                console.log(this.state)
            })
            .catch(error => {
                console.log({ error });
            });
    }


    addIncome = (event) => {
        event.preventDefault();
        const budget_id = this.props.match.params.budget_id 
        const income_id = this.props.match.params.id
        console.log(budget_id, income_id, "here")

        const newIncome = {
            budget_id: budget_id,
            income: this.state.income
        }

        const updatedIncome = {
            income: this.state.income
        }

        const userData = {}

        //get all the from data from the form component
        const formData = new FormData(event.target)

        //for each of the keys in form data populate it with form value
        for (let value of formData) {
            userData[value[0]] = value[1]
        }
        console.log('triggered')
        console.log(userData)

        // console.log(data)
        // let x = this.state.money_available
        // let y = this.state.income
        // function add(x, y) {
        //     return x + y
        // }
        // this.setState({
        //     money_available: add
        // })

        //if the income id isn't there do a post
        if (income_id == undefined) {
            console.log(newIncome)
            console.log("posted")
            fetch(`${config.API_ENDPOINT}/incomes`,
                {
                    method: 'POST',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify(newIncome),
                })
                .then(res => {
                    if (!res.ok)
                        return res.json().then(e => Promise.reject(e))
                    return res.json()
                })
                .then(response => {
                    this.setState({
                        income: response.income
                    })
                    console.log(ApiContext)
                    console.log(newIncome)
                })
                .catch(error => {
                    console.log(error.message)
                })
        }
        //if it is do a patch
        else {
            console.log(updatedIncome)
            console.log("updated")
            fetch(`${config.API_ENDPOINT}/incomes/${income_id}`,
                {
                    method: 'PATCH',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify(updatedIncome),
                })
                .then(res => {
                    if (!res.ok)
                        return res.json().then(e => Promise.reject(e))
                    return res.json()
                })
                .then(response => {
                    this.setState({
                        income: response.income
                    })
                    console.log(ApiContext)
                    console.log(updatedIncome)
                })
                .catch(error => {
                    console.log(error.message)
                })
        }
    }




    addPurchase = (event) => {
        event.preventDefault();

        const budget_id = this.props.match.params.budget_id

        const newPurchase = {
            budget_id: budget_id,
            purchase_name: this.state.purchase_name,
            purchase_cost: this.state.purchase_cost
        }

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
                this.context.addPurchase(response)
                this.setState({
                    purchases: [...this.state.purchases, { name: this.state.name, price: this.state.price }],
                    name: '',
                    price: ''
                })
                console.log(ApiContext)
                console.log(newPurchase)
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

        const purchase_id = this.props.match.params.id

        const updatedPurchase = {
            purchase_name: this.state.purchase_name,
            purchase_cost: this.state.purchase_cost
        }

        fetch(`${config.API_ENDPOINT}/purchases/${purchase_id}`,
            {
                method: 'PATCH',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(updatedPurchase),
            })
            .then(res => {
                if (!res.ok)
                    return res.json().then(e => Promise.reject(e))
                return res.json()
            })
            .then(response => {
                //   this.context.addQuestion(response)
                this.setState({
                    money_available: this.state.money_available
                })
                console.log(updatedPurchase)
            })
            .catch(error => {
                console.log(error.message)
            })
        // function difference(x, y) {
        //     return x - y
        // }
        // return difference
    }


    handleClickDelete = e => {
        e.preventDefault()
        const { id } = this.props;

        fetch(`${config.API_ENDPOINT}/budgets/${id}`, {
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
                this.context.deleteBudget(id)
                this.props.onDeleteBudget(id)
            })
            .catch(error => {
                console.error({ error })
            })
    }

    saveBudget = (event) => {
        event.preventDefault();

        const updatedBudget = {
            money_available: this.state.money_available
        }

        fetch(`${config.API_ENDPOINT}/budgets/${this.props.id}`,
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
            .then(response =>
                this.context.addQuestion(response),
                console.log(ApiContext))
            .then(
                console.log(updatedBudget),
                this.props.history.push('/mybudget')
            )
            .catch(error => {
                console.log(error.message)
            })
    }


    render() {
        // const { }
        const budget_title = this.state.budget_title
        const money_available = this.state.money_available

        let purchases = this.state.purchases.map((purchases, idx) => (
            <li className="purchase">
                <form onSubmit={this.calculateDifference}>
                    <span><input defaultValue="" name="purchase_name" placeholder="purchase_name"></input></span>
                    <span><input defaultValue="0" name="price" className="price" placeholder="0.00"></input></span>
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
                        <input className="income" name="income" placeholder="0.00"></input>
                        <button type="submit">Add Income</button>
                    </form>
                    <div className="subtraction-section">
                        <button onClick={this.addPurchase}>Add a purchases</button>
                        <ul>
                            {purchases}
                        </ul>
                    </div>
                    <button type="submit" onClick={this.saveBudget}>Save</button>
                </section>
            </div >
        )
    }
}