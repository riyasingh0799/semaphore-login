import React, { Component } from "react";

import { genExternalNullifier, genIdentityCommitment } from "libsemaphore";

import swal from "sweetalert";
import { retrieveId } from "../utils/storage";
import axios from 'axios';

class App extends Component {
  state = { domain: "" };

  constructor(props) {
    super(props);
    this.state = {
      web3: this.props.web3,
      account: this.props.account,
      scContract: this.props.scContract,
      domain: "",
    };
  }

  componentDidMount = async () => {
    console.warn = () => { };
    const identity = retrieveId();
    const identityCommitment = genIdentityCommitment(identity);
    this.setState({ identityCommitment });
  };

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleAddEN = async () => {
    if (this.state.domain.length > 0) {
      const hash = genExternalNullifier(this.state.domain);
      // const enExists = await this.state.scContract.methods.enExists(hash).call({ from: this.props.accounts[0] })
      try {
        const tx = await this.state.scContract.methods
          .addExternalNullifier(hash, this.state.identityCommitment)
          .send({ from: this.props.accounts[0] });

        console.log(tx);
        console.log("Added EN: " + hash);

        swal({
          title: "External Nullifer " + this.state.domain + " added!",
          text: "Hash: " + hash,
          icon: "success",
        });

        const ts = Date.now()
        const body = {en: hash, domain: this.state.domain, ts_created: ts}

        axios
      .post('http://localhost:4000/api/enStore', body)
      .then(() => {
        console.log('En data sent successfully')
        swal({
          title: "Successfully Registered!",
          icon: "success",
        });
      })
      .catch(err => {
        console.error(err);
      });

        this.setState({ domain: "" })
      } catch (e) {
        console.log(e);
      }
    }
  };

  render() {

    return (
      <div className="App">

        <div className="sections">
          <div className="columns">
            <div className="column is-12-mobile is-8-desktop is-offset-2-desktop">
              <div className="box">
                <div className="field">
                  <label className="label">Domain</label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      name="domain"
                      onChange={this.handleChange.bind(this)}
                    />
                  </div>
                </div>

                <br />
                <div className="field ">
                  <div className="control">
                    <button
                      className="button is-primary"
                      onClick={this.handleAddEN.bind(this)}
                    >
                      Submit
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
