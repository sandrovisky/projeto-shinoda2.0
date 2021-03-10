import {Component} from 'react'

import logo from '../../assets/images/shinoda.jpg'

export default class Home extends Component {

    state = {
        texto: ''
    }

    onHandleChangetexto = (e) => {
        this.setState({texto: e.target.value})
    }
    
    render () {
        return (
            <div style = {{padding: "0em 1em 1em 1em", borderRadius: "10px", border: "2px solid", borderColor: "black", margin: "5em 1em 0 1em", textAlign: "center"}}>
                <img style = {{width: "80%", height: "auto"}} src="https://www.santaritaalarmes.com.br/img/clientes/original-a09cffce7fa6b36ba3a4bc6be033b9dc.jpg" alt="shinoda" />
             </div>
            
      )
    }
  }