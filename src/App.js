import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css'; 
import 'mdbreact/dist/css/mdb.css';

import React from 'react';
import IdleTimer from 'react-idle-timer'

import Navbar from './pages/nav/Navbar'
import Routes from './pages/routes/index'

class App extends React.Component {

    constructor(props) {
        super(props)
        this.idleTimer = null
        this.handleOnIdle = this.handleOnIdle.bind(this)
    }    

    handleOnIdle (event) {
        if (localStorage.getItem("auth") === "true") {
            localStorage.setItem("auth", "false")
            alert("Sessão expirada")
            window.location.reload()
        }        
    }

    getLogged = (childData) => {
        this.setState({logged: childData})
    }

    render(){
        
        return(
            <div>

        <IdleTimer
          ref={ref => { this.idleTimer = ref }}
          timeout={1000 * 60 * 10}
          onIdle={this.handleOnIdle}
          debounce={2000}
        />
                <Navbar />

                <Routes />
            </div>
        )
    }
}


export default App;
