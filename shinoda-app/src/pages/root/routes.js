import React, {Component} from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'

import Home from '../home/Home'
import Cadastros from '../cadastros/Cadastros'
import Fornecedor from '../cadastros/fornecedor/Fornecedor'


export default class Routes extends Component {

    render () {

      return (
        <div >

            
            <Router>

                <Switch>

                    <Route exact path = '/' component = {Home} />

                    <Route exact path = '/cadastros' component = {Cadastros} />

                    <Route exact path = '/cadastros/fornecedor' component = {Fornecedor} />

                        
                </Switch>

            </Router>
            
           
        </div>
      )
    }
}