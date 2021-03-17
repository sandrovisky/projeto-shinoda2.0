import React, {Component} from 'react';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom'

import { isAuthenticated } from '../../services/auth'

import Home from '../home/Home'

import Producao from '../producao/Producao'
import NovaProducao from '../producao/NovaProducao'
import LancarProducao from '../producao/LancarProducao'
import FinalizadoProducao from '../producao/FinalizadoProducao'
import DevolucaoProducao from '../producao/DevolucaoProducao'

import Cadastros from '../cadastros/Cadastros'
import Fornecedor from '../cadastros/fornecedor/Fornecedor'
import Produto from '../cadastros/produto/Produto'
import Usuario from '../cadastros/usuario/Usuario'
import Equipamento from '../cadastros/equipamento/Equipamento'

import Coletar from '../lab/Coletar'
import Finalizado from '../lab/Finalizado'
import Laboratorio from '../lab/Laboratorio'

import Entrada from '../almoxarife/Entrada'
import Print from '../almoxarife/component/Print'
import EntradaNovo from '../almoxarife/NovaEntrada'

import Login from '../home/Login'

export default class Routes extends Component {

    onHandleChange = event => {
        this.setState({[event.target.name]: event.target.value})
    }
    
    render () {
        if (isAuthenticated()) {
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

                        <Route exact path = '/entrada' component = {Entrada} />
                        <Route path =       '/entrada/novo/:idMove' component = {EntradaNovo} />
                        <Route path =       '/entrada/impressao/:idMove' component = {Print} />

                        <Route exact path = '/cadastros' component = {Cadastros} />
                        <Route path =       '/cadastros/fornecedor' component = {Fornecedor} />
                        <Route path =       '/cadastros/produto' component = {Produto} />
                        <Route path =       '/cadastros/usuario' component = {Usuario} />
                        <Route path =       '/cadastros/equipamento' component = {Equipamento} />
                        <Route exact path = '/laboratorio' component = {Laboratorio} />

                        <Route path =       '/laboratorio/coletar/:id' component = {Coletar} />
                        <Route path =       '/laboratorio/finalizado/:id' component = {Finalizado} />

                        <Route exact path = '/producao' component = {Producao} />
                        <Route path = '/producao/novo/:idProducao' component = {NovaProducao} />
                        <Route path = '/producao/lancar/:idProducao' component = {LancarProducao} />
                        <Route path = '/producao/finalizado/:idProducao' component = {FinalizadoProducao} />                        
                        <Route path = '/producao/devolucao/:idProducao' component = {DevolucaoProducao} />
                            
                    </Switch>

                </Router>                
            
            </div>
        )
    }
}