import React, { Component } from 'react';
import { MDBDataTable, MDBBtn, MDBIcon, MDBPopoverHeader, MDBPopoverBody, MDBPopover } from 'mdbreact';

import axios from 'axios'

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
            data: []
        }
    }

    deletar = (id) => {
        axios.delete('http://localhost:3333/suppliers/:',{
            data : {id: id}
        })
        window.location.reload();
    }

    cancelar = () => {
        window.location.reload();
    }

    editar = (id) => {
        alert(id)
    }
    
    async componentDidMount() {

        const cadastros = axios.create({
            baseURL: 'http://localhost:3333/suppliers'
        }); 

        const response =  await cadastros.get('');

        let rows = []

        response.data.map(dados => rows.push({
            id: dados.id,
            nomeFantasia: dados.nomeFantasia,
            razaoSocial: dados.razaoSocial,
            endereco: dados.endereco,
            cnpj: dados.cnpj,
            action: <div>
                <MDBPopover
                    placement="left"
                    popover
                    clickable 
                    id="popper1"
                >
                    <MDBBtn color = "danger" >
                        <MDBIcon icon="trash-alt" size = "1x" />
                    </MDBBtn>
                    <div>
                        <MDBPopoverHeader><strong>Confirmar exclusão</strong></MDBPopoverHeader>
                        <MDBPopoverBody>

                            <MDBBtn color = "success" onClick={(e) => this.deletar(dados.id)}>
                                <MDBIcon icon="check" size = "1x" />
                            </MDBBtn>

                            <MDBBtn color = "danger" onClick={this.cancelar} >
                                <MDBIcon icon="times" size = "1x" />
                            </MDBBtn>

                        </MDBPopoverBody>
                    </div>
                </MDBPopover>
                
                <MDBBtn color = "warning" onClick={(e) => this.editar(dados.id)}>
                    <MDBIcon icon="pencil-alt" size = "1x" />
                </MDBBtn>
            </div>
        }))

        this.setState(prevState => {
            let data = Object.assign({}, prevState.data); 
            data.rows = rows;                            
            return { data };                      
        })    
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