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
    const identityString = localStorage.getItem("identity");
    // const identityCommitment = localStorage.getItem("identityCommitment");
    const identity = unSerialiseIdentity(identityString);
    // console.log("id commitment " + genIdentityCommitment(identity));

    this.setState({ identity, identityString });
    const keypair = localStorage.getItem("keypair");
    console.log(keypair);
    const pubkey = JSON.parse(keypair).pubkey.toString();
    console.log(pubkey);
    this.setState({ pubkey });
    console.log(this.state.identity)

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
      console.log(this.state.identity)
      const res = await genAuth(this.state.en, "hey", this.state.identity, this.props.scContract, this.props.accounts[0])
      console.log(res)}
  }

  // broadcastSignal = async () => {
  //     if (!("TextEncoder" in window))
  //       alert("Sorry, this browser does not support TextEncoder...");

  //     var pubkeyBytes = new TextEncoder(); // always utf-8
  //     console.log("pubkeyBytes  " + pubkeyBytes.encode(pubkeyBytes));
  //     console.log(this.state.en);
  //     this.setState({ status: "Downloading leaves" });
  //     const leaves = await this.state.scContract.methods
  //       .getIDCommitments()
  //       .call({ from: this.state.account });
  //     console.log("Leaves:", leaves);
  //     this.setState({ status: "Downloading circuit" });
  //     const circuitUrl = "http://localhost:5000/circuit.json";
  //     console.log("Downloading circuit from ", circuitUrl);

  //     const tree = setupTree(20);
  //     for (let i = 0; i < leaves.length; i++) {
  //       await tree.update(i, leaves[i].toString());
  //     }
  //     console.log(tree);

  //     const cirDef = await (await this.fetchWithoutCache(circuitUrl)).json();
  //     const circuit = genCircuit(cirDef);
  //     console.log(circuit);
  //     const provingKeyUrl = "http://localhost:5000/proving_key.bin";
  //     this.setState({ status: "Downloading proving key" });

  //     console.log("Downloading proving key from ", provingKeyUrl);
  //     this.setState({ status: "Generating witness" });

  //     const provingKey = new Uint8Array(
  //       await (await fetch(provingKeyUrl)).arrayBuffer()
  //     );
  //     const t1 = performance.now();

  //     const { witness } = await genWitness(
  //       "hey",
  //       circuit,
  //       this.state.identity,
  //       leaves,
  //       20,
  //       this.state.web3.utils.toBN("0x00")
  //     );
  //     const genWitnessTime = ((performance.now() - t1) / 1000).toFixed(2);

  //     console.log("Witness generated (" + genWitnessTime + "s).");
  //     console.log(witness);
  //     return witness
  //     // const witness = result.witness;

  //     // this.setState({ status: "Generating proof" });

  //     // console.log("Generating proof");
  //     // const proof = await genProof(witness, provingKey);
  //     // this.setState({ status: "Broadcasting signal" });

  //     // const publicSignals = genPublicSignals(witness, circuit);
  //     // const params = genBroadcastSignalParams(result, proof, publicSignals);

  //     // const tx = await this.state.scContract.methods.broadcastSignal(
  //     //   pubkeyBytes,
  //     //   params.proof,
  //     //   params.root,
  //     //   params.nullifiersHash,
  //     //   this.state.en.toString()
  //     // );
  //     // console.log(tx);
    
  // };

  handleSignUpBtnClicked = async () => {
    console.log(this.state.en);
    if (this.state.en.length > 0) {
        const res = await this.broadcastSignal();
        swal({
          title: "Successfully signed up!",
          icon: "success",
        });
        this.setState({ phone: "" });
        // swal({
        //   title: "Sign up again!",
        //   text: "Try a different External Nullifier.",
        //   icon: "error",
        // });
      
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
