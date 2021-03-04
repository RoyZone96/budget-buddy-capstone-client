import React, { Component } from 'react'
import config from '../config'
import { Link } from 'react-router-dom'
import TokenService from '../utilities/TokenService'

export default class EditPurchase extends Component {
  state = {
    purchase_name: {
      value: '',
      touched: false
    },
    purchase_cost: {
      value: 0,
      touched: false
    }
  }

  componentDidMount() {
    const purchases_id = this.props.match.params.purchase_id

    console.log(purchases_id)

    let url = `${config.API_ENDPOINT}/purchases/${purchases_id}`

    console.log(url)
    fetch(url)
      .then((purchasesRes) => {
        if (!purchasesRes.ok)
          return purchasesRes.json().then(e => Promise.reject(e));
        return Promise.all([purchasesRes.json()]);
      })
      .then((purchases) => {
        console.log(purchases)
        this.setState({ currentPurchases: purchases[0] });
        console.log(this.state)
      })
      .catch(error => {
        console.log({ error });
      });
  }

  editBudget = (event) => {
    event.preventDefault()
    const purchase_id = this.props.match.params.purchase_id

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
        this.setState({
          purchase_name: response.purchase_name,
          money_available: response.money_available
        })
        console.log(updatedPurchase)
      })
      .catch(error => {
        console.log(error.message)
      })
  }

  setPurchaseName = event => {
    
    this.setState({
      purchase_name: {
        value: event.target.value,
        touched: true
      }
    })
  }

  setPurchaseCost = event => {
    
    this.setState({
      purchase_cost: {
        value: event.target.value,
        touched: true
      }
    })
  }


  render() {
    return (
      <section className="new">
        <Link to="/budget/:id">
          <button className="close">
            X
          </button>
        </Link>
        <form className="new-budget" onSubmit={this.editBudget}>
          <p className="instructions"> Edit your purchase and click on the save when done. </p>
          <input
            className="purchase_name"
            placeholder="item" 
            type="text"
            name="purchase_name"
            onChange={event => this.setPurchaseName(event.target.value)} required />
          <span>$</span>
          <input className="money"
            placeholder="0"
            name="purchase_cost"
            onChange={event => this.setPurchaseCost(event.target.value)} required />
          <div>
            <button type="submit">Edit Purchase</button>
          </div>
        </form>
      </section>
    )
  }
}