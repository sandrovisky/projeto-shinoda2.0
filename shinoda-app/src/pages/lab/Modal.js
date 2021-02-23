import {Component} from 'react'
import axios from 'axios'

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
            await axios.post('http://localhost:3333/suppliers', {
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
                

            </div>
            

            

        </div>
      )
    }
  }