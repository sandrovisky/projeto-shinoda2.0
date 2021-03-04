import React, { Component } from 'react';
import { MDBDataTable, MDBBtn, MDBIcon, MDBPopoverHeader, MDBPopoverBody, MDBPopover } from 'mdbreact';
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
    }
    
    //fazendo uma requisição para API e manipulando os dados para serem preenchidos na tabela
    async componentDidMount() {

        //obtendo os dados da rota
        const response =  await api.get('/moves');

        let rows = []

        //manipulando os dados que preencherão a tabela
        response.data.map(dados => rows.push({
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
        }))

        this.setState(prevState => {
            let data = Object.assign({}, prevState.data); 
            data.rows = rows;                            
            return { data };                      
        })    
    }
    
    render(){
        
        return (
        <div style = {{padding: "0em 2em 2em 2em", borderRadius: "10px", border: "2px solid", borderColor: "black", margin: "5em 1em 0 1em"}}>
            
            <Link to = "/entrada/novo/0" >
                <MDBBtn color = "primary" >
                    
                    <><MDBIcon icon="plus" size = "1x" /> Novo</>
                </MDBBtn> 
            </Link>
            <MDBDataTable responsive
            striped
            bordered
            data={this.state.data}
            style = {{fontSize: "20px", textAlign: "center"}}
            />

            
        </div>
                     
        )
    }
}

