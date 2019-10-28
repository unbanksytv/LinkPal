import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';

const web3 = new Web3(window.web3.currentProvider); //Use provider from MetaMask

//Address of the factory contract
var contractAddress = '0x632c0939e61182827ccd5f3d61b693baef0167a8';

var abiFactory = 
    [
        {
            "constant": true,
            "inputs": [],
            "name": "owner",
            "outputs": [
            {
                "name": "",
                "type": "address"
            }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
            {
                "indexed": false,
                "name": "newLoanApplication",
                "type": "address"
            }
            ],
            "name": "LoanApplicationCreated",
            "type": "event"
        },
        {
            "constant": false,
            "inputs": [
            {
                "name": "duration",
                "type": "uint256"
            },
            {
                "name": "interestAmount",
                "type": "uint256"
            },
            {
                "name": "creditAmount",
                "type": "uint256"
            }
            ],
            "name": "createApplication",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "getApplications",
            "outputs": [
            {
                "name": "",
                "type": "address[]"
            }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
            {
                "name": "applicationAddress",
                "type": "address"
            }
            ],
            "name": "getLoan",
            "outputs": [
            {
                "name": "",
                "type": "address[]"
            }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }
        ];


        var abiApplicaiton = [
        {
        "constant": true,
        "inputs": [],
        "name": "duration",
        "outputs": [
            {
            "name": "",
            "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
        },
        {
        "constant": true,
        "inputs": [],
        "name": "guaranteeAccepted",
        "outputs": [
            {
            "name": "",
            "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
        },
        {
        "constant": true,
        "inputs": [],
        "name": "investor",
        "outputs": [
            {
            "name": "",
            "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
        },
        {
        "constant": true,
        "inputs": [],
        "name": "loanAddress",
        "outputs": [
            {
            "name": "",
            "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
        },
        {
        "constant": true,
        "inputs": [],
        "name": "guarantorInterest",
        "outputs": [
            {
            "name": "",
            "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
        },
        {
        "constant": true,
        "inputs": [],
        "name": "guarantor",
        "outputs": [
            {
            "name": "",
            "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
        },
        {
        "constant": true,
        "inputs": [],
        "name": "hasGuarantee",
        "outputs": [
            {
            "name": "",
            "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
        },
        {
        "constant": true,
        "inputs": [],
        "name": "borrower",
        "outputs": [
            {
            "name": "",
            "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
        },
        {
        "constant": true,
        "inputs": [],
        "name": "creditAmount",
        "outputs": [
            {
            "name": "",
            "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
        },
        {
        "constant": true,
        "inputs": [],
        "name": "guarantorGuarantee",
        "outputs": [
            {
            "name": "",
            "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
        },
        {
        "constant": true,
        "inputs": [],
        "name": "interestAmount",
        "outputs": [
            {
            "name": "",
            "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [
            {
            "name": "_openApp",
            "type": "bool"
            },
            {
            "name": "_borrower",
            "type": "address"
            },
            {
            "name": "_duration",
            "type": "uint256"
            },
            {
            "name": "_creditAmount",
            "type": "uint256"
            },
            {
            "name": "_interestAmount",
            "type": "uint256"
            },
            {
            "name": "_hasGuarantee",
            "type": "bool"
            },
            {
            "name": "_guarantor",
            "type": "address"
            },
            {
            "name": "_guarantorInterest",
            "type": "uint256"
            },
            {
            "name": "_guarantorGurantee",
            "type": "uint256"
            },
            {
            "name": "_guaranteeAccepted",
            "type": "bool"
            },
            {
            "name": "_investor",
            "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
        },
        {
        "anonymous": false,
        "inputs": [
            {
            "indexed": false,
            "name": "newLoan",
            "type": "address"
            }
        ],
        "name": "LoanCreated",
        "type": "event"
        },
        {
        "constant": false,
        "inputs": [
            {
            "name": "_guarantorInterest",
            "type": "uint256"
            }
        ],
        "name": "addGuarantee",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
        },
        {
        "constant": false,
        "inputs": [],
        "name": "acceptGuarantee",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
        },
        {
        "constant": false,
        "inputs": [],
        "name": "rejectGuarantee",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
        },
        {
        "constant": false,
        "inputs": [],
        "name": "createLoan",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
        },
        {
        "constant": true,
        "inputs": [],
        "name": "getOpenApp",
        "outputs": [
            {
            "name": "",
            "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
        },
        {
        "constant": true,
        "inputs": [],
        "name": "getLoanAddress",
        "outputs": [
            {
            "name": "",
            "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
        },
        {
        "constant": true,
        "inputs": [],
        "name": "getBorrower",
        "outputs": [
            {
            "name": "",
            "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
        },
        {
        "constant": true,
        "inputs": [],
        "name": "getDuration",
        "outputs": [
            {
            "name": "",
            "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
        },
        {
        "constant": true,
        "inputs": [],
        "name": "getCreditAmount",
        "outputs": [
            {
            "name": "",
            "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
        },
        {
        "constant": true,
        "inputs": [],
        "name": "getInterestAmount",
        "outputs": [
            {
            "name": "",
            "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
        },
        {
        "constant": true,
        "inputs": [],
        "name": "getHasGuarantee",
        "outputs": [
            {
            "name": "",
            "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
        },
        {
        "constant": true,
        "inputs": [],
        "name": "getGuarantor",
        "outputs": [
            {
            "name": "",
            "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
        },
        {
        "constant": true,
        "inputs": [],
        "name": "getGuarantorInterest",
        "outputs": [
            {
            "name": "",
            "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
        },
        {
        "constant": true,
        "inputs": [],
        "name": "getGuarantorGuarantee",
        "outputs": [
            {
            "name": "",
            "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
        },
        {
        "constant": true,
        "inputs": [],
        "name": "getGuaranteeAccepted",
        "outputs": [
            {
            "name": "",
            "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
        },
        {
        "constant": false,
        "inputs": [],
        "name": "collectGuarantee",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
        },
        {
        "constant": false,
        "inputs": [],
        "name": "timeUp",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
        }
    ];

var Factory = new web3.eth.Contract(abiFactory,contractAddress);
var deployedContract;

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
        invoiceID : '',
        senderAddress : '',
        buyerAddress : '',
        amount : '',
        jobIds : [],
        oracles : []
    };
    this.handleCreateLinkPal = this.handleChange.bind(this);
    this.handleRequestConfirmations = this.handleChange.bind(this);
    this.handleWithdrawETH = this.handleChange.bind(this);
    this.handleWithdrawLink = this.handleChange.bind(this);
  }
  
  async createLinkPal(invoiceID, etherToSend,buyerAddress, jobIds, oracles){
    var accounts = await web3.eth.getAccounts();
    var tosend = web3.utils.toWei(etherToSend,'ether');

    await Factory.methods.createLinkPal(invoiceID, accounts[0], buyerAddress, tosend, jobIds, oracles).send({from:accounts[0] , value : tosend });
  }

  async OutOfTime(){
    var accounts = await web3.eth.getAccounts();
    await Loan.methods.outOfTime().send({from :accounts[0]});
  }

  handleContractDeployed(event){
      this.contractDeployed();
  }

  handleSuccessNodeResponse(event){
    this.successNodeResponse();
  }
  
  handleChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    this.setState({
      [name]: value
    });
  }

  handleApplication(event){
    this.setState({currentApplication : event.target.value});
    console.log( event.target.value);
    this.loadApplication();
    this.loadLoan();
  }

  async OutOfTime(){
    var accounts = await web3.eth.getAccounts();
    await Loan.methods.outOfTime().send({from :accounts[0]});
  }

  async createApplication(duration,interest,amount){
    var accounts = await web3.eth.getAccounts();
    await LoanFactory.methods.createApplication(duration,web3.utils.toWei(interest,'ether'),web3.utils.toWei(amount,'ether')).send({from:accounts[0]});
   // console.log(await LoanFactory.methods.getApplications().call());
  }

  async collectGuarantee(){
    var accounts = await web3.eth.getAccounts();
    await LoanApplication.methods.collectGuarantee().send({from:accounts[0]});
  }

  async timeUp(){
    var accounts = await web3.eth.getAccounts();
    await LoanApplication.methods.timeUp().send({from:accounts[0]});
  }

  handleAddGuarantee(event){
    this.addGuarantee(this.state.guarantorInterest);
  }
  handleSubmit(event) {
    alert(' Duration : ' + this.state.duration + 
          ' Credit Amount : ' + this.state.creditAmount +
          ' Interest Amount : ' + this.state.interest);
    event.preventDefault();
    this.createApplication(this.state.duration,this.state.interest,this.state.creditAmount);
  }

  handleAcceptGuarantee(event){
    this.acceptGuarantee();
  }

  async payLoan(){
    var accounts = await web3.eth.getAccounts();
    var tosend = web3.utils.toWei(this.state.paid,'ether');
    await Loan.methods.payLoan().send({from:accounts[0] , value : tosend });
  }

  handlePayLoan(event){
    this.payLoan();
  }
  handleRejectGuarantee(event){
    this.rejectGuarantee();
  }

  handleCreateLoan(event){
    this.createLoan();
  }

  async loadLoan(){
    Loan = new web3.eth.Contract(abiLoan,this.state.appLoanAddress);
    this.setState({loanAmountPaid : await Loan.methods.getAmountPayed().call()});
    this.setState({loanInvestor : await Loan.methods.getInvestor().call()});
  }

  async loadApplication(){
    LoanApplication = new web3.eth.Contract(abiApplicaiton,this.state.currentApplication);
    this.setState({apphasguarantee :  await LoanApplication.methods.getHasGuarantee().call()});
    this.setState({appguarantor : await LoanApplication.methods.getGuarantor().call()});
    this.setState({appcredit : await LoanApplication.methods.getCreditAmount().call()});
    this.setState({appinterest : await LoanApplication.methods.getInterestAmount().call()});
    this.setState({appguaranteeAccepted : await LoanApplication.methods.getGuaranteeAccepted().call()});
    this.setState({appborrower : await LoanApplication.methods.getBorrower().call()});
    this.setState({appopen: await LoanApplication.methods.getOpenApp().call()});
    this.setState({appDuration : await LoanApplication.methods.getDuration().call()});
    this.setState({appLoanAddress : await LoanApplication.methods.getLoanAddress().call()});
  }

  async createLoan(){  
    var accounts = await web3.eth.getAccounts();
    await LoanApplication.methods.createLoan().send({from:accounts[0] , value : this.state.appcredit});
  }
  
  async addGuarantee(guarantorInterest){
    var accounts = await web3.eth.getAccounts();
    console.log("ACCOUNTS");
    console.log(accounts);
    await LoanApplication.methods.addGuarantee(web3.utils.toWei(guarantorInterest,'ether')).send({from:accounts[0] , value : this.state.appcredit });
  }

  async acceptGuarantee(){
    var accounts = await web3.eth.getAccounts();
    await LoanApplication.methods.acceptGuarantee().send({from:accounts[0]});
  }

  async rejectGuarantee(){
    var accounts = await web3.eth.getAccounts();
    await LoanApplication.methods.rejectGuarantee().send({from:accounts[0]});
  }

  async componentDidMount(){
    let newappAddresses = await LoanFactory.methods.getApplications().call();
    console.log(newappAddresses);
    this.setState({appAddresses:newappAddresses });
    //console.log(ret);
  }
  
  async componentWillUnmount(){

  }
  //Array of addresses 
  buildOptions() {
    var arr = [];
    var temp = this.state.appAddresses.length;
    for (let i = 0; i <= temp; i++) {
        arr.push(<option key={i} value={this.state.appAddresses[i]}>{this.state.appAddresses[i]}</option>)
    }

    return arr; 
}
  render() {

  const formApplication = (
    <form onSubmit ={this.handleSubmit}>
        <div class="block">
          <label for="duration" class="col-lg-2 control-label">Duration Months: </label>
          <input name ="duration" type="Number" id="duration" value={this.state.duration} onChange={this.handleChange} />
        </div>
        <div class ="block">
          <label for="application" class="col-lg-2 control-label">Credit Eth: </label>
          <input name= "creditAmount" type="Number" id="credit"  value={this.state.creditAmount} onChange={this.handleChange}/>
        </div>
        <div class ="block">
          <label for="application" class="col-lg-2 control-label">Interest Eth: </label>
          <input name="interest" type="Number" id = "interest"  value={this.state.interest} onChange={this.handleChange}/>
        </div>
        <div class = "block">
          <input type="submit" value="Submit" />
        </div>
      </form>
  );
 
  const chooseApplication = (
    <div>
    <select onClick = {this.handleApplication}>
        {this.buildOptions()}
    </select>
    <br></br>
    {this.state.currentApplication}
    </div>
  );
  const showApplicationDetails = (
    <form >
      <div class ="block">
          <label for="applicationDetails" class="col-lg-2 control-label">Loan Open  :  </label> 
          {this.state.appopen.toString()}
      </div>
      <div class ="block">
          <label for="applicationDetails" class="col-lg-2 control-label">Borrower Address :  </label> 
          {this.state.appborrower}
      </div>
      <div class ="block">
        <label for="applicationDetails" class="col-lg-2 control-label">Credit :  </label> 
        {this.state.appcredit}
      </div>
      <div class ="block">
          <label for="applicationDetails" class="col-lg-2 control-label">Asking Interest :  </label> 
          {this.state.appinterest}
      </div>
      <div class ="block">
          <label for="applicationDetails" class="col-lg-2 control-label">Duration :  </label> 
          {this.state.appDuration}
      </div>
      <div class ="block">
        <label for="applicationDetails" class="col-lg-2 control-label">Has Guarantee :  </label> 
        {this.state.apphasguarantee.toString()}
      </div>
      <div class ="block">
          <label for="applicationDetails" class="col-lg-2 control-label">Guarantor Address  </label>
          {this.state.appguarantor}
      </div>
      <div class = "block">
        <input name="guarantorInterest" type="Number" id = "guaranteeInterest"  value={this.state.guarantorInterest} onChange={this.handleChange}/>
        <button type="button" onClick={this.handleAddGuarantee}>Add Guarantee</button>
      </div>
      <div class = "block">
        <button type="button" onClick={this.handleAcceptGuarantee}>Accept Guarantee</button>
        <button type="button" onClick={this.handleRejectGuarantee}>Reject Guarantee</button>
        <button type="button" onClick={this.handleCreateLoan}> Create Loan</button>
        <button type="button" onClick={this.handleCollectGuarantee}>Collect Guarantee</button>
        <button type="button" onClick={this.handleTimeUp}>Time Up </button>
      </div> 
    </form>
  );

  const LoanForm = (
    <form>
        <div class ="block">
          <label for="applicationDetails" class="col-lg-2 control-label">Loan Address :  </label>
          {this.state.appLoanAddress}
      </div>
       <div class="block">
          <label for="LoanForm" class="col-lg-2 control-label"> </label>
          <input name ="paid" type="Number" id="duration" value={this.state.paid} onChange={this.handleChange} />
          <button type="button" onClick={this.handlePayLoan}>Pay Loan</button>
        </div>
        <div class="block">
          <label for="applicationDetails" class="col-lg-2 control-label">Investor Address :  </label> 
          {this.state.loanInvestor}
        </div>
        <div class ="block">
          <label for="loanDetails" class="col-lg-2 control-label">Amount Paid: </label> 
          {this.state.loanAmountPaid}
          <br></br>
          <button type="button" onClick={this.handleOutofTime}>Time Up </button>
      </div>
    </form>
  );
  const mainDiv = ( 
    <div className="App">
    <h2>Loan System</h2>
    <h2>Create Loan Application</h2>
     {formApplication}
     <h2>Loan Applications</h2>
     {chooseApplication}
     {showApplicationDetails}
     <h2>Loan</h2>
     {LoanForm}
    </div>
  );

    return (
      mainDiv
    );
  }
}
export default App;
