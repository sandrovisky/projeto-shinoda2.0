import React, { Component } from 'react'
import { MDBRow, MDBCol } from 'mdbreact'
import axios from 'axios'

var Barcode = require('react-barcode');

class PrintThisComponent extends Component {

    state = {
        tabela: []
    }

    async componentDidMount () {
        const cadastros = axios.create({
            baseURL: 'http://localhost:3333/move-itens-volumes/'
        });      

        const response1 =  await cadastros.get(`${this.props.match.params.idMove}`);
        //manipulando os dados que preencherão a tabela
        let tableData = []
        response1.data.map(dados => tableData.push(
            <div style = {{width: "10cm", height: "5cm", borderStyle: "solid", borderWidth: "1px", paddingLeft: "0.5cm"}}>
                <MDBRow className="text-center">
                    <MDBCol >
                    <strong>Produto:</strong> - {dados.moveitens.product.codigo} {dados.moveitens.product.nome}
                    </MDBCol>
                </MDBRow>

                <MDBRow>
                    <MDBCol>
                        <strong>Lote:</strong> {dados.lote.lote}
                    </MDBCol>
                    <MDBCol>
                    <strong>Validade:</strong> {dados.lote.dataValidade}
                    </MDBCol>
                </MDBRow>

                <MDBRow>
                    <MDBCol>
                        <strong>Palete:</strong> {dados.id} - {"ENT"+dados.id}
                    </MDBCol>
                    <MDBCol>
                        <strong>Peso:</strong> {dados.quantidadeTotal}
                    </MDBCol>
                </MDBRow>
                <MDBRow  >
                    <MDBCol >
                        <div style = {{textAlign: 'center'}}>
                        <Barcode value = {`ENT${dados.id}`} width = "3" height = "70" />
                        </div>                        
                    </MDBCol>
                </MDBRow>
            </div>            
        ))
                   
        this.setState({tabela: tableData})
        window.print()            
    }

  render() {   
    return (
      <div id = "teste">
          {this.state.tabela}
      </div>
    )
  }
}

export default PrintThisComponent