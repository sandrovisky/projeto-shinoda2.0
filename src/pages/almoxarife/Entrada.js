import React, { Component } from 'react';
import { MDBDataTable, MDBBtn, MDBIcon, MDBInput, MDBRow, MDBCol } from 'mdbreact';
import { Link } from 'react-router-dom'

import api from '../../services/api'

export default class TabelaEntrada extends Component{

    state = {
        data: {
            columns: [{
                label: 'id',
                field: 'id',
                sort: 'asc',
              },
              {
                label: 'Data de Entrada',
                field: 'entrada',
                sort: 'asc',
              },
              {
                label: 'Fornecedor',
                field: 'supplier',
                sort: 'asc',
              },
              {
                label: 'NF',
                field: 'nf',
                sort: 'asc',
              },
              {
                label: 'Status',
                field: 'status',
                sort: 'asc',
              }
              ,
              {
                label: 'Ações',
                field: 'action',
                sort: 'asc',
              }
            ],
            data: []
        },
        dataInputs: {
        },
        checkbox: false
    }

    gerarDados = async (e) => {

        const response =  await api.get('/moves');

        let rows = []

        //manipulando os dados que preencherão a tabela
        response.data.map(dados => {   
            if (!this.state.checkbox){
                if (dados.status < 3){
                    rows.push({
                        id: dados.id,
                    entrada: dados.createdAt,
                    supplier: dados.supplier.razaoSocial,
                    nf: dados.nf,
                    status: dados.status === "1" ? "Em Digitação" : dados.status === "2" ? "Aguardando Coleta" : "Finalizado",
                    action: dados.status === "1" ?  
                    <Link to = {`/entrada/novo/${dados.id}`} >
                        <MDBBtn color = "warning" > Continuar </MDBBtn>
                    </Link>: 
                    dados.status === "2" ?  
                    <Link to = {`/entrada/novo/${dados.id}`} >
                        <MDBBtn color = "primary" onClick = {() => window.open(`/entrada/impressao/${dados.id}`, '_blank')} > Imprimir </MDBBtn>
                    </Link>:0
                    })
                }
            } else {                
                rows.push({
                    id: dados.id,
                    entrada: dados.createdAt,
                    supplier: dados.supplier.razaoSocial,
                    nf: dados.nf,
                    status: dados.status === "1" ? "Em Digitação" : dados.status === "2" ? "Aguardando Coleta" : "Finalizado",
                    action: dados.status === "1" ?  
                    <Link to = {`/entrada/novo/${dados.id}`} >
                        <MDBBtn color = "warning" > Continuar </MDBBtn>
                    </Link>: 
                    dados.status === "2" || dados.status === "3" ?  
                    <Link to = {`/entrada/novo/${dados.id}`} >
                        <MDBBtn color = "primary" onClick = {() => window.open(`/entrada/impressao/${dados.id}`, '_blank')} > Imprimir </MDBBtn>
                    </Link>:0
                })            
            }        
        })
        console.log("render")
        this.setState(prevState => {
            let data = Object.assign({}, prevState.data); 
            data.rows = rows;                            
            return { data };                      
        })   
    }
    
    //fazendo uma requisição para API e manipulando os dados para serem preenchidos na tabela
    async componentDidMount() {

        this.gerarDados()
         
    }

    handleChange = (event) => {        
        if(this.state.checkbox){
            this.setState({ checkbox: false})
        } else {
            this.setState({ checkbox: true})
        }
        this.gerarDados(this.state.checkbox)
    }
    
    render(){
        
        return (
        <div style = {{padding: "0em 2em 2em 2em", borderRadius: "10px", border: "2px solid", borderColor: "black", margin: "5em 1em 0 1em"}}>
            
            <MDBRow>
                <MDBCol>
                    <Link to = "/entrada/novo/0" >
                    <MDBBtn color = "primary" >
                        
                        <><MDBIcon icon="plus" size = "1x" /> Novo</>
                    </MDBBtn> 
                    </Link>
                </MDBCol>

                <MDBCol>
                    <div className="mt-3 custom-control custom-checkbox">
                        <input onClick = {this.handleChange} type="checkbox" value = {this.state.checkbox} className="custom-control-input" id="defaultUnchecked" />
                        <label className="custom-control-label"  htmlFor ="defaultUnchecked">Exibir Finalizados{this.state.checkbox}</label>
                    </div>
                </MDBCol>
            </MDBRow>

            

            <MDBDataTable responsive
            striped
            bordered
            data={this.state.data}
            style = {{fontSize: "20px", textAlign: "right"}}
            />

            
        </div>
                     
        )
    }
}

