import React, { Component } from "react";
import axios from 'axios';

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
    const identityCommitment = genIdentityCommitment(identity)
    this.setState({ identity, serialisedIdentity, identityCommitment});
    console.log("identityCommitment: "+ this.state.identityCommitment)
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
        // const res = await this.broadcastSignal();
        
        await axios
      .post('http://localhost:4000/api/genCredentials', {
        user_id: this.state.identityCommitment.toString().slice(-6)
      })
      .then((res) => {
        console.log(res.data)
        swal({
          title: "Signup Successful!",
          text: "Token: "+ res.data.token+ "\n\n"+ "Proof: {\"pi_a\":\[\"16006342993685706563143884116771228340658308833755221679234256181530224581958\"\,\"20687242852290213408853627325831800844880215548146296848261781734687745037172\"\,\"1\"\]\,\"pi_b\"\:\[\[\"18165872478359898962941792914396896452286553494398686399126164854827032359666\"\,\"13726841067431886870863644797331139355522394850909841879397749855401727694268\"\]\,\[\"16554234181430824853442070900801820648163412273198174216344069884059125344811\"\,\"20454406429274137680239962430878046859459607012935656864132719829233893124147\"\]\,\[\"1\"\,\"0\"\]\]\,\"pi_c\"\:\[\"3724514752995428668046476227608446974927121284831290494562277521972567126867\"\,\"17455114098920187285736981328166020481854771229634370341911080508922646380368\"\,\"1\"\]\}",
          icon: "success"
        })

          const itemName = "Token".concat(this.state.en.toString().slice(-6))
          localStorage.setItem(itemName, JSON.stringify({token: res.data.token, ts: res.data.ts}))
      
          const r = localStorage.getItem(itemName)
          console.log(r)
        })
      .catch(err => {
        console.error(err);
      });

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
