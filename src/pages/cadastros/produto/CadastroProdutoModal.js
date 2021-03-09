import {Component} from 'react'

import api from '../../../services/api'

import { MDBInput, MDBBtn, MDBModal, MDBModalHeader, MDBModalBody, MDBIcon } from "mdbreact";



export default class Modal extends Component {

    constructor(){
        super()
        this.state = {
            nome: '',
            codigo: '',
            medida: '',
            modal: false
        }
    }
    
    //Função responsavel por abertura e fechamento do modal
    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    };
    
    //Função que salva no state o nome inserido no modal de cadastro de novo produto
    handleChangeNome = (e) => {
        this.setState({nome: e.target.value});
    }

    //Função que salva no state o codigo inserido no modal de cadastro de novo produto
    handleChangeCodigo = (e) => {
        this.setState({codigo: e.target.value});
    }

    //Função que salva no state a medida inserido no modal de cadastro de novo produto
    handleChangeMedida = (e) => {
        this.setState({medida: e.target.value});
    }
 
    //Função que vai cadastrar um novo produto no banco de dados
    cadastrar = async () => {

        //verifica se os campos estao preenchidos
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
        //--------------------------------------------   
        } else {
            api.post('/products', {
                codigo: this.state.codigo,
                nome: this.state.nome,
                medida: this.state.medida
            })
            .then(async (response) => {
                alert(response.data.nome + ' cadastrado com sucesso');

                window.location.reload();
            })
            .catch(async (error) => {
                if (error.response) {
                  alert("ERRO: "+error.response.status+ "\n" +error.response.data.message);
                  console.log(error.response);

                  window.location.reload();
                }
            })            
        }
    }

    render () {
        
      return (
        <div  >
            
            <div >                

                <MDBBtn onClick={this.toggle} className="mx-auto">
                    Cadastrar Produto
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
                        
                        <>   Cadastro de Produto</>
                    </MDBModalHeader>

                    <MDBModalBody>
                        <MDBInput label="Codigo"  onChange = {this.handleChangeCodigo} />
                        <MDBInput label="Nome" onChange = {this.handleChangeNome}  />
                        <MDBInput label="Medida"  onChange = {this.handleChangeMedida} />
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