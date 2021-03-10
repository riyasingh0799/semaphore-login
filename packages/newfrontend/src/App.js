import 'regenerator-runtime/runtime'
import React, { Component } from "react";

import getWeb3 from "./getWeb3";
import getContractInstance from "./getContractInstance";

import semaphoreABI from "./abi/Semaphore.abi.json";
import ClientABI from "./abi/Client.abi.json";

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

import addresses from "./addr/addr.json";
import NavComp from "./components/NavComp";
import "./App.css";

class App extends Component {

    constructor() {
        super();
         this.state = {
    identity: "",
    email: "",
    web3: null,
    accounts: null,
    scContract: null,
    isOwner: false,
    pendingApprovals: 1000000000,
  };
    }

  componentDidMount = async () => {
    console.warn = () => {};
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      console.log("semaphore addr: " + addresses.semAddr+ ", sccontract addr: "+ addresses.scAddr);

      const semaphoreContract = await getContractInstance(
        web3,
        semaphoreABI,
        addresses.semAddr
      );

      console.log(semaphoreContract)

      const scContract = await getContractInstance(web3, ClientABI, addresses.scAddr);
      console.log(scContract);

      const identity = genIdentity();
      const serialisedIdentity = serialiseIdentity(identity);
      let identityCommitment = genIdentityCommitment(identity);
      this.setState({
        web3,
        semaphoreContract,
        scContract,
        identity,
        serialisedIdentity,
        identityCommitment,
        accounts,
      });

      console.log(this.state)

      var owner = await scContract.methods
        .owner()
        .call({ from: accounts[0] });
      const isOwner =
        owner.toString().trim().localeCompare(accounts[0].toString().trim()) ==
        0;
      this.setState({ isOwner });
      console.log("owner: " + owner);
      console.log("account: " + accounts);
    } catch (e) {
      console.log(e);
    }
  };

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    // if (!this.state.web3) {
    //   return <div>Loading Web3, accounts, and contract...</div>;
    // }
    return (
      <div className="App">
        <NavComp
          web3={this.state.web3}
          accounts={this.state.accounts}
          scContract={this.state.scContract}
          semaphoreContract={this.state.semaphoreContract}
          isOwner={this.state.isOwner}
          ></NavComp>
      </div>
    );
  }
}

export default App;
