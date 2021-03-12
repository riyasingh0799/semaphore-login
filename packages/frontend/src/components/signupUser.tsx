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
  unSerialiseIdentity,
  setupTree,
} from "libsemaphore";

import Crypto from "crypto";

import swal from "sweetalert";

import genAuth from '../utils/semaphore'

import {
  initStorage,
  storeId,
  retrieveId,
  hasId,
} from '../utils/storage'

class App extends Component {
  state = {
    email: "",
    web3: null,
    account: null,
    scContract: null,
    enExists: true,
    en: "", 
    identity: {}
  };

  constructor(props) {
    super(props);
  }

  componentDidMount = async () => {
    console.warn = () => {};
    console.log(this.state.scContract);
    const identity = retrieveId()
    const serialisedIdentity = serialiseIdentity(identity)
    this.setState({ identity, serialisedIdentity });
    console.log(this.state.identity)
    console.log("identity commitment: "+genIdentityCommitment(identity))
  };

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  fetchWithoutCache = async (url) => {
    return await fetch(url, { cache: "no-store" });
  }; 

  broadcastSignal = async() => {
    if(this.state.identity)
    {  
      const res = await genAuth(this.state.en, this.props.web3.utils.asciiToHex("hey"), this.state.identity, this.props.scContract, this.props.accounts[0])
      console.log(res)}
  }

  handleSignUpBtnClicked = async () => {
    console.log(this.state.en);
    if (this.state.en.length > 0) {
        const res = await this.broadcastSignal();
        swal({
          title: "Successfully signed up!",
          icon: "success",
        });
        this.setState({ phone: "" });
    }
  };

  render() {
    return (
      <div className="App">
        <br />
        <div className="sections">
          <div className="columns">
            <div className="column is-12-mobile is-8-desktop is-offset-2-desktop">
              <div className="box">
                <div className="field">
                  <label className="label">Your ID</label>
                  <textarea
                    className="textarea is-small"
                    value={this.state.serialisedIdentity}
                  ></textarea>
                </div>

                <br />
                <div className="field">
                  <label className="label">External Nullifier</label>
                  <div className="control">
                    <input
                      className="input is-small"
                      type="text"
                      name="en"
                      onChange={this.handleChange.bind(this)}
                    />
                  </div>
                </div>
                <br />
                <div className="field ">
                  <div className="control">
                    <button
                      className="button is-primary"
                      onClick={this.handleSignUpBtnClicked.bind(this)}
                    >
                      Sign Up
                    </button>
                  </div>
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
