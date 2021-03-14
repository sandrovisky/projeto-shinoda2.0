import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { MDBContainer, MDBTable, MDBTableHead, MDBTableBody, MDBRow, MDBCol, MDBInput, MDBBtn } from 'mdbreact';

import api from '../../services/api'

export default class DevolucaoProducao extends Component{

    state = {
        idProducao: parseInt(this.props.match.params.idProducao),
        redirecionar: false
    }

    onHandleChange = event => {
        this.setState({[event.target.name]: event.target.value})
    }

    async componentDidMount () {
        api.get(`/producoes/${this.state.idProducao}`)
        .then( async (response) => {            
            console.log(response.data)
            if ( response.data ) {
                this.setState({
                    dataCriacao: response.data.createdAt,
                    dataFim: response.data.endedAt,
                })
                if ( response.data.status !== "3" ) {
                    this.setState({redirecionar: true})
                }
            } else if ( this.state.idProducao !== 0  ) {
                this.setState({redirecionar: true})
            }           
        })

        const response =  await api.get(`/producao-itens/producao/${this.state.idProducao}`);
    
        //manipulando os dados que preencherão o tabledata
        let tableData = []
        console.log(response.data)
        if (response !== null){
            response.data.map(dados => tableData.push(
                <tr key = {dados.id}>
                    <td>{dados.moveitensvolume.id}</td>
                    <td>{dados.moveitensvolume.lote.lote}</td>
                    <td>{dados.moveitensvolume.quantidadeTotal}{" " + dados.moveitensvolume.moveitens.product.medida}</td>
                </tr>
            ))                
            this.setState({tabela: tableData})
        }      
    }

    onSubmitDevolucao = async (event) => {
        event.preventDefault()
        
        api.post(`/devolucoes`, {
            pesoTotal: this.state.peso,
            idProducao: this.state.idProducao,
            createdBy: parseInt(localStorage.getItem('idUsuario')),
        })
        .then(async response => {
            console.log(response)
            await api.put(`/producoes`, {
                id: this.state.idProducao,
                status: "4"
            })
            .then(async responseProducao => {
                this.setState({redirecionar: true})
            })
        })
    }
    
    render(){

        if (this.state.redirecionar) {
            return <Redirect push to = '/producao' />
        }
        
        return (
            <div style = {{padding: "0em 2em 2em 2em", borderRadius: "10px", border: "2px solid", borderColor: "black", margin: "5em 1em 0 1em"}}>
                <MDBContainer style = {{padding: "1em 1em 1em 1em", borderRadius: "10px", border: "2px solid", borderColor: "black", marginTop: "0.5em" }}>
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
                            <label><strong>Status:</strong>Produção Finalizada</label>                                    
                        </MDBCol>
                        <MDBCol >   
                            <label><strong>Finalizado em:</strong> {" "+this.state.dataFim}</label>                                    
                        </MDBCol>
                    </MDBRow>
                    <form onSubmit = {this.onSubmitDevolucao} >
                    <MDBRow className="justify-content-center">
                        <MDBCol size = "6" >   
                            <MDBInput onFocus = {(e) => e.target.autocomplete = "off"} required label="Insira o PESO TOTAL dos paletes" value = {this.state.peso} name = "peso" onChange = {this.onHandleChange}/>
                        </MDBCol>
                    </MDBRow>
                    
                    <MDBRow>
                        <MDBCol>
                            <MDBBtn type = "submit" color="primary" size="sm" rounded style = {{width: "100%", margin: "1em 0 0 0"}}  >Adicionar</MDBBtn>
                        </MDBCol>
                    </MDBRow>
                    </form>
                </MDBContainer>
                
                <MDBContainer style = {{padding: "1em 1em 1em 1em", borderRadius: "10px", border: "2px solid", borderColor: "black", marginTop: "0.5em" }}>
                    <h5 className = "text-center" ><strong>Paletes usados na producao</strong></h5>
                    <div className = "border p-4 mb-1 mt-1 overflow-auto" style = {{ borderRadius: "10px", border: "2px solid", borderColor: "black", maxHeight: "500px" }}>
                        <MDBTable>
                            <MDBTableHead>
                                <tr>
                                    <th>ID Palete</th>
                                    <th>Lote</th>
                                    <th>Peso</th>
                                </tr>
                            </MDBTableHead>
                            <MDBTableBody>
                                {this.state.tabela}
                            </MDBTableBody>
                        </MDBTable>
                    </div>

                </MDBContainer>
            </div>   
        );

    }  
}