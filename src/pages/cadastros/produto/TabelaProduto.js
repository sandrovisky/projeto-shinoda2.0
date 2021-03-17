import React, { Component } from 'react';
import { MDBDataTable, MDBBtn, MDBIcon, MDBPopoverHeader, MDBPopoverBody, MDBPopover, MDBModal, MDBModalBody, MDBInput, MDBModalHeader, MDBTable, MDBTableHead, MDBTableBody } from 'mdbreact';

import api from '../../../services/api'

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
        escolhaSelect: 0,
    }

    //Função que salva o nome inserida no select do vinculo produto fornecedor
    handleChangeEscolhaSelect = (e) => {
        this.setState({escolhaSelect: e.target.value})
    }

    //Função que salva o nome inserida no modal de edição do produto
    handleChangeNome = (e) => {
        this.setState(prevState => {
            let dataInputs = Object.assign({}, prevState.dataInputs); 
            dataInputs.nome = e.target.value                            
            return { dataInputs };                      
        })
    }

    //Função que salva o codigo inserida no modal de edição do produto
    handleChangeCodigo = (e) => {
        this.setState(prevState => {
            let dataInputs = Object.assign({}, prevState.dataInputs); 
            dataInputs.codigo = e.target.value                            
            return { dataInputs };                      
        })
    }

    //Função que salva q medida inserida no modal de edição do produto    
    handleChangeMedida = (e) => {
        this.setState(prevState => {
            let dataInputs = Object.assign({}, prevState.dataInputs); 
            dataInputs.medida = e.target.value                            
            return { dataInputs };                      
        })
    }

    //Função que deleta o produto no banco de dados
    deletar = async (id) => {

        await api.delete('/products/:',{ //rota na api
            data : {id: id}
        })
        window.location.reload()
    }

    //Função que vai atualizar o produto cadastrado no banco de dados
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
        //------------------------------------------
        } else {
            await api.put('/products/:',{ //rota da atualização
                id: this.state.dataInputs.id, 
                codigo: this.state.dataInputs.codigo, 
                nome: this.state.dataInputs.nome, 
                medida: this.state.dataInputs.medida,          
            })
            window.location.reload()
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
                    codigo: dados.codigo,
                    nome: dados.nome,
                    medida: dados.medida,
                }
            }
        })
        this.setState({dataInputs: data})
        console.log(this.state.dataInputs)
    }

    vincular = async (id) => {
        this.setState({tabela: []})     

        const response1 =  await api.get(`/suppliers-products/products/${id}`);
        //manipulando os dados que preencherão a tabela
        let tableData = []
        if (response1 !== null){
            response1.data.map(dados => tableData.push(
                <tr key = {dados.id}>                    
                    <td>{dados.supplier.nomeFantasia}</td>
                    <td>
                        <MDBBtn color = "danger" onClick={() => this.desvincular(dados.id)} >
                            <MDBIcon icon="times" size = "1x" />
                        </MDBBtn>
                    </td>
                </tr>
            ))
            this.setState({tabela: tableData})
        }        
        this.setState({ id: id });
        this.toggle2()
    }
    
    desvincular = async (id) => {
        await api.delete('/suppliers-products',{
            data : {id: id}
        })
        .then((response) => {
            console.log("Desvinculado com sucesso")
            alert("Desvinculado com sucesso")
        })
        this.toggle2()
    }

    //função de abertura e fechamento do modal
    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    };

    //função de abertura e fechamento do modal de vincular produto a forncedor
    toggle2 = async (id) => {
        this.setState({ modal2: !this.state.modal2 });
        
    };

    //função que vincula fornecedor ao produto no banco de dados
    vinculaProdutoFornecedor = async (id) => {
        await api.post('/suppliers-products', {
            idSupplier: this.state.escolhaSelect,
            idProduct: this.state.id
        })
        .then(async function () {
            alert('Vinculado com sucesso');
        })
        .catch(function (error) {
            if (error.response) {
              alert("ERRO: \n" +error.response.data.message);
              console.log(error.response);
              console.log(error.response);
            }})
        window.location.reload();
    }
    
    //fazendo uma requisição para API e manipulando os dados para serem preenchidos na tabela
    async componentDidMount() {


        //obtendo os dados dos produtos
        const products =  await api.get('/products')

        let rows = []

        //manipulando os dados que preencherão a tabela
        products.data.map(dados => rows.push({
            id: dados.id,
            codigo: dados.codigo,
            nome: dados.nome,
            medida: dados.medida,
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

                {/* botao que abre modal onde sera selecionado o fornecedor para o produto */}
                <MDBBtn color = "primary" onClick={(e) => this.vincular(dados.id)}>
                    <MDBIcon icon="edit" size = "1x" />
                </MDBBtn>
            </div>
        }))

        this.setState(prevState => {
            let data = Object.assign({}, prevState.data); 
            data.rows = rows;                            
            return { data };                   
        })

        //obtendo os dados dos fornecedores da rota
        const fornecedores =  await api.get('/suppliers');

        //manipulando os dados que preencherão o select
        this.setState({option: fornecedores.data.map(data => <option key = {data.id} value = {data.id}>{data.nomeFantasia}</option>)})
    }
    
    render(){
        
        return (
            <div >

                {/* Tabela dos cadastros de produtos */}
                <MDBDataTable responsive
                striped
                bordered
                data={this.state.data}
                style = {{fontSize: "20px", textAlign: "right"}}
                />

                {/* modal de novo cadastro */}
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
                
                {/* modal de vinculo de produto a fornecedor */}
                <MDBModal
                    isOpen={this.state.modal2}
                    toggle={this.toggle2}
                    size="md"
                    cascading
                >
                    <MDBModalHeader
                        toggle={this.toggle2}
                        titleClass="d-inline title"
                        className="text-center black darken-3 white-text"
                    >
                        <MDBIcon icon="dolly" />
                        <> Vincular fornecedor</>
                    </MDBModalHeader>

                    <MDBModalBody>

                        {/* select que seleciona qual fornecedor sera vinculado ao produto */}
                        <select onChange = {this.handleChangeEscolhaSelect} className="browser-default custom-select">
                            <option value = {0} ></option>
                            {this.state.option}
                        </select>

                        <h2 style = {{ textAlign: 'center' }}>Ao produto {this.state.nome} </h2>
                        <div className="text-center mt-1-half">

                            <MDBBtn
                                color="info"
                                className="mb-2"
                                onClick={this.vinculaProdutoFornecedor}
                            >
                                Salvar
                                <MDBIcon icon="plus" className="ml-1" />
                            </MDBBtn>
                        </div>
                        <MDBTable>
                        <MDBTableHead>
                            <tr>                                
                                <th>Fornecedor</th>
                                <th></th>
                            </tr>
                        </MDBTableHead>
                        <MDBTableBody>                            
                            {this.state.tabela}
                        </MDBTableBody>
                    </MDBTable>
                    </MDBModalBody>

                </MDBModal>
            </div>
            
          );
    }
  
}