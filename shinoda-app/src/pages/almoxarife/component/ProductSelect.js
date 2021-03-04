import React, { Component } from 'react';

import api from '../../../services/api'

export default class ProductSelect extends Component{   
    
    state = {

    }
    
    //fazendo uma requisição para API e manipulando os dados para serem preenchidos na tabela
    async componentDidUpdate(prevProps) {


        if(this.props.idSupplier !== prevProps.idSupplier) {

            //obtendo os dados da rota
            const response =  await api.get('/suppliers-products/products');

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
    async componentDidMount(){

        //obtendo os dados da rota
        const response =  await api.get('/suppliers-products/products');
        
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
    
    handleChange = (event) => {
        this.setState({idProduct: event.target.value});
        this.props.getIdProduct(event.target.value)
    }

    render(){
        
        return (
            <div>
                    <select required value = {this.props.idProduct === 0 ? "" : this.props.idProduct} onChange = {this.handleChange} className="browser-default custom-select" >
                        <option value = ""></option>
                        {this.state.option}
                    </select>
            </div>                     
        )
    }
}