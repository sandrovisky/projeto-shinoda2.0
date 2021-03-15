import { Component } from 'react';
import { MDBCol, MDBContainer, MDBInput, MDBRow, MDBBtn } from 'mdbreact'
import api from '../../services/api'

export default class Login extends  Component{

    state = {
        usuario: "",
        senha: ""
    }

    onSubmit= async (e) => {

        e.preventDefault()
        this.setState({ver: false})
        
        await api.get(`/users/login/${this.state.usuario}/${this.state.senha}`)
        .then(async response => {
            if (this.state.usuario === "admin" && this.state.senha === "admin") {
                localStorage.setItem("auth", "true")
                localStorage.setItem("usuario", "admin")                
                localStorage.setItem("idUsuario", 9999);
                const url = document.referrer.split('/')[3]
                
                if (url === "" || url === "login") {
                    window.open(`/home`, '_self')
                } else {
                    window.open(`/${document.referrer.split('/')[3]}`, '_self')
                }
            } else if ( response.data ) {
                localStorage.setItem("auth", "true");
                localStorage.setItem("usuario", response.data.usuario);
                localStorage.setItem("idUsuario", response.data.id);
                const url = document.referrer.split('/')[3]

                if (url === undefined || url === "login") {
                    window.open(`/home`, '_self')
                } else {
                    window.open(`/${document.referrer.split('/')[3]}`, '_self')
                }
            } else {
                alert("Usuario ou senha invalidos") 
            }
        })  
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
                                <MDBInput onFocus = {(e) => e.target.autocomplete = "off"} label = "Username" value = {this.state.usuario} onChange = {this.onHandleChange} name = "usuario" type="text" />      
                            </MDBCol>
                        </MDBRow>
                            
                    </MDBContainer>

                    <MDBContainer >
                        <MDBRow className = "justify-content-center">
                            <MDBCol  xl = "4" lg = "4" md = "6" sm = "6">
                                <MDBInput onFocus = {(e) => e.target.autocomplete = "off"} label = "Senha" value = {this.state.senha} onChange = {this.onHandleChange} name = "senha" type="password" />
                            </MDBCol>
                        </MDBRow>
                    </MDBContainer>

                    <MDBBtn type = "submit" color="elegant">Logar</MDBBtn>
                </form>
            </div>
        )
    }
    
}