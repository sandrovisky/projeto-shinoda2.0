import React, {Component} from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'

import Home from '../home/Home'

import Cadastros from '../cadastros/Cadastros'
import Fornecedor from '../cadastros/fornecedor/Fornecedor'
import Produto from '../cadastros/produto/Produto'
import Usuario from '../cadastros/usuario/Usuario'
import Equipamento from '../cadastros/equipamento/Equipamento'

import Entrada from '../almoxarife/Entrada'
import EntradaNovo from '../almoxarife/NovaEntrada'

import Laboratorio from '../lab/Index'



export default class Routes extends Component {

    render () {

      return (
        <div >

            
            <Router>

                <Switch>

                    <Route exact path = '/Home' component = {Home} />

                    <Route exact path = '/cadastros' component = {Cadastros} />

                    <Route exact path = '/entrada' component = {Entrada} />

                    <Route exact path = '/entrada/novo' component = {EntradaNovo} />

                    <Route path = '/cadastros/fornecedor' component = {Fornecedor} />

                    <Route path = '/cadastros/produto' component = {Produto} />

                    <Route path = '/cadastros/usuario' component = {Usuario} />

                    <Route path = '/cadastros/equipamento' component = {Equipamento} />

                    <Route path = '/laboratorio' component = {Laboratorio} />

                        
                </Switch>

            </Router>
            
           
        </div>
      )
    }
}