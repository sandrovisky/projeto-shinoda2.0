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
              },
              {
                label: 'Usuario',
                field: 'usuario',
                sort: 'asc',
              },
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

    handleChangeUsuario = (e) => {
        this.setState(prevState => {
            let dataInputs = Object.assign({}, prevState.dataInputs); 
            dataInputs.usuario = e.target.value                            
            return { dataInputs };                      
        })
    }

    handleChangeSenha = (e) => {
        this.setState(prevState => {
            let dataInputs = Object.assign({}, prevState.dataInputs); 
            dataInputs.senha = e.target.value                            
            return { dataInputs };                      
        })
    }

    handleChangeSenha2 = (e) => {
        this.setState(prevState => {
            let dataInputs = Object.assign({}, prevState.dataInputs); 
            dataInputs.senha2 = e.target.value                            
            return { dataInputs };                      
        })
    }

    deletar = async (id) => {
        await axios.delete('http://localhost:3333/users/:',{
            data : {id: id}
        })
    window.location.reload()
    }

    atualizar = async (id) => {
        let aviso = 'Favor verificar os campos:'
        let obj = Object.entries(this.state.dataInputs)        
        for(let i = 0; i < 1;i++){
            for(let k = 0; k < 2; k++){
                if(obj[i][k] === ''){
                    aviso += '\n' + obj[i][0]
                }
            }
        }
        if (aviso !== 'Favor verificar os campos:'){
            alert(aviso)
        } else if (this.state.dataInputs.senha !== this.state.dataInputs.senha2 || this.state.dataInputs.senha2 === ""){
            alert("As senhas não coincidem")
        }else {
            await axios.put('http://localhost:3333/users/:',{
                id: this.state.dataInputs.id, 
                usuario: this.state.dataInputs.usuario, 
                senha: this.state.dataInputs.senha,          
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
                    usuario: dados.usuario,
                    senha: "",
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
            baseURL: 'http://localhost:3333/users'
        }); 

        const response =  await cadastros.get('');

        let rows = []

        response.data.map(dados => rows.push({
            id: dados.id,
            usuario: dados.usuario,
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
                    className="text-center black darken-3 text  white-text"
                >
                    
                        <>   Editar cadastro de Usuario</>
                    </MDBModalHeader>

                    <MDBModalBody>
                        <MDBInput label="Usuario" value = {this.state.dataInputs.usuario} onChange = {this.handleChangeUsuario} />
                        <MDBInput type = "password" label="Senha" value = {this.state.dataInputs.senha} onChange = {this.handleChangeSenha} />
                        <MDBInput type = "password" label="Confirme a senha" value = {this.state.dataInputs.senha2}  onChange = {this.handleChangeSenha2} />
                        
                        <div className="text-center mt-1-half">
                            <MDBBtn
                                color="info"
                                className="mb-2"
                                onClick={this.atualizar}
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