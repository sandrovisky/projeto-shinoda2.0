import React, { Component } from 'react';
import { MDBDataTable, MDBBtn } from 'mdbreact';

import axios from 'axios'


let data = {
    columns: [{
        label: 'id',
        field: 'id',
        sort: 'asc',
        width: 150
      },
      {
        label: 'Nome Fantasia',
        field: 'nomeFantasia',
        sort: 'asc',
        width: 270
      },
      {
        label: 'Razão Social',
        field: 'razaoSocial',
        sort: 'asc',
        width: 200
      },
      {
        label: 'Endereço',
        field: 'endereco',
        sort: 'asc',
        width: 100
      },
      {
        label: 'CNPJ',
        field: 'cnpj',
        sort: 'asc',
        width: 150
      },
      {
        label: 'Ações',
        field: 'action',
        sort: 'asc',
        width: 150
      }
    ],
    rows: []
}


export default class DatatablePage extends Component{

    state = {
        data: {
            columns: [{
                label: 'id',
                field: 'id',
                sort: 'asc',
                width: 150
              },
              {
                label: 'Nome Fantasia',
                field: 'nomeFantasia',
                sort: 'asc',
                width: 270
              },
              {
                label: 'Razão Social',
                field: 'razaoSocial',
                sort: 'asc',
                width: 200
              },
              {
                label: 'Endereço',
                field: 'endereco',
                sort: 'asc',
                width: 100
              },
              {
                label: 'CNPJ',
                field: 'cnpj',
                sort: 'asc',
                width: 150
              },
              {
                label: 'Ações',
                field: 'action',
                sort: 'asc',
                width: 150
              }
            ],
            rows: []
        }
    }
    
    async componentDidMount() {

        const cadastros = axios.create({
            baseURL: 'http://localhost:3333/suppliers'
        }); 

        const response =  await cadastros.get('');

        response.data.map(dados => this.state.data.rows.push({
        id: dados.id,
        nomeFantasia: dados.nomeFantasia,
        razaoSocial: dados.razaoSocial,
        endereco: dados.endereco,
        cnpj: dados.cnpj,
        action: <MDBBtn color="dark-green" size="sm">Small button</MDBBtn>
        
        }))
        console.log(this.state)
    
    }
    
    render(){
        
        return (
            <div>
              <MDBDataTable responsive
              striped
              bordered
              data={this.state.data}
            />  
            {console.log("componente")}
            </div>
            
            
          );
    }
  
}