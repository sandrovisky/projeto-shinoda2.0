import React, { Component } from 'react';
import  { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBInput, MDBInputNumeric, MDBInputGroup } from 'mdbreact'
import { Redirect } from 'react-router-dom'

import api from '../../services/api'

export default class LancarProducao extends Component{

    state = {
        idProducao: parseInt(this.props.match.params.idProducao),
        redirecionar: false
    }

    onHandleChange = event => {
        this.setState({[event.target.name]: event.target.value})
    }

    onSubmitLancarProducao = async (event) => {
        event.preventDefault()
        api.put('/producoes', {
            id: this.state.idProducao,
            status: "3",
            quantidadeIntegral: this.state.integral, 
            quantidadeGema: this.state.gema, 
            quantidadeClara: this.state.clara,
            endedBy: parseInt(localStorage.getItem('idUsuario')),
        })
        .then(async response => {
            console.log(response.data)
            this.setState({redirecionar: true})
        })
    }

    async componentDidMount() {
        api.get(`/producoes/${this.state.idProducao}`)
        .then( async (response) => {
            console.log(response.data)
            if ( response.data ) {
                this.setState({
                    dataCriacao: response.data.createdAt,
                    status: response.data.status === "1" ? "Em Digitação" : response.data.status === "2" ? "Em Produção" : "Finalizado"
                })
                if ( response.data.status !== "2" ) {
                    this.setState({redirecionar: true})
                }
            } else {
                this.setState({redirecionar: true})
            }           
        })
    }
    
    render(){

        if (this.state.redirecionar) {
            return <Redirect push to = '/producao' />
        }
        
        return (
            <div style = {{padding: "0em 2em 2em 2em", borderRadius: "10px", border: "2px solid", borderColor: "black", margin: "5em 1em 0 1em"}}>
                <h2 className="text-center font-weight-bold pt-4 pb-2"><strong>Lançar Produção</strong></h2>
                <MDBContainer style = {{padding: "1em 1em 1em 1em", borderRadius: "10px", border: "2px solid", borderColor: "black", }}>
                                    
                    <MDBRow>
                        <MDBCol >   
                            <label><strong>ID Produção:</strong> {" "+this.state.idProducao}</label>                                    
                        </MDBCol>

                        <MDBCol >   
                            <label><strong>Data de Inicio:</strong> {" "+this.state.dataCriacao}</label>                                    
                        </MDBCol>
                    </MDBRow>

                    <MDBRow>
                        <MDBCol >   
                            <label><strong>Status:</strong> {" "+this.state.status}</label>                                    
                        </MDBCol>
                    </MDBRow>
                    
                    <form onSubmit = {this.onSubmitLancarProducao} >

                        <MDBRow className="justify-content-center">

                            <MDBCol xl = "4" lg = "4" md = "8" >   
                                <MDBInput onFocus = {(e) => e.target.autocomplete = "off"} required label="Peso do Integral" value = {this.state.integral} name = "integral" onChange = {this.onHandleChange}/>
                            </MDBCol>

                            <MDBCol xl = "4" lg = "4" md = "8" >   
                                <MDBInput onFocus = {(e) => e.target.autocomplete = "off"} required label="Peso da Gema" value = {this.state.gema} name = "gema" onChange = {this.onHandleChange}/>
                            </MDBCol>
                                
                            <MDBCol xl = "4" lg = "4" md = "8" >   
                                <MDBInput onFocus = {(e) => e.target.autocomplete = "off"} required label="Peso da Clara" value = {this.state.clara} name = "clara" onChange = {this.onHandleChange}/>
                            </MDBCol>

                        </MDBRow>

                        <MDBRow className="text-center justify-content-center">
                            <MDBCol xl = "4" lg = "4" md = "8" >
                                <MDBBtn color = "elegant" type = "submit" >
                                    Salvar
                                </MDBBtn>
                            </MDBCol>
                        </MDBRow>

                    </form>                            
                </MDBContainer>
            </div>   
        );

    }  
}