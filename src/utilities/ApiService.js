import config from '../config'

const ApiService = {
  getPurchase(purchases_id) {
    return fetch(`${config.API_ENDPOINT}/purchases/${purchases_id}`, {
      headers: {
      },
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      )
  },
  getUsersBoards(usersId) {
    return fetch(`${config.API_ENDPOINT}/users/${usersId}/boards`, {
      headers: {
      },
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      )
  },
  postBoard(usersId, text) {
    return fetch(`${config.API_ENDPOINT}/boards`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        users_id: usersId,
        text,
      }),
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      )
  }
}

export default ApiService

