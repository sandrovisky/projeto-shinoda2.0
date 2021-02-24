import { MDBTable, MDBTableHead, MDBTableBody, MDBBtn, MDBIcon } from 'mdbreact'
import React, { Component } from 'react';

import axios from 'axios'

export default class TabelaEntrada extends Component{   
    
    state = {
    }

    //deletar da table list
    deletarProduto = async (id) => {
        await axios.delete('http://localhost:3333/move-itens/:',{
            data : {id: id}
        })
        .then(async function () {
            console.log("ok")
        })
        .catch(function (error) {
            
            alert("ERRO: "+error.response.status+ "\n" +error.response.data.message);
            console.log(error.response);
        })
        
        this.setState({delete: this.state.delete+1})
        this.props.getDelete(this.state.delete)
    }


    //fazendo uma requisição para API e manipulando os dados para serem preenchidos na tabela
    async componentDidUpdate(prevProps) {
        

        if(this.props.click !== prevProps.click) {

            const cadastros = axios.create({
                baseURL: 'http://localhost:3333/move-itens/'
            }); 

            const response =  await cadastros.get(`${this.props.idMove}`);
        
            //manipulando os dados que preencherão a tabela
            let tableData = []
            if (response !== null){
                response.data.map(dados => tableData.push(
                    <tr key = {dados.id}>
                        <td>{dados.product.id}</td>
                        <td>{dados.product.nome}</td>
                        <td>
                            <MDBBtn size="sm" color = "danger" onClick={(e) => this.deletar(dados.id)} getDelete = {this.getDelete} >
                                <MDBIcon icon="trash-alt"  size = "1x" />
                            </MDBBtn>
                        </td>
                    </tr>
                ))
                
                this.setState({tabela: tableData})
            }
        }
        
    }

    render(){
        return (
            <div>
                    
            </div>                     
        )
    }
}






