import {Component} from 'react'

import api from '../../../services/api'

import { MDBInput, MDBBtn, MDBModal, MDBModalHeader, MDBModalBody, MDBIcon } from "mdbreact";



export default class Modal extends Component {

    constructor(){
        super()
        this.state = {
            usuario: '',
            senha: '',
            senha2: '',
            modal: false
        }
    }
    
    //Função responsavel por abertura e fechamento do modal
    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    };
    
    //Função que salva no state a senha inserido no modal de cadastro de novo usuario
    handleChangeSenha = (e) => {
        this.setState({senha: e.target.value});
    }

    //Função que salva no state a senha2, usada para confirmar se senhas coincidem, inserido no modal de cadastro de novo usuario
    handleChangeSenha2 = (e) => {
        this.setState({senha2: e.target.value});
    }

    //Função que salva no state o usuario inserido no modal de cadastro de novo usuario
    handleChangeUsuario = (e) => {
        this.setState({usuario: e.target.value});
    }
 
    //Função que vai cadastrar um novo usuario no banco de dados
    cadastrar = async () => {

        //constante que sera usada para verificar se ja existe um mesmo usuario cadastrado
        const response = await api.get('http://localhost:3333/users/:',{
            params : {usuario: this.state.usuario}

        })
        console.log(response.data)
        
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
        } else if (response.data !== null) {
            alert("Usuario ja cadastrado")
        } else if (this.state.senha !== this.state.senha2){
            alert("As senhas não coincidem")
        }else {
            await api.post('http://localhost:3333/users', {
                usuario: this.state.usuario,
                senha: this.state.senha
            })
            .then(async function () {
                alert('Cadastrado com sucesso');
            })
            .catch(function (error) {
                if (error.response) {
                    alert("ERRO \n" + error.response.data.message);
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
                    Cadastrar Usuario
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
                        
                        <>   Cadastro de Usuario</>
                    </MDBModalHeader>

                    <MDBModalBody>
                        <MDBInput label="Usuario" onChange = {this.handleChangeUsuario} />
                        <MDBInput type = "password" label="Senha"  onChange = {this.handleChangeSenha} />
                        <MDBInput type = "password" label="Confirme a senha" onChange = {this.handleChangeSenha2}  />
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