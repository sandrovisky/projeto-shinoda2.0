import {Component} from 'react'

import logo from '../../assets/images/shinoda.jpg'

import Teste from './teste'

export default class Home extends Component {

    state = {
        texto: ''
    }

    onHandleChangetexto = (e) => {
        this.setState({texto: e.target.value})
    }
    
    render () {

        return (
            <div style = {{position: "relative", marginLeft: "20px", marginTop: "50px" }}>
            {logo}

                <h4>{this.state.texto}</h4>
                <input onChange = {this.onHandleChangetexto} type="text" />
            
                <Teste texto = {this.state.texto} />
             </div>
            
      )
    }
  }