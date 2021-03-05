import React, { Component } from 'react';
import { MDBDataTable, MDBBtn, MDBIcon, MDBModal, MDBModalBody, MDBInput, MDBModalHeader } from 'mdbreact';

import api from '../../../services/api'


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

    //Função que salva a senha inserido no modal de edição do usuario
    handleChangeSenha = (e) => {
        this.setState(prevState => {
            let dataInputs = Object.assign({}, prevState.dataInputs); 
            dataInputs.senha = e.target.value                            
            return { dataInputs };                      
        })
    }

    //Função que salva o nome inserido no modal de edição do usuario
    handleChangeSenha2 = (e) => {
        this.setState(prevState => {
            let dataInputs = Object.assign({}, prevState.dataInputs); 
            dataInputs.senha2 = e.target.value                            
            return { dataInputs };                      
        })
    }

    //Função que vai atualizar o usuario cadastrado no banco de dados
    atualizar = async (id) => {

        //verifica se os campos estao preenchidos
        let aviso = 'Favor verificar os campos:'
        let obj = Object.entries(this.state.dataInputs)        
        for(let i = 0; i < obj.length;i++){
            for(let k = 0; k < 2; k++){
                if(obj[i][k] === ''){
                    aviso += '\n' + obj[i][0]
                }
            }
        }
        if (aviso !== 'Favor verificar os campos:'){
            alert(aviso)
        //--------------------------------------------   
        } else if (this.state.dataInputs.senha !== this.state.dataInputs.senha2 || this.state.dataInputs.senha2 === ""){
            alert("As senhas não coincidem")
        }else {
            await api.put(`/users/${this.state.dataInputs.id}`,{ 
                senha: this.state.dataInputs.senha,          
            })
            .then(async function () {
                alert('Senha atualizada com sucesso');
            })
            .catch(function (error) {
                if (error.response) {
                  alert("ERRO: "+error.response.status+ "\n" +error.response.data.message);
                  console.log(error.response);
                  console.log(error.response);
                }})
            window.location.reload();
        }    
    }

    //funcao que abre o modal preenchidos com os campos de acordo com a id do cadastro
    editar = async (id) => {
        this.toggle()
        let data = []
        //MAP no state para pegar apenas o objeto com a id desejada
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

    //função de abertura e fechamento do modal
    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    };
    
    //fazendo uma requisição para API e manipulando os dados para serem preenchidos na tabela
    async componentDidMount() {

        //obtendo os dados da rota
        const response =  await api.get('/users');

        let rows = []

        //manipulando os dados que preencherão a tabela
        response.data.map(dados => rows.push({
            id: dados.id,
            usuario: dados.usuario,
            action: 
            <div>            

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
            <div >
              <MDBDataTable responsive
              striped
              bordered
              data={this.state.data}
              style = {{fontSize: "20px", textAlign: "right"}}
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
                        <MDBInput label="Usuario" value = {this.state.dataInputs.usuario} />
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