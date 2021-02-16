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
        },
        dataInputs: {
        },
    }

    handleChangeNomeFantasia = (e) => {
        this.setState(prevState => {
            let dataInputs = Object.assign({}, prevState.dataInputs); 
            dataInputs.nomeFantasia = e.target.value                            
            return { dataInputs };                      
        })
    }

    handleChangeRazaoSocial = (e) => {
        this.setState(prevState => {
            let dataInputs = Object.assign({}, prevState.dataInputs); 
            dataInputs.razaoSocial = e.target.value                            
            return { dataInputs };                      
        })
    }

    handleChangeEndereco = (e) => {
        this.setState(prevState => {
            let dataInputs = Object.assign({}, prevState.dataInputs); 
            dataInputs.endereco = e.target.value                            
            return { dataInputs };                      
        })
    }

    handleChangeCnpj = (e) => {
        this.setState(prevState => {
            let dataInputs = Object.assign({}, prevState.dataInputs); 
            dataInputs.cnpj = e.target.value                            
            return { dataInputs };                      
        })
    }

    deletar = async (id) => {
        const response = await axios.delete('http://localhost:3333/suppliers/:',{
            data : {id: id}
        })
    window.location.reload()
    console.log(response)
    }

    atualziar = async (id) => {
        let aviso = 'Favor verificar os campos:'
        let obj = Object.entries(this.state.dataInputs)
        console.log(obj)
        for(let i = 0; i < 5;i++){
            for(let k = 0; k < 2; k++){
                if(obj[i][k] === ''){
                    aviso += '\n' + obj[i][0]
                }
            }
        }
        if (aviso !== 'Favor verificar os campos:'){
            alert(aviso)
        } else {
            await axios.put('http://localhost:3333/suppliers/:',{
                id: this.state.dataInputs.id, 
                nomeFantasia: this.state.dataInputs.nomeFantasia, 
                razaoSocial: this.state.dataInputs.razaoSocial, 
                endereco: this.state.dataInputs.endereco, 
                cnpj: this.state.dataInputs.cnpj            
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
                    razaoSocial: dados.razaoSocial,
                    nomeFantasia: dados.nomeFantasia,
                    endereco: dados.endereco,
                    cnpj: dados.cnpj
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
              style = {{fontSize: "20px"}}
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
                    className="text-center light-blue darken-3 white-text"
                >
                    <MDBIcon icon="dolly" />
                        <>   Editar cadastro do Fornecedor</>
                    </MDBModalHeader>

                    <MDBModalBody>
                        <MDBInput label="Nome Fantasia" value = {this.state.dataInputs.nomeFantasia} onChange = {this.handleChangeNomeFantasia} />
                        <MDBInput label="Razão Social" value = {this.state.dataInputs.razaoSocial} onChange = {this.handleChangeRazaoSocial} />
                        <MDBInput label="Endereço" value = {this.state.dataInputs.endereco} onChange = {this.handleChangeEndereco}  />
                        <MDBInput label="CNPJ" value = {this.state.dataInputs.cnpj} onChange = {this.handleChangeCnpj} />
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