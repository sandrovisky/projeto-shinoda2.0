import React, { Component, } from 'react';
import ReactDOM from 'react-dom';
import { MDBDataTable, MDBBtn, MDBIcon, MDBInput, MDBModal, MDBModalHeader, MDBModalBody, MDBRow, MDBCol, MDBPopoverHeader, MDBPopover, MDBPopoverBody } from 'mdbreact';

import axios from 'axios'

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
        const cadastros = axios.create({
            baseURL: 'http://localhost:3333/move-itens-volumes-tables'
        }); 

        const response =  await cadastros.get('');
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
                (parseInt(dados.analysis.status) === 1 ? <MDBBtn onClick={() =>this.toggleNovaAnalise(dados.codigo)} color="warning">Lançar</MDBBtn> : <MDBBtn onClick={() => window.open(`/laboratorio/finalizado/${dados.id}`, '_self')} color="success">Finalizado</MDBBtn> )        
        }))

        this.setState(prevState => {
            let data = Object.assign({}, prevState.data); 
            data.rows = rows;                            
            return { data };                      
        })    
    }

    handleSubmit = async (event) => {
        event.preventDefault()

        this.setState({ x: this.state.x+1 })
        console.log(this.state.x)
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
                            <MDBInput label="INSIRA O CODIGO DO LOTE" required size = "lg" onChange = {this.handleChangeCodigoLote} />
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



