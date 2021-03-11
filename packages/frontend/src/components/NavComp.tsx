import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  // Link
} from "react-router-dom";

import KycApproveCA from "./KycApproveCA";
import ManageEN from "./AddEN";
import RegisterUser from "./RegisterUser";
import Homepage from "./Homepage";
import SignupUser from "./signupUser";

import "../App.css";

class NavComp extends Component {

  state={isOwner: false, pendingApprovals: 1000}
  
   
  render() {
    return ( 
      <div className="App">
        <nav className="navbar" role="navigation" aria-label="main navigation">
          <div id="navbarBasicExample" className="navbar-menu">
            <div className="navbar-start">
              <a className="navbar-item" href="/">Home</a>
              <div className="navbar-item has-dropdown is-hoverable">
                <a className="navbar-link">Manage EN</a>

                <div className="navbar-dropdown">
                    <a className="navbar-item" href="/manage_en">Add EN</a>
              <a className="navbar-item" >Authenticate</a>
                </div>
              </div>

              <div className="navbar-item" >About</div>
              
            </div>
            {this.props.isOwner && (
              <div className="navbar-end">
                <div className="navbar-item">
                  {this.props.web3 && (
                    <div>
                      {this.props.accounts && (
                        <p>
                          <i className="connecteddot"></i>&nbsp;
                          {this.props.accounts[0].slice(0, 12)}...
                        </p>
                      )}
                    </div>
                  )}
                  {!this.props.web3 && (
                    <div>
                      {!this.props.accounts && (
                        <p>
                          <i className="disconnnecteddot"></i>&nbsp;
                          Please connect to Ganache
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <div className="navbar-item">
                  <span>
                    <a className="button is-primary navbar" href="/kyc_ca" style={{lineHeight: "30px"}}>
                      Pending Approvals: {this.state.pendingApprovals}
                    </a>
                  </span>
                </div>
              </div>
            )}
            {!this.props.isOwner && (
              <div className="navbar-end">
                <div className="navbar-item">
                  {this.props.web3 && (
                    <span>
                      {this.props.accounts && (
                        <p>
                          {" "}
                          <i className="connecteddot"></i>&nbsp;
                          {this.props.accounts[0].slice(0, 12)}...
                        </p>
                      )}
                    </span>
                  )}
                  {!this.props.web3 && (
                    <span>
                      {!this.props.accounts && (
                        <p>
                          <i className="disconnnecteddot"></i>&nbsp;
                          Please connect to Ganache
                        </p>
                      )}
                    </span>
                  )}
                </div>
                <div className="navbar-item">
                  <div className="buttons">
                    <a className="button is-primary navbar" href="/reg" style={{lineHeight: "30px"}}>
                      Register
                    </a>
                    <a className="button is-light navbar" href="/signup" style={{lineHeight: "30px"}}>
                      Sign Up
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>
        <Router>
          <Switch>
            
            <Route
              exact
              path="/reg"
              component={() => (
                <RegisterUser
                  web3={this.props.web3}
                  accounts={this.props.accounts}
                  scContract={this.props.scContract}
                />
              )}
            />
            <Route
              exact
              path="/signup"
              component={() => (
                <SignupUser
                  web3={this.props.web3}
                  accounts={this.props.accounts}
                  scContract={this.props.scContract}
                />
              )}
            />
            <Route
              exact
              path="/"
              component={() => (
                <Homepage
                  web3={this.props.web3}
                  accounts={this.props.accounts}
                  scContract={this.props.scContract}
                />
              )}
            />
            <Route
              exact
              path="/manage_en"
              component={() => (
                <ManageEN
                  web3={this.props.web3}
                  accounts={this.props.accounts}
                  scContract={this.props.scContract}
                />
              )}
            />
            <Route
              exact
              path="/kyc_ca"
              component={() => (
                <KycApproveCA
                  web3={this.props.web3}
                  accounts={this.props.accounts}
                  scContract={this.props.scContract}
                />
              )}
            />
          </Switch>
        </Router>
      </div>
    );
  }
}
export default NavComp;
