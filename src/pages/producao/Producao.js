import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { MDBDataTable, MDBBtn, MDBIcon } from 'mdbreact';

import api from '../../services/api'

export default class DatatablePage extends Component{

    state = {
        data: {
            columns: [
                {
                    label: 'Id Produção',
                    field: 'id',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: 'Produto',
                    field: 'produto',
                    sort: 'asc',
                    width: 270
                },
                {
                    label: 'Status',
                    field: 'status',
                    sort: 'asc',
                    width: 200
                },
                {
                    label: 'Ação',
                    field: 'action',
                    sort: 'asc',
                    width: 100
                },
            ]
        },
    }   

    async componentDidMount () {
        //obtendo os dados dos produtos
        const products =  await api.get('/producoes');

        let rows = []

        //manipulando os dados que preencherão a tabela
        products.data.map(dados => rows.push({
            id: dados.id,
            produto: "produto",
            status: dados.status,
            action: 1
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
                <MDBDataTable responsive
                striped
                bordered
                data={this.state.data}
                style = {{fontSize: "20px", textAlign: "right"}}
                />
                <Link to = "/producao/novo/0" >
                    <MDBBtn color = "primary" >                        
                        <MDBIcon icon="plus" size = "1x" /> Novo
                    </MDBBtn> 
                </Link>
            </div>   
        );

    }  
}