import React, { Component } from 'react';

import api from '../../../services/api'

export default class SupplierSelect extends Component{   
    
    state = {

    }
    //fazendo uma requisição para API e manipulando os dados para serem preenchidos na tabela
    async componentDidMount() {

        //obtendo os dados da rota
        const response =  await api.get(`/suppliers/`);

        //criando os options
        this.setState({option: response.data.map(data => <option key = {data.id} value = {data.id}>{data.nomeFantasia}</option>)})
    }
    
    handleChange = async (event) => {
        this.setState({idSupplier: event.target.value});
        this.props.getIdSupplier(event.target.value)
    }

    render(){
        
        return (
            <div>
                <select required value = {this.props.idSupplier === 0 ? "" : this.props.idSupplier} onChange = {this.handleChange} className="browser-default custom-select" >
                    <option value = ""></option>
                    {this.state.option}
                </select>
            </div>                     
        )
    }
}