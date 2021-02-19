import React, { Component } from 'react';

import axios from 'axios'

export default class TabelaEntrada extends Component{   
    
    state = {

    }

    //fazendo uma requisição para API e manipulando os dados para serem preenchidos na tabela
    async componentDidUpdate(prevProps) {


        if(this.props.idSupplier !== prevProps.idSupplier) {

            //obtendo os dados da rota
            const cadastros = axios.create({
                baseURL: 'http://localhost:3333/suppliers-products/products'
            }); 

            const response =  await cadastros.get('');
            let produtos = []

            //crias os options de acordo com a idSupplier fornecida
            response.data.map(dados => {
                if(dados.idSupplier === parseInt(this.props.idSupplier)) {                    
                    produtos.push(<option key = {dados.product.id} value = {dados.product.id}>{dados.product.nome}</option>)
                }
            })
            //criando os options
            this.setState({option: produtos})
        }
        
    }
    
    handleChange = (event) => {
        this.setState({idProduct: event.target.value});
        this.props.getIdProduct(event.target.value)
    }

    render(){
        
        return (
            <div>
                    <select onChange = {this.handleChange} className="browser-default custom-select" >
                        <option value = "">Selecione o Produto</option>
                        {this.state.option}
                    </select>
            </div>                     
        )
    }
}