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
        const budget_id = this.props.match.params.id

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

        this.addMoney(x, y)
        this.props.history.push(`/budget/${budget_id}`)


        console.log('triggered')
    }

    addMoney = (x_input, y_input) => {
        let x = parseFloat(x_input)
        let y = parseFloat(y_input)
   
        // console.log(typeof x);
        // console.log(typeof y);

        let money_available_comp = (x + y)
        // console.log(money_available_comp)

        const updatedBudget = {
            money_available: money_available_comp
        }

        const budget_id = this.props.match.params.id

        // console.log(updatedBudget)
        // console.log(budget_id)

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


        const budget_id = this.props.match.params.id
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
                this.props.history.push(`/budget/${budget_id}`)
            })
            .catch(error => {
                console.log(error.message)
            })
    }


    calculateDifference = (event) => {
        event.preventDefault();
        console.log("triggered")

        const budget_id = this.props.match.params.id

        let x = event.target.money_available.value
        console.log(x)
        let y = event.target.purchase_cost.value
        console.log(y)

        this.subtractMoney(parseFloat(x), parseFloat(y))
        this.props.history.push(`/budget/${budget_id}`)
    }


    handleClickDelete = e => {
        e.preventDefault()
        const budget_id = this.props.match.params.id
        let purchases_id = e.target.purchase_id.value
        let delete_money_available = e.target.delete_money_available.value
        let delete_purchase_cost = e.target.delete_purchase_cost.value
        console.log(purchases_id, delete_money_available, delete_purchase_cost)

        fetch(`${config.API_ENDPOINT}/purchases/${purchases_id}`, {
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
                this.props.onDeletePurchase(purchases_id)
                this.addMoney(parseInt(delete_money_available), parseInt(delete_purchase_cost))
                this.props.history.push(`/budget/${budget_id}`)
            })
            .catch(error => {
                console.error({ error })
            })
    }




    render() {
        const budget_title = this.state.budget_title
        const money_available = this.state.money_available
        const purchases_id = this.state.purchases.id
        const currentBudgetId = this.props.match.params.id


        console.log(this.state.purchases)
        let purchases = this.state.purchases.map((purchase, idx) => {
            let purchaseOutput = `/purchases/${purchase.id}`
            return (
                <li className="purchase">

                    <form onSubmit={this.handleClickDelete}>
                        <button type="submit" className="delete"> X </button>
                        <input type='hidden' name='purchase_id' defaultValue={purchase.id}></input>
                        <input type='hidden' name='delete_purchase_cost' defaultValue={purchase.purchase_cost}></input>
                        <input type='hidden' name='delete_money_available' defaultValue={money_available}></input>
                    </form>
                    <span className="purchase_name">{purchase.purchase_name}</span>
                    <span className="purchase_cost"><span>{purchase.purchase_cost}</span></span>
                    <div className="purchase-menu">
                        <Link to={purchaseOutput}><button className="link" type="button">Edit</button></Link>
                        <form onSubmit={this.calculateDifference}>
                            <button type="submit">Calculate</button>
                            <input type='hidden' name='purchase_cost' defaultValue={purchase.purchase_cost}></input>
                            <input type='hidden' name='money_available' defaultValue={money_available}></input>
                        </form>

                    </div>

                </li>
            )
        }
        )
        return (

            <section id="edit">
                <div className="back clearfix">
                    <Link to="/mybudgets">
                        <button className="close">
                            Back
              </button>
                    </Link>
                </div>
                <div className="available">
                    <h1 className="budget_title"> {budget_title} </h1>
                    <span className="amount-left">Available money:</span><span>{money_available}</span>
                </div>
                <form onSubmit={this.addIncome} className="income-container">
                    <input className="income" name="income" placeholder="$0.00"></input>
                    <button type="submit" >Add Income</button>
                </form>
                <div className="subtraction-section">
                    <button onClick={this.addPurchase}>Add a purchases</button>
                    <ul>
                        {purchases}
                    </ul>
                </div>
            </section>

        )
    }
}