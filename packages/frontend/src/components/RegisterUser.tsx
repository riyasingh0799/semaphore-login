import React, { Component } from "react";
import Crypto from "crypto";

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
  genPubKey,
  unSerialiseIdentity,
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
    identity: "",
    phone: "",
    serializedIdentity: ""
  };

  componentDidMount = async () => {
    console.warn = () => { };
    var identity;
    if (hasId()) {
      identity = retrieveId()
    } else {
      identity = genIdentity()
      storeId(identity)
    }
    console.log(identity)
    const serializedIdentity = serialiseIdentity(identity);
    const identityCommitment = genIdentityCommitment(identity);
    console.log(identityCommitment);
    this.setState({ identity, serializedIdentity, identityCommitment });
  };

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleRegisterBtnClicked = async () => {
    if (this.state.phone.length > 0) {
      try {
        console.log("commitment: " + this.state.identityCommitment.toString())
        const index = await this.props.scContract.methods
          .requestRegistration(this.state.identityCommitment.toString())
          .send({ from: this.props.accounts[0] });
        console.log(index);
        swal({
          title: "Successfully Registered!",
          icon: "success",
        });

        console.log("ID commitment: " + genIdentityCommitment(unSerialiseIdentity(this.state.serializedIdentity)))
      } catch (e) {
        console.log(e)
        swal({
          title: "Error registering!",
          icon: "error",
        });
      }
    }
  };

  handleCreateNewID() {
    const identity = genIdentity();
    storeId(identity);
    const serializedIdentity = serialiseIdentity(identity);
    const identityCommitment = genIdentityCommitment(identity);
    this.setState({ identity, serializedIdentity, identityCommitment });
  }
  handleGenKeypair() {
    const privkey = Crypto.randomBytes(32);
    const pubkey = genPubKey(privkey);
    const keypair = { pubkey: pubkey, privkey: privkey };
    this.setState({ keypair, pubkey });
    console.log(keypair);
    const keypairString = JSON.stringify(
      keypair,
      (key, value) => (typeof value === "bigint" ? value.toString() : value) // return everything else unchanged
    );
    localStorage.setItem("keypair", keypairString);
  }
  render() {
    return (
      <div className="App">

        <body>
          <br />
          <div className="sections" style={{ maxWidth: "1000px", margin: "auto" }}>
            <div className="columns">
              <div className="column is-12-mobile is-8-desktop is-offset-2-desktop">
                <div className="box">
                  <div className="field">
                    <label className="label">Your ID</label>
                    <textarea
                      className="textarea is-small"
                      value={this.state.serializedIdentity}
                    ></textarea>
                  </div>

                  <br />
                  <div className="field ">
                    <div className="control">
                      <button
                        className="button is-primary"
                        onClick={this.handleCreateNewID.bind(this)}
                      >
                        Create New
                    </button>
                    </div>
                  </div>
                  <br />
                  <div className="field">
                    <label className="label">Phone No. (for KYC)</label>
                    <div className="control">
                      <input
                        className="input"
                        type="text"
                        name="phone"
                        onChange={this.handleChange.bind(this)}
                      />
                    </div>
                  </div>
                  <br />
                  <div className="field ">
                    <div className="control">
                      <button
                        className="button is-primary"
                        onClick={this.handleRegisterBtnClicked.bind(this)}
                      >
                        Register
                    </button>
                    </div>
                  </div>
                  <br />
                </div>
              </div>
            </div>
          </div>
        </body>
      </div>
    );
  }
}

export default App;
