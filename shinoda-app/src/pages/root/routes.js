import React, {Component} from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'

import Home from '../home/Home'
import Cadastros from '../cadastros/Cadastros'
import Fornecedor from '../cadastros/fornecedor/Fornecedor'
import Produto from '../cadastros/produto/Produto'
import Usuario from '../cadastros/usuario/Usuario'
import Equipamento from '../cadastros/equipamento/Equipamento'



export default class Routes extends Component {

    render () {

      return (
        <div >

            
            <Router>

                <Switch>

                    <Route exact path = '/' component = {Home} />

                    <Route exact path = '/cadastros' component = {Cadastros} />

                    <Route exact path = '/cadastros/fornecedor' component = {Fornecedor} />

                    <Route exact path = '/cadastros/produto' component = {Produto} />

                    <Route exact path = '/cadastros/usuario' component = {Usuario} />

                    <Route exact path = '/cadastros/equipamento' component = {Equipamento} />

                        
                </Switch>

            </Router>
            
           
        </div>
      )
    }
}