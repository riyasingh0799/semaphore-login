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
} from "libsemaphore";

import Crypto from "crypto";

import swal from "sweetalert";

class App extends Component {
  state = {
    email: "",
    web3: null,
    account: null,
    scContract: null,
    enExists: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      web3: this.props.web3,
      account: this.props.account,
      scContract: this.props.scContract,
      en: ""
    };
  }

  componentDidMount = async () => {
    console.warn = () => {};
    console.log(this.state.scContract);
    const identityString = localStorage.getItem("identity");
    const identityCommitment = localStorage.getItem("identityCommitment");
    const identity = unSerialiseIdentity(identityString);
    console.log("id commitment " + genIdentityCommitment(identity))

    this.setState({ identity, identityString, identityCommitment });
    const keypair = localStorage.getItem("keypair");
    console.log(keypair);
    const pubkey = JSON.parse(keypair).pubkey.toString();
    console.log(pubkey);
    this.setState({ pubkey });
  };

  fetchWithoutCache = async (url) => {
    return await fetch(url, { cache: "no-store" });
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  broadcastSignal = async () => {

    try {
      if (!("TextEncoder" in window))
        alert("Sorry, this browser does not support TextEncoder...");

      var pubkeyBytes = new TextEncoder(); // always utf-8
      console.log("pubkeyBytes  "+pubkeyBytes.encode(pubkeyBytes));
      console.log(this.state.en)
      this.setState({ status: "Downloading leaves" });
      const leaves = await this.state.scContract.methods
        .getIDCommitments()
        .call({ from: this.state.account });
      console.log("Leaves:", leaves);
      this.setState({ status: "Downloading circuit" });
      const circuitUrl = "http://localhost:5000/circuit.json";
      console.log("Downloading circuit from ", circuitUrl);

      const cirDef = await (await this.fetchWithoutCache(circuitUrl)).json();
      const circuit = genCircuit(cirDef);
      console.log(this.state.identity)
      const provingKeyUrl = "http://localhost:5000/proving_key.bin";
      this.setState({ status: "Downloading proving key" });

      console.log("Downloading proving key from ", provingKeyUrl);
      this.setState({ status: "Generating witness" });

      const provingKey = new Uint8Array(
        await (await fetch(provingKeyUrl)).arrayBuffer()
      )

      const result = await genWitness(
        "hey",
        circuit,
        this.state.identity,
        leaves,
        20,
        this.state.web3.utils.toBN("0x00")
      );

      // const witness = result.witness;

      // this.setState({ status: "Generating proof" });

      // console.log("Generating proof");
      // const proof = await genProof(witness, provingKey);
      // this.setState({ status: "Broadcasting signal" });

      // const publicSignals = genPublicSignals(witness, circuit);
      // const params = genBroadcastSignalParams(result, proof, publicSignals);

      // const tx = await this.state.scContract.methods.broadcastSignal(
      //   pubkeyBytes,
      //   params.proof,
      //   params.root,
      //   params.nullifiersHash,
      //   this.state.en.toString()
      // );
      // console.log(tx);
    } catch (e) {
      console.log(e);
    }
  };

  handleSignUpBtnClicked = async () => {
    console.log(this.state.en);
    if(this.state.en.length > 0) {
      try {
        const res = await this.broadcastSignal();
        swal({
          title: "Successfully requested sign up!",
          icon: "success",
        });
        this.setState({ phone: "" });
      } catch (e) {
        swal({
          title: "Sign up again!",
          text: "Try a different External Nullifier.",
          icon: "error",
        });
      }
    
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
                    value={this.state.identityString}
                  ></textarea>
                </div>

                <br />
                <div className="field">
                  <label className="label">Your Pubkey</label>
                  <textarea
                    className="textarea is-small"
                    value={this.state.pubkey}
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
