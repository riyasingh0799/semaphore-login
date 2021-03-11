import React, { Component } from "react";

import {
  Identity,
  genIdentity,
  genIdentityCommitment,
  genCircuit,
  serialiseIdentity,
  genWitness,
  genExternalNullifier,
  genProof,
  genPublicSignals,
  genBroadcastSignalParams,
} from "libsemaphore";

import swal from "sweetalert";

class App extends Component {
  state = {
    leaves: [],
    semaphoreContract: null,
    scContract: null
  };

  constructor(props) {
    super(props);
    this.state = {
      web3: this.props.web3,
      account: this.props.account,
      scContract: this.props.scContract,
      semaphoreContract: this.props.semaphoreContract,
      list: []

    };
  }

  componentDidMount = async () => {
    console.warn = () => { };
    const totalPendingRegistrationRequests = await this.state.scContract.methods.totalPendingRegistrationRequests().call({from: this.props.accounts[0]});

    var list = []
    for(let i=0; i<totalPendingRegistrationRequests; i++) {
      const request = await this.state.scContract.methods.pendingRegistrationRequests(i).call({from: this.props.accounts[0]});

      const listItem = <li key={i}>{request}</li>
      list.push(listItem)
    }
    this.setState({totalPendingRegistrationRequests, list})
  
}

approve = async() => {
  try {
    const tx = await this.state.scContract.methods.approveAllRegistrationRequests().send({from: this.props.accounts[0]})
    swal({
      title: "Approved all registration requests!",
      icon: "success",
    });
    this.componentDidMount()

  }catch(e) {
    console.log(e)
  }
}

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {

    return (
      <div className="App">
        <br />
        <div className="sections">
          <div className="columns">
            <div className="column is-12-mobile is-8-desktop is-offset-2-desktop">
              <div className="box" style={{maxHeight: "500px", overflow: "scroll"}}>
                <h1 className="title">Pending Approvals</h1>
                <ul>
                  {this.state.list}
                </ul>
              </div>
              <br />
              <div class="field ">
                  <div class="control">
                    <button
                      class="button is-primary"
                      onClick={this.approve.bind(this)}
                    >
                      Approve All
                    </button>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
