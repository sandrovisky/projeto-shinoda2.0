import React, {Component} from 'react';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom'

import Home from '../home/Home'

import Cadastros from '../cadastros/Cadastros'
import Fornecedor from '../cadastros/fornecedor/Fornecedor'
import Produto from '../cadastros/produto/Produto'
import Usuario from '../cadastros/usuario/Usuario'
import Equipamento from '../cadastros/equipamento/Equipamento'
import Coletar from '../lab/Coletar'
import Finalizado from '../lab/Finalizado'

import Entrada from '../almoxarife/Entrada'
import Print from '../almoxarife/component/Print'
import EntradaNovo from '../almoxarife/NovaEntrada'
import Laboratorio from '../lab/Laboratorio'
import Login from '../home/Login'

window.sessionStorage.setItem("auth", "false")
export default class Routes extends Component {

    state = {
        auth: localStorage.getItem("auth")
    }
    
    render () {

        if (this.state.auth === "false") {
            return (
                <div>
                    
                    <Router>
                        <Redirect to = "/login" />
                        <Switch>  

                            <Route path = '/' component = {Login} />
                                
                        </Switch>

                    </Router>
                </div>                
            )            
        }

        return (
            <div >
                
                <Router>

                    <Switch>  

                        <Route exact path = '/Home' component = {Home} />

                        <Route exact path = '/cadastros' component = {Cadastros} />

                        <Route exact path = '/entrada' component = {Entrada} />

                        <Route exact path = '/entrada/novo/:idMove' component = {EntradaNovo} />

                        <Route exact path = '/entrada/impressao/:idMove' component = {Print} />

                        <Route path = '/cadastros/fornecedor' component = {Fornecedor} />

                        <Route path = '/cadastros/produto' component = {Produto} />

                        <Route path = '/cadastros/usuario' component = {Usuario} />

                        <Route path = '/cadastros/equipamento' component = {Equipamento} />

                        <Route exact path = '/laboratorio' component = {Laboratorio} />

                        <Route path = '/laboratorio/coletar/:id' component = {Coletar} />

                        <Route path = '/laboratorio/finalizado/:id' component = {Finalizado} />
                            
                    </Switch>

                </Router>                
            
            </div>
        )
    }
}