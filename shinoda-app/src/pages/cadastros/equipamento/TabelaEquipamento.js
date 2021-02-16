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

    //Função que salva o tipo inserida no modal de edição do equipamentos
    handleChangeTipo = (e) => {
        this.setState(prevState => {
            let dataInputs = Object.assign({}, prevState.dataInputs); 
            dataInputs.tipo = e.target.value                            
            return { dataInputs };                      
        })
    }

    //Função que salva a tag inserida no modal de edição do equipamentos
    handleChangeTag = (e) => {
        this.setState(prevState => {
            let dataInputs = Object.assign({}, prevState.dataInputs); 
            dataInputs.tag = e.target.value                            
            return { dataInputs };                      
        })
    }

    //Função que salva o nome inserida no modal de edição do equipamentos
    handleChangeNome = (e) => {
        this.setState(prevState => {
            let dataInputs = Object.assign({}, prevState.dataInputs); 
            dataInputs.nome = e.target.value                            
            return { dataInputs };                      
        })
    }

    //Função que salva a capacidade inserida no modal de edição do equipamentos
    handleChangeCapacidade = (e) => {
        this.setState(prevState => {
            let dataInputs = Object.assign({}, prevState.dataInputs); 
            dataInputs.capacidade = e.target.value                            
            return { dataInputs };                      
        })
    }

    //Função que deleta o equipamentos no banco de dados
    deletar = async (id) => {
        await axios.delete('http://localhost:3333/equipment/:',{
            data : {id: id}
        })
        .then(async function () {
            alert('Deletado com sucesso');
        })
        .catch(function (error) {
            if (error.response) {
              alert("ERRO: "+error.response.status+ "\n" +error.response.data.message);
              console.log(error.response);
              console.log(error.response);
            }})
        window.location.reload();
    }

    //Função que vai atualizar o equipamentos cadastrado no banco de dados
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
        } else {
            await axios.put('http://localhost:3333/equipment/:',{
                id: this.state.dataInputs.id, 
                tipo: this.state.dataInputs.tipo, 
                tag: this.state.dataInputs.tag,  
                nome: this.state.dataInputs.nome, 
                capacidade: this.state.dataInputs.capacidade,        
            })
            .then(async function () {
                alert('Vinculado com sucesso');
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
                    tipo: dados.tipo,
                    id: dados.id,
                    tag: dados.tag,
                    nome: dados.nome,
                    capacidade: dados.capacidade,
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
        const cadastros = axios.create({
            baseURL: 'http://localhost:3333/equipment'
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
                    
                        <>   Editar cadastro de Equipamento</>
                    </MDBModalHeader>

                    <MDBModalBody>
                        <MDBInput label="Tipo" value = {this.state.dataInputs.tipo} onChange = {this.handleChangeTipo} />
                        <MDBInput label="Tag" value = {this.state.dataInputs.tag} onChange = {this.handleChangeTag} />
                        <MDBInput label="Nome" value = {this.state.dataInputs.nome}  onChange = {this.handleChangeNome} />
                        <MDBInput label="Capacidade" value = {this.state.dataInputs.capacidade}  onChange = {this.handleChangeCapacidade} />
                        
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