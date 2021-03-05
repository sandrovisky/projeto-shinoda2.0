import React, { Component, } from 'react';
import { MDBDataTable, MDBBtn, MDBIcon, MDBInput, MDBModal, MDBModalHeader, MDBModalBody } from 'mdbreact';

import api from '../../services/api'

export default class TabelaEntrada extends Component{

    state = {
        data: {
            columns: [{
                label: 'ID Análise',
                field: 'id',
                sort: 'asc',
              },
              {
                label: 'Nota Fiscal',
                field: 'nf',
                sort: 'asc',
              },
              {
                label: 'Data de Entrada',
                field: 'dataEntrada',
                sort: 'asc',
              },
              {
                label: 'Fornecedor',
                field: 'fornecedor',
                sort: 'asc',
              },
              
              {
                label: 'Lote',
                field: 'lote',
                sort: 'asc',
              },
              {
                label: 'Quantidade de Paletes',
                field: 'quantidadePaletes',
                sort: 'asc',
              },
              {
                label: 'Ações',
                field: 'action',
                sort: 'asc',
                
              }
            ],
            data: [],
        },
    }

    //Função responsavel por abertura e fechamento do modal de coleta
    toggleNovaAnalise = () => {
        this.setState({
            modalNovaAnalise: !this.state.modalNovaAnalise
        });
    };

    //fazendo uma requisição para API e manipulando os dados para serem preenchidos na tabela
    async componentDidMount() {

        //obtendo os dados da rota
        const response =  await api.get('/move-itens-volumes-tables');
        let rows = []

        //manipulando os dados que preencherão a tabela
        response.data.map(dados => rows.push({
            id: dados.idAnalysis === null ? "" : dados.idAnalysis,
            nf: dados.move.nf,
            dataEntrada: dados.move.createdAt,
            fornecedor: dados.move.supplier.nomeFantasia,
            lote: dados.loteitens.lote,
            quantidadePaletes: dados.quantidadePaletes,
            action:  (dados.idAnalysis === null) ? (<MDBBtn onClick={() =>window.open(`/laboratorio/coletar/${dados.id}`, '_self')} color="primary">Coletar</MDBBtn>) : 
                (parseInt(dados.analysis.status) === 1 ? <MDBBtn onClick={() =>window.open(`/laboratorio/coletar/${dados.id}`, '_self')} color="warning">Lançar</MDBBtn> : <MDBBtn onClick={() => window.open(`/laboratorio/finalizado/${dados.id}`, '_self')} color="success">Finalizado</MDBBtn> )        
        }))

        this.setState(prevState => {
            let data = Object.assign({}, prevState.data); 
            data.rows = rows;                            
            return { data };                      
        })    
    }

    handleSubmit = async (event) => {
        event.preventDefault()
        const response =  await api.get(`/lotes/table/${this.state.codigo}`)
        if(response.data !== null){
            
            await api.put('http://localhost:3333/move-itens-volumes',{
                leitura: true,       
                id: response.data.moveitensvolume.id 
            })   
    
            await api.get(`/move-itens-volumes-tables/table/${response.data.id}`)
            .then(async response1 => {
                this.setState({
                    idLoteitens: response1.data.idLoteitens,
                    idProduct: response1.data.loteitens.moveitens.idProduct,
                })
            })

            await api.post('/analyses', {
            idProduct: this.state.idProduct,
            idLoteitens: this.state.idLoteitens,
            status: 1,
            createdBy: 1,
            })
            .then((response1) => {
                this.setState({idAnalysis: response1.data.id})
            })
            .catch((err) => console.log(err))

            await api.put(`/move-itens-volumes-tables/${response.data.id}`,{
                idAnalysis: this.state.idAnalysis,
            })
            .then((response1) => {
            })
            .catch(function (error) {
                if (error.response) {
                    alert("ERRO: "+error.response.status+ "\n" +error.response.data.message);
                    console.log(error.response);
                }
            })

            window.open(`/laboratorio/coletar/${response.data.id}`, '_self')
        } else {
            alert("Codigo inválido")
        }
    }

    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value})
    }
    
    render(){
        
        return (
            <div style = {{padding: "0em 2em 2em 2em", borderRadius: "10px", border: "2px solid", borderColor: "black", margin: "5em 1em 0 1em"}}>

                <h1 style = {{textAlign: 'center'}} >Laboratório</h1><br/><br/>
                <MDBBtn onClick = {this.toggleNovaAnalise} color = "primary" >
                    
                    <><MDBIcon icon="plus" size = "1x" /> Nova Análise</> 
                </MDBBtn>
                <MDBDataTable responsive
                striped
                bordered
                data={this.state.data}
                style = {{fontSize: "20px", textAlign: "center"}}
                />
                
                {/* MODAL NOVA ANALISE */}
                <MDBModal
                    isOpen={this.state.modalNovaAnalise}
                    toggle={this.toggleNovaAnalise}
                    size="md"
                    cascading
                >
                    <MDBModalHeader
                        toggle={this.toggleNovaAnalise}
                        titleClass="d-inline title"
                        className="text-center black darken-3 white-text"
                    >
                        <>   Nova Análise</>
                    </MDBModalHeader>

                    <MDBModalBody>
                        <form action="" method="post" onSubmit = {this.handleSubmit} >
                            <MDBInput label="INSIRA O CODIGO" required size = "lg" onChange = {this.handleChange} name = "codigo" />
                            <div className="text-center mt-1-half">
                                <MDBBtn
                                    type = "submit"
                                    color="info"
                                    className="mb-2"
                                >
                                    Adicionar
                                <MDBIcon icon="plus" className="ml-1" />
                                </MDBBtn>
                            </div> 
                            <div id = "modal">

                            </div>
                        </form>
                        
                    </MDBModalBody>
                </MDBModal>

            </div>                     
        )
    }
}



