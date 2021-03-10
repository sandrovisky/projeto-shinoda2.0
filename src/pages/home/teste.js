import {Component} from 'react'

export default class Teste extends Component {
    
    constructor(props) {
        super(props)
        this.idleTimer = null
        this.handleOnAction = this.handleOnAction.bind(this)
        this.handleOnActive = this.handleOnActive.bind(this)
        this.handleOnIdle = this.handleOnIdle.bind(this)
      }

      handleOnAction (event) {
        console.log('user did something', event)
      }
    
      handleOnActive (event) {
        console.log('user is active', event)
        console.log('time remaining', this.idleTimer.getRemainingTime())
      }
    
      handleOnIdle (event) {
        console.log('user is idle', event)
        console.log('last active', this.idleTimer.getLastActiveTime())
      }
    

    getLogged = (childData) => {
        this.setState({logged: childData})
    }
    render () {

        return (
            <h4>  ola </h4>
      )
    }
  }