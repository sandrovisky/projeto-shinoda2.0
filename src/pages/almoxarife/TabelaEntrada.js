import React, { Component } from 'react';
import { MDBDataTable, MDBBtn, MDBIcon, MDBPopoverHeader, MDBPopoverBody, MDBPopover } from 'mdbreact';


import axios from 'axios'

export default class TabelaEntrada extends Component{

    state = {
        data: {
            columns: [{
                label: 'id',
                field: 'id',
                sort: 'asc',
              },
              {
                label: 'Tipo',
                field: 'tipo',
                sort: 'asc',
              },
              {
                label: 'Tag',
                field: 'tag',
                sort: 'asc',
              },
              {
                label: 'Nome',
                field: 'nome',
                sort: 'asc',
              },
              {
                label: 'Capacidade',
                field: 'capacidade',
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
        const cadastros = axios.create({
            baseURL: 'http://localhost:3333/suppliers-products'
        }); 

        const response =  await cadastros.get('');

        let rows = []

        //manipulando os dados que preencherão a tabela
        response.data.map(dados => rows.push({
            id: dados.id,
            tipo: dados.tipo,
            tag: dados.tag,
            nome: dados.nome,
            capacidade: dados.capacidade,
            action: <div>

                {/* popover de exclusão do cadastro */}
                <MDBPopover
                    placement="left"
                    popover
                    clickable 
                    id="popper1"
                >
                    
                    {/* botao de exclusão */}
                    <MDBBtn color = "danger" >
                        <MDBIcon icon="trash-alt" size = "1x" />
                    </MDBBtn>
                    <div>
                        <MDBPopoverHeader><strong>Confirmar exclusão</strong></MDBPopoverHeader>
                        <MDBPopoverBody>

                            {/* botao de confirmação da exclusão */}
                            <MDBBtn color = "success" onClick={(e) => this.deletar(dados.id)}>
                                <MDBIcon icon="check" size = "1x" />
                            </MDBBtn>

                            {/* botao de cancelar a exclusão */}
                            <MDBBtn color = "danger" onClick={() => window.location.reload()} >
                                <MDBIcon icon="times" size = "1x" />
                            </MDBBtn>

                        </MDBPopoverBody>
                    </div>
                </MDBPopover>
                
                {/* botao que abre modal preenchido com os dados do cadastro */}
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
            style = {{fontSize: "20px", textAlign: "center"}}
            />
            
        </div>
                     
        )
    }
}