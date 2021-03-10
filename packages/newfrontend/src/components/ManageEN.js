import React, { Component } from "react";

import { genExternalNullifier } from "libsemaphore";

import swal from "sweetalert";

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
    console.warn = () => {};
    const identityCommitment = localStorage.getItem("identityCommitment");
    this.setState({ showModal: false, identityCommitment});
  };

  handleClick = () => {
    this.setState({ isModal: !this.state.isModal });
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

        this.setState({domain: ""})
      } catch (e) {
        console.log(e);
      }
    }
  };

  render() {
    const active = this.state.isModal ? "is-active" : "";

    return (
      <div className="App">
        <div className={`modal ${active}`} id="modal">
          <div className="modal-background"></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Add EN</p>
              <button
                className="delete"
                aria-label="close"
                onClick={this.handleClick.bind(this)}
              ></button>
            </header>
            <section className="modal-card-body">
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
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <button className="button" onClick={this.handleClick.bind(this)}>
                    Cancel
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
        <br />
        <div className="sections">
          <div className="columns">
            <div className="column is-12-mobile is-8-desktop is-offset-2-desktop">
              <div className="box">
                <div className="buttons">
                  <button
                    className="button is-info"
                    onClick={this.handleClick.bind(this)}
                  >
                    Add EN
                  </button>

                  <button className="button is-warning">Send Challenge</button>
                  <button className="button is-success">Authenticate</button>
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
