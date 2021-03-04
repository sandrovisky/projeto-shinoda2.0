import { MDBTable, MDBTableHead, MDBTableBody } from 'mdbreact'
import React, { Component } from 'react';

import api from '../../../services/api'

export default class TabelaEntradaVolumes extends Component{   
    
    state = {
    }

    //deletar da table list
    deletar = async (id) => {
        await api.delete('/move-itens/:',{
            data : {id: id}
        })
        .then(async(response) => {
            console.log("Deletado com sucesso")
        })
        .catch(function (error) {            
            alert("ERRO: "+error.response.status+ "\n" +error.response.data.message);
            console.log(error.response);
        })
        
    }
    componentDidMount  = async () => {               

        const response1 =  await api.get(`/move-itens-volumes-tables/${this.props.idMove}`);

        //manipulando os dados que preencherão a tabela
        let tableData = []
        if (response1.data !== null){
            response1.data.map(dados => tableData.push(
                <tr key = {dados.id}>                    
                    <td>{dados.produto}</td>
                    <td>{dados.validade}</td>
                    <td>{dados.quantidadePaletes}</td>
                    <td>{dados.quantidadeTotal}</td>
                    <td>{parseInt(dados.quantidadePaletes) * parseInt(dados.quantidadeTotal)}</td>
                </tr>
            ))
        }           
        this.setState({tabela: tableData})
    }

    render(){
        return (
            <div>
                {this.props.idMove}
                    <MDBTable>
                        <MDBTableHead>
                            <tr>                                
                                <th>Produto</th>
                                <th>Validade</th>
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






