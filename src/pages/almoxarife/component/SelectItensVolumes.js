import React, { Component } from 'react';

import api from '../../../services/api'

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
        const response2 =  await api.get(`/move-itens/${this.props.idMove}`);
        this.setState({option: response2.data.map(data => <option key = {data.id} value = {data.id}>{data.product.nome}</option>)})
    }
    
    handleChange = async (e) => {
        await this.setState({[e.target.name]: e.target.value})
        this.props.getIdMoveitens(e.target.value)

        console.log(this.state.select)

        if(this.state.select !== ""){ 
    
            await api.get(`/move-itens/move/${this.state.select}`)
            .then((response =>{
                console.log(response.data)
                console.log(response.data[0].product.nome)
                this.props.getIdProduct(response.data[0].product.id)
            }))
        }
        

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