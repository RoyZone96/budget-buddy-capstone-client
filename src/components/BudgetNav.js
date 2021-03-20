import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import config from '../config'
import ApiContext from '../utilities/ApiContext'


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
        this.props.history.push(`/`)
        this.forceUpdate();
      })
      .catch(error => {
        console.error({ error })
      })
  }


  render() {
    return (
      <div className='boardNav'>
        <Link to={`/budget/${this.props.id}`}>
          <button type="button"> EDIT </button>
        </Link>
        <button type="button" className="delete" onClick={this.handleClickDelete}> DELETE </button>
      </div>
    )
  }
}
