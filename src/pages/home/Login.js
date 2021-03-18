import { Component } from 'react';
import { MDBCol, MDBContainer, MDBInput, MDBRow, MDBBtn } from 'mdbreact'

import * as Auth from '../../services/auth'

export default class Login extends  Component{

    state = {
        usuario: "",
        senha: ""
    }

    onSubmit= async (e) => {
        e.preventDefault()
        await Auth.Login(this.state.usuario, this.state.senha)        
    }

    onHandleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })  
    }

    render () {
        return(
            <div style = {{padding: "0em 1em 1em 1em", borderRadius: "10px", border: "2px solid", borderColor: "black", margin: "5em 1em 0 1em", textAlign: "center"}} >
            <h1>Logar</h1>
                <form onSubmit = {this.onSubmit}>    
                    
                    <MDBContainer >
                        <MDBRow className = "justify-content-center">
                            <MDBCol xl = "4" lg = "4" md = "6" sm = "6">
                                <MDBInput onFocus = {(e) => e.target.autocomplete = "off"} label = "Username" required value = {this.state.usuario} onChange = {this.onHandleChange} name = "usuario" type="text" />      
                            </MDBCol>
                        </MDBRow>
                            
                    </MDBContainer>

                    <MDBContainer >
                        <MDBRow className = "justify-content-center">
                            <MDBCol  xl = "4" lg = "4" md = "6" sm = "6">
                                <MDBInput onFocus = {(e) => e.target.autocomplete = "off"} label = "Senha" required value = {this.state.senha} onChange = {this.onHandleChange} name = "senha" type="password" />
                            </MDBCol>
                        </MDBRow>
                    </MDBContainer>

                    <MDBBtn type = "submit" color="elegant">Logar</MDBBtn>
                </form>
            </div>
        )
    }
    
}