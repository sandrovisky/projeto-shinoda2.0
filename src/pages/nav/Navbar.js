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

    onClickCadastro = () => {
        history.push('/cadastros')
    }


    onClick = () => {
    this.setState({
        collapse: !this.state.collapse,
        });
    }

    onClickLogout = async  () => {
        await api.put('/storages', {
            log: "false"
        })
        
        window.location.reload()
    }

    async componentDidMount () {

        // await api.get('/storages')
        // .then(async response => {
        //     if(response.data.log !== "false"){
        //         let linkto = [
        //             <MDBNavLink  key = "1" to="">
        //                 Usuario: {response.data.usuario}
        //                 {" "}<MDBIcon onClick = {this.onClickLogout} icon="sign-in-alt" />
        //             </MDBNavLink>
        //         ]
        //         this.setState({logged: linkto}) 
        //     } else {
        //         let linkto = []
        //         this.setState({logged: linkto}) 
        //     }            
        // })        
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