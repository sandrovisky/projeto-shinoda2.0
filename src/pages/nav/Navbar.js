import {Component} from 'react';
import { MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavbarToggler, MDBCollapse, MDBNavItem, MDBNavLink, MDBIcon} from 'mdbreact';
import { BrowserRouter as Router} from 'react-router-dom';

import api from '../../services/api'

import history from '../../func'

export default class Navbar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            collapse: false,
        };
    }

    onClickHome = () => {
        history.push('/home')
    }

    onClickEntrada = () => {
        history.push('/entrada')
    }

    onClickLaboratorio = () => {
        history.push('/laboratorio')
    }

    onClickProducao = () => {
        history.push('/producao')
    }

    onClickCadastro = () => {
        history.push('/cadastros')
    }


    onClick = () => {
    this.setState({
        collapse: !this.state.collapse,
        });
    }

    onClickLogout = async  () => {
        localStorage.setItem("auth", "false")
        localStorage.setItem("usuario", "")
        
        window.location.reload()
    }

    async componentDidMount () {

        
            if(localStorage.getItem("auth") === "true"){
                let linkto = [
                    <MDBNavLink onClick = {this.onClickLogout} key = "1" to="">
                        Usuario: {localStorage.getItem("usuario")}
                        {" "}<MDBIcon  icon="sign-in-alt" />
                    </MDBNavLink>
                ]
                this.setState({logged: linkto}) 
            } else {
                let linkto = []
                this.setState({logged: linkto}) 
            }            
               
    }

    render() {
        return(
            <div>
                <Router>
                    <header>
                        <MDBNavbar color="black" fixed="top" dark expand="md">

                            <MDBNavbarBrand href="/">
                                <strong>Shinoda</strong>
                            </MDBNavbarBrand>

                                <MDBNavbarToggler onClick={ this.onClick } />

                                <MDBCollapse isOpen = { this.state.collapse } navbar>

                                    <MDBNavbarNav left>

                                         <MDBNavItem active>          
                                                                   
                                            <MDBNavLink onClick = {this.onClickHome} to="/">Home</MDBNavLink>
                                        
                                        </MDBNavItem>
                                        

                                        <MDBNavItem>
                                        
                                            <MDBNavLink onClick = {this.onClickCadastro} to="cadastros">Cadastros</MDBNavLink>
                                        
                                        </MDBNavItem>

                                        <MDBNavItem>
                                        
                                            <MDBNavLink onClick = {this.onClickEntrada} to="entrada">Entrada</MDBNavLink>
                                        
                                        </MDBNavItem>

                                        <MDBNavItem>
                                        
                                            <MDBNavLink onClick = {this.onClickLaboratorio} to="laboratorio">Laboratório</MDBNavLink>
                                        
                                        </MDBNavItem>

                                        <MDBNavItem>
                                        
                                            <MDBNavLink onClick = {this.onClickProducao} to="laboratorio">Produção</MDBNavLink>
                                    
                                        </MDBNavItem>

                                    </MDBNavbarNav>
                                    
                                <MDBNavbarNav right>
                                    {this.state.logged}
                                </MDBNavbarNav>

                            </MDBCollapse>
                        </MDBNavbar>
                    </header>
                </Router>

            </div>
        );
    }
}