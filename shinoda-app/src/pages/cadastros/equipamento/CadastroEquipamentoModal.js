import {Component} from 'react'
import axios from 'axios'

import { MDBInput, MDBBtn, MDBModal, MDBModalHeader, MDBModalBody, MDBIcon } from "mdbreact";



export default class Modal extends Component {

    constructor(){
        super()
        this.state = {
            tipo: '',
            tag: '',
            nome: '',
            capacidade: ''
        }
    }
    
    //Função responsavel por abertura e fechamento do modal
    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    };
    
    //Função que salva no state o tipo inserido no modal de cadastro de novo equipamento
    handleChangeTipo = (e) => {
        this.setState({tipo: e.target.value});
    }

    ///Função que salva no state a tag inserido no modal de cadastro de novo equipamento
    handleChangeTag = (e) => {
        this.setState({tag: e.target.value});
    }

    //Função que salva no state o nome inserido no modal de cadastro de novo equipamento
    handleChangeNome = (e) => {
        this.setState({nome: e.target.value});
    }

    //Função que salva no state a capacidade inserido no modal de cadastro de novo equipamento
    handleChangeCapacidade = (e) => {
        this.setState({capacidade: e.target.value});
    }
 
    //Função que vai cadastrar um novo equipamento no banco de dados
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
            await axios.post('http://localhost:3333/equipment', {
                tipo: this.state.tipo,
                tag: this.state.tag,
                nome: this.state.nome,
                capacidade: this.state.capacidade
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
                    Cadastrar Equipamento
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
                        
                        <>   Cadastro de Equipamento</>
                    </MDBModalHeader>

                    <MDBModalBody>
                        <MDBInput label="Tipo" onChange = {this.handleChangeTipo} />
                        <MDBInput label="Tag"  onChange = {this.handleChangeTag} />
                        <MDBInput label="Nome" onChange = {this.handleChangeNome}  />
                        <MDBInput label="Capacidade" onChange = {this.handleChangeCapacidade}  />
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