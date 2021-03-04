import React, {Component} from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Error from './components/Error'
import AddBudget from './components/AddBudget'
import EditBudget from './routes/EditBudget'
import EditPurchase from './routes/EditPurchase'
import ApiContext from './utilities/ApiContext'
import Support from './routes/Support'
import LandingPage from './routes/LandingPage'
import LoginForm from './routes/LoginForm'
import MyBudgets from './routes/MyBudgets'
import RegistrationForm from './routes/RegistrationForm'


class App extends Component {
  state = {
    hasError: false,
    budget: [],
    user: {}
  }

  requestSupport = (event) => { }

  setUser = (event) => { }

  addBudget = (event) => { }

  deleteBudget = (event) => { }

 
  render() {
    const value = {
      budget: this.state.budget,
      addBudget: this.addBoard,
      deleteBudget: this.deleteBoard,
    }
    console.log(value)

    return (
      <ApiContext.Provider value={value}>
        <div>
          <BrowserRouter>
            <Header />
            <main className='App'>
              <Switch>
                <Route exact path="/" component={LandingPage} />
                <Route path='/login' component={LoginForm} />
                <Route path='/registration' component={RegistrationForm} />
                <Route path='/mybudgets' component={MyBudgets} />
                <Route path='/support' component={Support} />
                <Route path='/newbudget' component={AddBudget} />
                <Route path='/budget/:id/' component={EditBudget} />
                <Route path='/purchases/:purchase_id' component={EditPurchase}/>
                <Route component={Error} />
              </Switch>
            </main>
          </BrowserRouter>
          <div className="footer">
            <Footer />
          </div>
        </div>
      </ApiContext.Provider>
    );
  }
}

export default App;
