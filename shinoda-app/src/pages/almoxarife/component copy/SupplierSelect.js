import React, { Component } from 'react';

import axios from 'axios'

export default class TabelaEntrada extends Component{   
    
    state = {

    }
    //fazendo uma requisição para API e manipulando os dados para serem preenchidos na tabela
    async componentDidMount() {

        //obtendo os dados da rota
        const cadastros = axios.create({
            baseURL: 'http://localhost:3333/suppliers/'
        }); 

        const response =  await cadastros.get(``);

        //criando os options
        this.setState({option: response.data.map(data => <option key = {data.id} value = {data.id}>{data.nomeFantasia}</option>)})
    }
    
    handleChange = (event) => {
        this.setState({idSupplier: event.target.value});
        this.props.getIdSupplier(event.target.value)
    }

    render(){
        
        return (
            <div>
                <select value = {this.props.idSupplier === 0 ? "" : this.props.idSupplier} onChange = {this.handleChange} className="browser-default custom-select" >
                    <option value = "">Selecione  Fornecedor</option>
                    {this.state.option}
                </select>
            </div>                     
        )
    }
}