import React, { Component } from "react";
import Crypto from "crypto";
import Loader from "react-loader-spinner";
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
    serializedIdentity: "",
    identityCommitment: "",
    progress: 10,
    email: "",
    OTP: "",
    loading: false,
    name_first: "",
    name_middle: "",
    name_last: "",
    address: "",
    passport_number: "",
    state: "",
    city: "",
    country: "",
    zip: "",
    dob: ""
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

  handleChangeOTP= async(e) => {
    this.setState({ OTP: e.target.value })
    if (e.target.value.length == 6) {
      this.setState({ loading: true })

      setTimeout( async()=> {
        await axios
      .post('http://localhost:4000/api/verifyOTP', {
        email: this.state.email, otp: this.state.OTP, ts: Date.now()
      })
      .then((res) => {
        console.log(res.data.success)
        if(res.data.success == 1) {
          this.setState({ progress: 50, loading: false })
        }
        else {
          swal({
            title: "Try again!",
            icon: "error",
          });
          this.setState({ loading: false })
        }
      })
      .catch(err => {
        console.error(err);
      });
      }, 3000);

      
    }

  }

  handleVerifyPass() {
    this.setState({ progress: 100 })
  }

  handleRegisterBtnClicked = async () => {
    try {
      console.log("commitment: " + this.state.identityCommitment.toString())
      const index = await this.props.scContract.methods
        .requestRegistration(this.state.identityCommitment.toString())
        .send({ from: this.props.accounts[0] });
      console.log(index);
      const identityCommitment = this.state.identityCommitment.toString();
      var _id = identityCommitment.slice(-6)
      console.log("Identity commitment hash : "+ _id)
      const {email, name_first, name_middle, name_last, address, passport_number, state, city, country, zip, dob}= this.state;
      const kycData = {_id, name_first, name_middle, name_last,dob, email, address, state, city, country, zip, passport_number, identityCommitment};
      
      axios
      .post('http://localhost:4000/api/uploadkyc', kycData)
      .then(() => {
        console.log('KYC data sent successfully')
        swal({
          title: "Successfully Registered!",
          icon: "success",
        });
      })
      .catch(err => {
        console.error(err);
      });
    } catch (e) {
      console.log(e)
      swal({
        title: "Error registering!",
        icon: "error",
      });
    }
  };

  handleConfirmEmail() {
  
    axios
    .post('http://localhost:4000/api/genOTP', 
    {
      email: this.state.email
    })
    .then(() => {
      console.log('OTP request sent successfully')
    })
    .catch(err => {
      console.error(err);
    });  }

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
                <progress className="progress is-link is-primary" value={this.state.progress} max="100">30%</progress>
                {this.state.loading == true &&
                  <div className="modal is-active">
                    <div className="modal-background"></div>
                    <div className="modal-content" style={{ textAlign: "center" }}>
                      <Loader
                        type="ThreeDots"
                        color="pink"
                        height={100}
                        width={100}
                      />
                    </div>
                    <button className="modal-close is-large" aria-label="close"></button>
                  </div>
                }

                {this.state.progress == 10 &&
                  <div>
                    <h1 className="title">Email Verification</h1>
                    <div className="field is-horizontal">
                      <div className="field-body">
                        <div className="field has-addons">
                          <div className="control is-expanded">
                            <input
                              className="input"
                              type="text"
                              name="email"
                              onChange={this.handleChange.bind(this)}
                              placeholder="Email Address"
                              style={{ height: "100%", width: "100%" }}
                            />
                          </div>
                          <div className="control">
                            <button
                              className="button is-primary"
                              onClick={this.handleConfirmEmail.bind(this)}
                            >
                              Send Code
                    </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <br />
                    <div className="field is-horizontal">
                      <div className="field-body">
                        <div className="field">
                          <div className="control">
                            <input className="input" type="text" placeholder="OTP" onChange={this.handleChangeOTP.bind(this)} />
                          </div>
                          {/* <p className="help is-danger">
                              This field is required
                            </p> */}
                        </div>
                      </div>
                    </div>
                  </div>
                }

                {
                  this.state.progress == 50 &&
                  <div>
                    <h1 className="title">Personal Details</h1>

                    <div className="field">
                      <label className="label" style={{ float: "left" }}>First Name *</label>
                      <div className="control">
                        <input className="input" type="text" name="name_first" onChange={this.handleChange.bind(this)} />
                      </div>
                    </div>
                    <br />

                    <div className="field">
                      <label className="label" style={{ float: "left" }}>Middle Name</label>
                      <div className="control">
                        <input className="input" type="text" name="name_middle" onChange={this.handleChange.bind(this)} />
                      </div>
                    </div>
                    <br />

                    <div className="field">
                      <label className="label" style={{ float: "left" }}>Last Name</label>
                      <div className="control">
                        <input className="input" type="text" name="name_last" onChange={this.handleChange.bind(this)} />
                      </div>
                    </div>
                    <br />

                    <div className="field">
                      <label className="label" style={{ float: "left" }}>DOB *</label>
                      <div className="control">
                        <input className="input" type="date" name="dob" onChange={this.handleChange.bind(this)} />
                      </div>
                    </div>
                    <br />

                    <div className="field">
                      <label className="label" style={{ float: "left" }}>Address *</label>
                      <div className="control">
                        <input className="input" type="text" name="address" onChange={this.handleChange.bind(this)} />
                      </div>
                    </div>
                    <br />

                    <div className="columns">
                      <div className="column is-half">
                        <div className="field">
                          <label className="label" style={{ float: "left" }}>Country *</label>
                          <div className="control">
                            <input className="input" type="text" name="country" onChange={this.handleChange.bind(this)} />
                          </div>
                        </div>
                      </div>
                      <div className="column is-half">
                        <div className="field">
                          <label className="label" style={{ float: "left" }}>PIN/ ZIP Code *</label>
                          <div className="control">
                            <input className="input" type="text" name="zip" onChange={this.handleChange.bind(this)} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <br />

                    <div className="columns">
                      <div className="column is-half">
                        <div className="field">
                          <label className="label" style={{ float: "left" }}>City *</label>
                          <div className="control">
                            <input className="input" type="text" name="city" onChange={this.handleChange.bind(this)} />
                          </div>
                        </div>
                      </div>
                      <div className="column is-half">
                        <div className="field">
                          <label className="label" style={{ float: "left" }}>State *</label>
                          <div className="control">
                            <input className="input" type="text" name="state" onChange={this.handleChange.bind(this)} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <br />

                    <div className="field">
                      <label className="label" style={{ float: "left" }}>Passport Number *</label>
                      <div className="control">
                        <input className="input" type="text" name="passport_number" onChange={this.handleChange.bind(this)} />
                      </div>
                    </div>
                    <br />

                    <div className="columns">
                      <div className="column is-half">
                        <div className="file is-medium">
                        <label className="file-label">
                          <input className="file-input" type="file" name="passport1" onChange={this.handleChange.bind(this)} />
                          <span className="file-cta">
                            <span className="file-icon">
                              <i className="fas fa-upload"></i>
                            </span>
                            <span className="file-label">
                              Upload front of Passport *
                          </span>
                          </span>
                        </label>
                      </div>
                      </div>
                      <div className="column is-half">
                        <div className="file is-medium">
                        <label className="file-label">
                          <input className="file-input" type="file" name="passport2" onChange={this.handleChange.bind(this)}/>
                          <span className="file-cta">
                            <span className="file-icon">
                              <i className="fas fa-upload"></i>
                            </span>
                            <span className="file-label">
                              Upload back of Passport *
                          </span>
                          </span>
                        </label>
                      </div>
                      </div>
                    </div>
                    
                    

                    <br />

                    
                    <br />
                    <button className="button is-medium is-fullwidth is-primary"
                      onClick={this.handleVerifyPass.bind(this)}>
                      Submit Personal Details
                    </button>
                    <br />
                    <br />

                  </div>

                }
                {this.state.progress == 100 &&
                  <div className="box">
                    <div className="field">
                      <label className="label">Your ID</label>
                      <textarea
                        className="textarea is-small"
                        value={this.state.serializedIdentity}
                        onChange={()=> {}}
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
                    <div className="field ">
                      <div className="control">
                        <button
                          className="button is-primary  is-medium is-fullwidth"
                          onClick={this.handleRegisterBtnClicked.bind(this)}
                        >
                          Register
                    </button>
                      </div>
                    </div>
                    <br />
                  </div>
                }
              </div>
            </div>
          </div>

        </body>
      </div>
    );
  }
}

export default App;
