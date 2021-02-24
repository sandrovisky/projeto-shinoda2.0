import React, { Component } from 'react';

import axios from 'axios'

export default class SelectItensVolumes extends Component{   
    
    state = {

    }
    
    async shouldComponentUpdate(prevProps){
        if(prevProps.click !== this.props.click){
            return true
        }
    }
    
    async componentDidUpdate(prevProps){
        if(prevProps.click !== this.props.click){
            return true
        }
    }
    async componentDidMount(){
        //obtendo os dados da rota
        const cadastros2 = axios.create({
        baseURL: 'http://localhost:3333/move-itens/'
            }); 

        const response2 =  await cadastros2.get(`${this.props.idMove}`);
        this.setState({option: response2.data.map(data => <option key = {data.id} value = {data.id}>{data.product.nome}</option>)})
        console.log(response2.data)
    }
    
    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
        this.props.getIdMoveitens(e.target.value)
    }

    render(){
        
        return (
            <div>   
                <select name = "select" required onChange = {this.handleChange} className="browser-default custom-select" >
                    <option value = ""></option>
                    {this.state.option}
                </select>
            </div>                     
        )
    }
}