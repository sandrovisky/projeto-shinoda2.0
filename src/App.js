import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css'; 
import 'mdbreact/dist/css/mdb.css';

import React from 'react';

import Navbar from './pages/nav/Navbar'
import Routes from './pages/root/routes'
import Login from './pages/home/Login'

class App extends React.Component {

    state = {
        logged: localStorage.getItem('log')
    }

    getLogged = (childData) => {
        this.setState({logged: childData})
    }
    render(){
        
        if(this.state.logged === "false") {
            return (
                <div>
                        <Navbar />
                     <Login getLogged = {this.getLogged} />)

                </div>
            )
        }
        
        return(
            <div>
                <Navbar />

                <Routes />
            </div>
        )
    }
}


export default App;
