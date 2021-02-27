import React, { Component } from 'react'
import config from '../config'
import ApiContext from '../utilities/ApiContext'
import TokenService from '../utilities/TokenService'

export default class PurchasesArea extends Component{
    state = {
        purchases: [],
        existingPurchases: []
    }

    componentDidMount(){
         let url = `${config.API_ENDPOINT}/purchases`

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
}