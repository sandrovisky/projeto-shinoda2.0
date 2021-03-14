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
        let rows = []
        await api.get(`/lotes`)
        .then(async response => {await response.data.map(dados => {
            rows.push({
            id: dados.analysis === null ? "" : dados.analysis.id,
            nf: dados.moveitens.move.nf,
            dataEntrada: dados.moveitens.move.createdAt,
            fornecedor: dados.moveitens.move.supplier.nomeFantasia,
            lote: dados.lote,
            quantidadePaletes: dados.moveitensvolume.length,
            action:  (dados.analysis === null) ? 
                (<MDBBtn onClick={() =>window.open(`/laboratorio/coletar/${dados.id}`, '_self')} color="primary">Coletar</MDBBtn>) : 
                (dados.analysis.status === "1" ? <MDBBtn onClick={() =>window.open(`/laboratorio/coletar/${dados.id}`, '_self')} color="warning">Lançar</MDBBtn> : 
                <MDBBtn onClick={() => window.open(`/laboratorio/finalizado/${dados.id}`, '_self')} color="success">Finalizado</MDBBtn> )        
            })
        })}) 
        this.setState(prevState => {
            let data = Object.assign({}, prevState.data); 
            data.rows = rows;                            
            return { data };                      
        })
    }

    handleSubmit = async (event) => {
        event.preventDefault()
        
        await api.get(`move-itens-volumes/codigo/${this.state.codigo}`)
        .then(async response => {
            console.log(response.data)
            if ( !response.data ) {
                alert("Codigo não encontrado")
            }else if ( response.data.lote.analysis ) {
                if ( !response.data.lote.analysis.status === "2" ) {
                    alert("Essa entrada ja foi finalizada")   
                } else if ( response.data.lote.analysis.status === "1" ) {
                    await api.put('/move-itens-volumes',{
                        leitura: true,       
                        id: response.data.id 
                    })  
                    window.open(`/laboratorio/coletar/${response.data.idLoteitens}`, '_self')                
                }       
            } else {
                await api.post('/analyses', {
                    idProduct: response.data.moveitens.idProduct,
                    idLoteitens: response.data.lote.id,
                    status: 1,
                    createdBy: 1,
                    })
                    .then(async (responseAnalysis) => {
                        await api.put('/move-itens-volumes',{
                            leitura: true,       
                            id: response.data.id 
                        })  
                        window.open(`/laboratorio/coletar/${response.data.idLoteitens}`, '_self')                          
                })
            }
        })
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
                            <MDBInput onFocus = {(e) => e.target.autocomplete = "off"} label="INSIRA O CODIGO" required size = "lg" onChange = {this.handleChange} name = "codigo" />
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



