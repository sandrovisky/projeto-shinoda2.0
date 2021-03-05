import React, { Component } from 'react';
import { MDBDataTable, MDBBtn, MDBIcon, MDBPopoverHeader, MDBPopoverBody, MDBPopover, MDBModal, MDBModalBody, MDBInput, MDBModalHeader } from 'mdbreact';

import api from '../../../services/api'

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
                width: 150,
              }
            ],
            data: []
        },
        dataInputs: {
        },
    }

    //Função que salva o nome inserido no modal de edição do fornecedor
    handleChangeNomeFantasia = (e) => {
        this.setState(prevState => {
            let dataInputs = Object.assign({}, prevState.dataInputs); 
            dataInputs.nomeFantasia = e.target.value                            
            return { dataInputs };                      
        })
    }

    //Função que salva a razao social inserido no modal de edição do fornecedor
    handleChangeRazaoSocial = (e) => {
        this.setState(prevState => {
            let dataInputs = Object.assign({}, prevState.dataInputs); 
            dataInputs.razaoSocial = e.target.value                            
            return { dataInputs };                      
        })
    }

    //Função que salva o nome inserido no modal de edição do fornecedor
    handleChangeEndereco = (e) => {
        this.setState(prevState => {
            let dataInputs = Object.assign({}, prevState.dataInputs); 
            dataInputs.endereco = e.target.value                            
            return { dataInputs };                      
        })
    }

    //Função que salva o CNPJ inserido no modal de edição do fornecedor
    handleChangeCnpj = (e) => {
        this.setState(prevState => {
            let dataInputs = Object.assign({}, prevState.dataInputs); 
            dataInputs.cnpj = e.target.value                            
            return { dataInputs };                      
        })
    }

    //Função que deleta o fornecedor no banco de dados
    deletar = async (id) => {
        const response = await api.delete('/suppliers/:',{
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
    console.log(response)
    }

    //Função que vai atualizar o fornecedor cadastrado no banco de dados
    atualziar = async (id) => {

        //verifica se os campos estao preenchidos
        let aviso = 'Favor verificar os campos:'
        let obj = Object.entries(this.state.dataInputs)
        console.log(obj)
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
            await api.put('/suppliers/:',{
                id: this.state.dataInputs.id, 
                nomeFantasia: this.state.dataInputs.nomeFantasia, 
                razaoSocial: this.state.dataInputs.razaoSocial, 
                endereco: this.state.dataInputs.endereco, 
                cnpj: this.state.dataInputs.cnpj            
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

    //função de abertura e fechamento do modal
    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    };
    
    //fazendo uma requisição para API e manipulando os dados para serem preenchidos na tabela
    async componentDidMount() {

        //obtendo os dados da rota
        const response =  await api.get('/suppliers');

        let rows = []

        //manipulando os dados que preencherão a tabela
        response.data.map(dados => rows.push({
            id: dados.id,
            nomeFantasia: dados.nomeFantasia,
            razaoSocial: dados.razaoSocial,
            endereco: dados.endereco,
            cnpj: dados.cnpj,
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