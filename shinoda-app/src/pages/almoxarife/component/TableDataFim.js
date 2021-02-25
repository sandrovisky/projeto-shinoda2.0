import { MDBTable, MDBTableHead, MDBTableBody, MDBBtn, MDBIcon } from 'mdbreact'
import React, { Component } from 'react';

import axios from 'axios'

export default class TabelaEntradaVolumes extends Component{   
    
    state = {
    }

    //deletar da table list
    deletar = async (id) => {
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
        
    }
    componentDidMount  = async () => {
        const cadastros = axios.create({
            baseURL: 'http://localhost:3333/lotes/moveitensvolume/'
        }); 

        const response1 =  await cadastros.get(`${this.props.idMove}`);
        console.log(response1.data)
         //manipulando os dados que preencherão a tabela
         let tableData = []
         if (response1 !== null){
             response1.data.map(dados => tableData.push(
                 <tr key = {dados.id}>
                     
                     <td>{dados.moveitens.product.nome}</td>
                     <td>{dados.dataValidade}</td>
                     <td>{dados.codigo}</td>
                     <td>{dados.moveitensvolume.quantidadePaletes}</td>
                     <td>{dados.moveitensvolume.quantidadeTotal}</td>
                     <td>{parseInt(dados.moveitensvolume.quantidadePaletes) * parseInt(dados.moveitensvolume.quantidadeTotal)}</td>
                 </tr>
            ))}           
            this.setState({tabela: tableData})
    }

    render(){
        return (
            <div>
                {this.props.click}
                    <MDBTable>
                        <MDBTableHead>
                            <tr>
                                
                                <th>Produto</th>
                                <th>Validade</th>
                                <th>Lote</th>
                                <th>Paletes</th>
                                <th>Quantidade</th>
                                <th>Total</th>
                            </tr>
                        </MDBTableHead>
                        <MDBTableBody>
                            {this.state.tabela}
                        </MDBTableBody>
                    </MDBTable>
            </div>                     
        )
    }
}






