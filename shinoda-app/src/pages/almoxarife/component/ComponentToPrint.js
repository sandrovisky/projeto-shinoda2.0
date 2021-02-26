import React from 'react';
import axios from 'axios'

export class ComponentToPrint extends React.PureComponent {

    state = {
        tabela: "arroz"
    }
    componentDidMount  = async () => {               

        const cadastros = axios.create({
            baseURL: 'http://localhost:3333/move-itens-volumes-tables/'
        }); 
     

        const response1 =  await cadastros.get(`${this.props.idMove}`);
        console.log(response1.data)
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