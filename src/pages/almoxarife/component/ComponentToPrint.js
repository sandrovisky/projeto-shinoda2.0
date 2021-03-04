import React from 'react';

import api from '../../../services/api'

export class ComponentToPrint extends React.PureComponent {

    state = {
        tabela: "arroz"
    }
    componentDidMount  = async () => {               

        const response1 =  await api.get(`/move-itens-volumes-tables/${this.props.idMove}`)
        
        //manipulando os dados que preencherão a tabela
        let tableData = []
        if (response1 !== null){
            response1.data.map(dados => tableData.push(
                <tr key = {dados.id}>                    
                    <td>{dados.produto}</td>
                    <td>{dados.validade}</td>
                    <td>{dados.codigoLote}</td>
                    <td>{dados.quantidadePaletes}</td>
                    <td>{dados.quantidadeTotal}</td>
                    <td>{parseInt(dados.quantidadePaletes) * parseInt(dados.quantidadeTotal)}</td>
                </tr>
            ))
        }           
        this.setState({tabela: tableData})
    }

    render() {
      return (
          <div>
              {this.state.tabela}
          </div>
        
      );
    }
  }