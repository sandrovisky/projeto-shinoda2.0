import {Component} from 'react'

import api from '../../../services/api'

import { MDBInput, MDBBtn, MDBModal, MDBModalHeader, MDBModalBody, MDBIcon } from "mdbreact";



export default class Modal extends Component {

    constructor(){
        super()
        this.state = {
            nomeFantasia: '',
            razaoSocial: '',
            endereco: '',
            cnpj: '',
            modal: false
        }
    }
    
    //Função responsavel por abertura e fechamento do modal
    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    };
    
    //Função que salva no state o nome inserido no modal de cadastro de novo fornecedor
    handleChangeNomeFantasia = (e) => {
        this.setState({nomeFantasia: e.target.value});
    }

    //Função que salva no state o CNPJ inserido no modal de cadastro de novo fornecedor
    handleChangeCnpj = (e) => {
        this.setState({cnpj: e.target.value});
    }

    //Função que salva no state a razao social inserido no modal de cadastro de novo fornecedor
    handleChangeRazaoSocial = (e) => {
        this.setState({razaoSocial: e.target.value});
    }

    //Função que salva no state o endereco inserido no modal de cadastro de novo fornecedor
    handleChangeEndereco = (e) => {
        this.setState({endereco: e.target.value});
    }
 
    //Função que vai cadastrar um novo fornecedor no banco de dados
    cadastrar = async () => {

        //verifica se os campos estao preenchidos
        let aviso = 'Favor verificar os campos:'
        let obj = Object.entries(this.state)
        console.log(obj)
        for(let i = 0; i < 4;i++){
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
            await api.post('/suppliers', {
                nomeFantasia: this.state.nomeFantasia,
                razaoSocial: this.state.razaoSocial,
                endereco: this.state.endereco,
                cnpj: this.state.cnpj
            })
            .then(async function () {
                alert('Cadastrado com sucesso');
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

    render () {
        
      return (
        <div  >
            
            <div >                

                <MDBBtn onClick={this.toggle} className="mx-auto">
                    Cadastrar Fornecedor
                </MDBBtn>
                <MDBModal
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                    size="md"
                    cascading
                >
                    <MDBModalHeader
                        toggle={this.toggle}
                        titleClass="d-inline title"
                        className="text-center black darken-3 white-text"
                    >
                        <MDBIcon icon="dolly" />
                        <>   Cadastro de Fornecedor</>
                    </MDBModalHeader>

                    <MDBModalBody>
                        <MDBInput label="Nome Fantasia" onChange = {this.handleChangeNomeFantasia} />
                        <MDBInput label="Razão Social"  onChange = {this.handleChangeRazaoSocial} />
                        <MDBInput label="Endereço" onChange = {this.handleChangeEndereco}  />
                        <MDBInput label="CNPJ"  onChange = {this.handleChangeCnpj} />
                        <div className="text-center mt-1-half">
                            <MDBBtn
                                color="info"
                                className="mb-2"
                                onClick={this.cadastrar}
                            >
                                Cadastrar
                            <MDBIcon icon="plus" className="ml-1" />
                            </MDBBtn>
                        </div>
          </MDBModalBody>
        </MDBModal>

            </div>
            

            

        </div>
      )
    }
  }