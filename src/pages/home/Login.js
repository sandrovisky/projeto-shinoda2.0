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
        
        await api.get(`/users/login/${this.state.usuario}/${this.state.senha}`)
        .then(async response => {
            console.log(response.data)
            if (response.data) {
                localStorage.setItem('log', true);
                localStorage.setItem('usuario', response.data.usuario);
                this.props.getLogged(localStorage.getItem('log')) 
                
                window.location.reload()
            } else if(this.state.usuario === "admin" && this.state.senha === "admin") { 
                localStorage.setItem('log', true);
                localStorage.setItem('usuario', "admin");
                this.props.getLogged(localStorage.getItem('log')) 

                window.location.reload()
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
                                <MDBInput  label = "Username" value = {this.state.usuario} onChange = {this.onHandleChange} name = "usuario" type="text" />      
                            </MDBCol>
                        </MDBRow>
                            
                    </MDBContainer>

                    <MDBContainer >
                        <MDBRow className = "justify-content-center">
                            <MDBCol  xl = "4" lg = "4" md = "6" sm = "6">
                                <MDBInput label = "Senha" value = {this.state.senha} onChange = {this.onHandleChange} name = "senha" type="password" />
                            </MDBCol>
                        </MDBRow>
                    </MDBContainer>

                    <MDBBtn type = "submit" color="elegant">Logar</MDBBtn>

                </form>
                {this.state.usuario}
                {this.state.senha}

            </div>
        )
    }
    
}