import React, { Component } from "react";

class App extends Component {

  state = {
    isOwner: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      web3: this.props.web3,
      accounts: this.props.accounts,
      scContract: this.props.scContract,
      semaphoreContract: this.props.semaphoreContract,
    };
  }
  
  componentDidMount = async () => {
    console.warn = () => {};
    var owner = await this.state.scContract.methods
      .owner()
      .call({ from: this.state.accounts[0] });
    const isOwner =
      owner
        .toString()
        .trim()
        .localeCompare(this.state.accounts[0].toString().trim()) == 0;
    this.setState({ isOwner });
  };

  render() {
    return (
      <div className="App">
        <br />
        <div className="sections">
          <div className="columns">
            <div className="column is-12-mobile is-8-desktop is-offset-2-desktop">
              <h1 className="title">Anonymous Login using Semaphore</h1>
              <p>
                A decentralized zero knowledge proof of concept for anonymous
                login using Semaphore.
              </p>
              {this.state.isOwner && <p>Welcome to the CA Homepage!</p>}
              {!this.state.isOwner && <p>Welcome, user!</p>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
