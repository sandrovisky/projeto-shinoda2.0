import React, { Component } from 'react';
import { MDBDataTable, MDBBtn, MDBIcon, MDBPopoverHeader, MDBPopoverBody, MDBPopover, MDBModal, MDBModalBody, MDBInput, MDBModalHeader } from 'mdbreact';

import axios from 'axios'

export default class DatatablePage extends Component{

    state = {
        data: {
            columns: [{
                label: 'id',
                field: 'id',
                sort: 'asc',
                width: 150,

              },
              {
                label: 'Codigo',
                field: 'codigo',
                sort: 'asc',
                width: 270
              },
              {
                label: 'Nome',
                field: 'nome',
                sort: 'asc',
                width: 200
              },
              {
                label: 'Medida',
                field: 'medida',
                sort: 'asc',
                width: 100
              },
              {
                label: 'Ações',
                field: 'action',
                sort: 'asc',
                width: 150
              }
            ],
            data: []
        },
        dataInputs: {
        },
    }

    handleChangeNome = (e) => {
        this.setState(prevState => {
            let dataInputs = Object.assign({}, prevState.dataInputs); 
            dataInputs.nome = e.target.value                            
            return { dataInputs };                      
        })
    }

    handleChangeCodigo = (e) => {
        this.setState(prevState => {
            let dataInputs = Object.assign({}, prevState.dataInputs); 
            dataInputs.codigo = e.target.value                            
            return { dataInputs };                      
        })
    }

    handleChangeMedida = (e) => {
        this.setState(prevState => {
            let dataInputs = Object.assign({}, prevState.dataInputs); 
            dataInputs.medida = e.target.value                            
            return { dataInputs };                      
        })
    }

    deletar = async (id) => {
        await axios.delete('http://localhost:3333/products/:',{
            data : {id: id}
        })
    window.location.reload()
    }

    atualziar = async (id) => {
        let aviso = 'Favor verificar os campos:'
        let obj = Object.entries(this.state.dataInputs)
        for(let i = 0; i < 4;i++){
            for(let k = 0; k < 2; k++){
                if(obj[i][k] === ''){
                    aviso += '\n' + obj[i][0]
                }
            }
        }
        if (aviso !== 'Favor verificar os campos:'){
            alert(aviso)
        } else {
            await axios.put('http://localhost:3333/products/:',{
                id: this.state.dataInputs.id, 
                codigo: this.state.dataInputs.codigo, 
                nome: this.state.dataInputs.nome, 
                medida: this.state.dataInputs.medida,          
            })
            window.location.reload()
        }
    
    }

    editar = async (id) => {
        this.toggle()
        let data = []
        await this.state.data.rows.map(dados => {
            if(dados.id === id){
                data = {
                    id: dados.id,
                    codigo: dados.codigo,
                    nome: dados.nome,
                    medida: dados.medida,
                }
            }
        })
        this.setState({dataInputs: data})
        console.log(this.state.dataInputs)
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    };
    
    async componentDidMount() {

        const cadastros = axios.create({
            baseURL: 'http://localhost:3333/products'
        }); 

        const response =  await cadastros.get('');

        let rows = []

        response.data.map(dados => rows.push({
            id: dados.id,
            codigo: dados.codigo,
            nome: dados.nome,
            medida: dados.medida,
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

                            <MDBBtn color = "danger" onClick={() => window.location.reload()} >
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
            <div >
              <MDBDataTable responsive
              striped
              bordered
              data={this.state.data}
              style = {{fontSize: "20px", textAlign: "center"}}
            />
            <MDBModal
                isOpen={this.state.modal}
                toggle={this.editar}
                size="md"
                cascading
            >
                <MDBModalHeader
                    toggle={this.editar}
                    titleClass="d-inline title"
                    className="text-center black darken-3 white-text"
                >
                    
                        <>   Editar cadastro de Produto</>
                    </MDBModalHeader>

                    <MDBModalBody>
                        <MDBInput label="Codigo" value = {this.state.dataInputs.codigo} onChange = {this.handleChangeCodigo} />
                        <MDBInput label="Nome" value = {this.state.dataInputs.nome} onChange = {this.handleChangeNome} />
                        <MDBInput label="Medida" value = {this.state.dataInputs.medida} onChange = {this.handleChangeMedida}  />
                        
                        <div className="text-center mt-1-half">
                            <MDBBtn
                                color="info"
                                className="mb-2"
                                onClick={this.atualziar}
                            >
                                Atualizar
                            </MDBBtn>
                            <MDBBtn
                                color="danger"
                                className="mb-2"
                                onClick={() => window.location.reload()}
                            >
                                Cancelar
                            </MDBBtn>
                        </div>
                    </MDBModalBody>
            </MDBModal>
            </div>
            
            
          );
    }
  
}