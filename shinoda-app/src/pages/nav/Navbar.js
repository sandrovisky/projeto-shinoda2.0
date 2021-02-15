import {Component} from 'react';
import { MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavbarToggler, MDBCollapse, MDBNavItem, MDBNavLink, MDBIcon} from 'mdbreact';
import { BrowserRouter as Router} from 'react-router-dom';

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

    onClickCadastro = () => {
        history.push('/cadastros')
    }


    onClick = () => {
    this.setState({
        collapse: !this.state.collapse,
        });
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

                                    </MDBNavbarNav>
                                    
                                <MDBNavbarNav right>
                                    <MDBNavLink to="#">
                                        <MDBIcon icon="sign-in-alt" />
                                        Login
                                    </MDBNavLink>
                                </MDBNavbarNav>

                            </MDBCollapse>
                        </MDBNavbar>
                    </header>
                </Router>

            </div>
        );
    }
}