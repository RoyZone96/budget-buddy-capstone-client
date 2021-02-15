import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import config from '../config'
import ApiContext from '../ApiContext'



export default class QuestionForm extends Component {

  static contextType = ApiContext;


  constructor(props) {
    super(props);
    this.state = {
      title: "",
      money_available: [],
      purchases: [],
      existingPurchases: []
    }
    // this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this)
  }


  componentDidMount() {


  //   console.log(url)
  //   fetch(url)
  //     .then((purchasesRes) => {
  //       if (!purchasesRes.ok)
  //         return purchasesRes.json().then(e => Promise.reject(e));
  //       return Promise.all([purchasesRes.json()]);
  //     })
  //     .then((purchases) => {
  //       console.log(purchases)
  //       this.setState({ currentPurchases: purchases[0] });
  //       console.log(this.state)
  //     })
  //     .catch(error => {
  //       console.log({ error });
  //     });
   }



  addIncome = (event) => {
    event.preventDefault();
    let x = this.state.money_available
    let y = this.state.income
    function add(x, y){
      return x + y
    }
    return add
  }

  addPurchase = (event) => {
    event.preventDefault();
    this.setState({
      purchases: [...this.state.purchases, { name: this.state.name, score: this.state.price }],
      name: '',
      price: ''
    })
  }

  calculateDifference = (event) => {
    event.preventDefault();
    let x = this.state.money_available
    let y = this.state.price    
      function difference(x, y){
        return x - y
      }
      return difference
  }




  saveBudget = (event) => {
    event.preventDefault();

    fetch(`${config.API_ENDPOINT}/budgets/{this.props.id}`,
      {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(newQuestion),
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
    const {}
    const {money_available} = this.state.props.money_available
    let purchases = this.state.purchases.map((purchases, idx) => (
      <li className="purchase">
        <span><input placeholder="purchase name"></input></span>
        <span><input className="amount" placeholder="0.00"></input></span>
        <button>Calculate</button>
        <button className="close"> X </button>
      </li>
    ))
    return (
      <div>
        <section>
          <div className="back">
            <button> Back </button>
          </div>
          <div className="available">
            <h1> Budget Title </h1>
            <span>Available money:</span><span className="amount-left">$<span>{money_available}</span></span>
          </div>
          <div className="income-container">
            <input className="income" placeholder="0.00"></input>
            <button>Add Income</button>
          </div>
          <div className="subtraction-section">
            <button onClick={this.addPurchase()}>Add a purchases</button>
            <ul>
              {purchases}
            </ul>
          </div>
        </section>
      </div >
    )
  }
}
