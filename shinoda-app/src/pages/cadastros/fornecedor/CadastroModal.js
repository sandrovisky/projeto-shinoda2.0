import {Component} from 'react'
import axios from 'axios'

import { MDBInput, MDBBtn, MDBModal, MDBModalHeader, MDBModalBody, MDBIcon } from "mdbreact";



export default class CadastroModal extends Component {

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
    
    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    };
    
    logValue = value => {
        console.log(value);
    };

    handleChangeNomeFantasia = (e) => {
        this.setState({nomeFantasia: e.target.value});
    }

    handleChangeCnpj = (e) => {
        this.setState({cnpj: e.target.value});
    }

    handleChangeRazaoSocial = (e) => {
        this.setState({razaoSocial: e.target.value});
    }

    handleChangeEndereco = (e) => {
        this.setState({endereco: e.target.value});
    }
 
    cadastrar = () => {
        let aviso = 'Favor verificar os campos:'
        let obj = Object.entries(this.state)
        console.log(obj)
        for(let i = 0; i < 3;i++){
            for(let k = 0; k < 2; k++){
                if(obj[i][k] === ''){
                    aviso += '\n' + obj[i][0]
                }
            }
        }
        if (aviso !== 'Favor verificar os campos:'){
            alert(aviso)
        } else {
            axios.post('http://localhost:3333/suppliers', {
                nomeFantasia: this.state.nomeFantasia,
                razaoSocial: this.state.razaoSocial,
                endereco: this.state.endereco,
                cnpj: this.state.cnpj
              })
              .then(async function () {
                alert('CADASTRADO COM SUCESSO');
                this.setState({
                    modal: !this.state.modal
                });
              })
              .catch(async function (error) {
                alert('ALGO DE ERRADO NAO ESTA CERTO \n' + error);
              });
              window.location.reload();
        }
    }

    render () {
        
      return (
        <div  >
            
            <div >                

                <MDBBtn onClick={this.toggle} className="mx-auto">
                    Novo Fornecedor
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
                        className="text-center light-blue darken-3 white-text"
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