import React, { Component } from 'react';
import MediContext from './MediContext';

export default class MediProvider extends Component {
    constructor(props){
        super(props);
        this.state = {
            userinfo: null
        }
    }
    render() {
        return (
            <MediContext.Provider value={{
                userinfo: this.state.userinfo,
                setUserInfo: data => {
                    this.setState({userinfo: data})
                }
            }}>
                {this.props.children}
            </MediContext.Provider>
        )
    }
}
