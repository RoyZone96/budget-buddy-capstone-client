import React, { Component } from 'react'
import { NavLink, Link } from 'react-router-dom'

import config from '../config'
import ApiContext from '../ApiContext'


export default class BudgetNav extends Component {
  static defaultProps = {
    onDeleteBudget: () => { },
    match: {
      params: {}
    },
  }

  state = {
    id: 0,
    user_id: 0
  }

  static contextType = ApiContext;

  componentDidMount() {
    const url = `${config.API_ENDPOINT}/budgets/${this.props.id}`
    console.log(url)
    fetch(url, {
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      },
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(e => Promise.reject(e))
        return res.json()
      })
      .then((responseJson) => {
        console.log(responseJson)
        this.setState({
          id: responseJson.id,
          user_id: responseJson.user_id,
          budget_title: responseJson.budget_title,
          money_available: responseJson.money_available,
          date_created: responseJson.date_created,
          date_updated: responseJson.date_updated
        })
      })
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


  render() {
    return (
      <div className='boardNav'>
        <div className="button-spacer">
          <Link to={`/budgets/${this.props.id}`}>
            <button type="button"> EDIT </button>
          </Link>
        </div>
        <div className="button-spacer">
          <button type="button" onClick={this.handleClickDelete}> DELETE </button>
        </div>
      </div>
    )
  }
}
