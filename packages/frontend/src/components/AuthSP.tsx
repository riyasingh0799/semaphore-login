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

import {
    initStorage,
    storeId,
    retrieveId,
    hasId,
  } from '../utils/storage'

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
      enList: []
    };
  }

  componentDidMount = async () => {
    console.warn = () => { };
    const identity = retrieveId()
    const serialisedIdentity = serialiseIdentity(identity)
    console.log(this.state.identity)
    const identityCommitment = genIdentityCommitment(identity))
    this.setState({ identity, serialisedIdentity, identityCommitment });

    const totalEns =  await this.state.scContract.methods.creatorIDtoTotalEns().call({ from: this.props.accounts[0] });
    var enList = []
    for(let i=0;i<totalEns; i++ ) {
        const en =  await this.state.scContract.methods.creatorIDtoEns(i).call({ from: this.props.accounts[0] });
        const listItem = <li key={i}>{en.enString}</li>
        enList.push(listItem)
    }
    this.setState({enList});
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  sendChallenge=async()=>{

  }

  render() {

    return (
      <div className="App">
        <br />
        <div className="sections">
          <div className="columns">
            <div className="column is-12-mobile is-8-desktop is-offset-2-desktop">
              <div className="box" style={{ maxHeight: "500px", overflow: "scroll" }}>
                <h1 className="title">Pending SignUp Requests</h1>
                <ul>
                  {this.state.enList}
                </ul>
              </div>
              <br />
              <div class="field ">
                <div class="control">
                  <button
                    class="button is-primary"
                    // onClick = {this.sendChallenge.bind(this)}
                  >
                    Send Challenge
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
