import React,{ Component } from 'react';

import { makeStyles, withStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';

import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import NavigationIcon from '@material-ui/icons/Navigation';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';



import Web3 from 'web3';

//Factory Contract Address Ropsten Factory = 0xd770fa5b25ce0c48ccfbd925b753322c1f69bcb3
var contractFactoryAddress = '0xd770fa5b25ce0c48ccfbd925b753322c1f69bcb3';


const withErrorHandling = WrappedComponent => ({ showError, children }) => {
  return (
    <WrappedComponent>
      {showError && <div className="error-message">Oops! Something went wrong! Install MetaMask and refresh.</div>}
      {children}
    </WrappedComponent>
  );
};

// TODO:
// Ability to search
// Get all LinkPal addresses with address X
// 1 Table per address found
// Interact with contract: click on paypal link, send redeem function


//var web3 = new Web3();
//const web3 = new Web3(window.web3.currentProvider); //Use provider from MetaMask
var web3;

const DivWithErrorHandling = withErrorHandling(({children}) => <div>{children}</div>)

const abiFactory = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "_invoiceID",
				"type": "string"
			},
			{
				"name": "_buyerAddress",
				"type": "address"
			},
			{
				"name": "_jobIds",
				"type": "string[]"
			},
			{
				"name": "_oracles",
				"type": "address[]"
			}
		],
		"name": "createLinkPal",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "LinkPalAddress",
				"type": "address"
			}
		],
		"name": "contractDeployed",
		"type": "event"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getLinkPalAddressesBuyer",
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
		"name": "getLinkPalAddressesSeller",
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
		"inputs": [
			{
				"name": "",
				"type": "address"
			},
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "LinkPalAddressesBuyer",
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
		"inputs": [
			{
				"name": "",
				"type": "address"
			},
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "LinkPalAddressesSeller",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
];


const abiERC20 =
[
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "name": "",
                "type": "string"
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
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
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
        "constant": false,
        "inputs": [
            {
                "name": "_from",
                "type": "address"
            },
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "name": "",
                "type": "uint8"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "balance",
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
        "name": "symbol",
        "outputs": [
            {
                "name": "",
                "type": "string"
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
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            },
            {
                "name": "_spender",
                "type": "address"
            }
        ],
        "name": "allowance",
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
        "payable": true,
        "stateMutability": "payable",
        "type": "fallback"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    }
];

const abiLinkPal =
[
	{
		"constant": false,
		"inputs": [
			{
				"name": "_requestId",
				"type": "bytes32"
			},
			{
				"name": "paid",
				"type": "bool"
			}
		],
		"name": "fulfillNodeRequest",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "falseCount",
		"outputs": [
			{
				"name": "",
				"type": "uint8"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getChainlinkToken",
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
		"name": "getjobIdsLength",
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
		"name": "trueCount",
		"outputs": [
			{
				"name": "",
				"type": "uint8"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "sellerAddress",
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
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "jobIds",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "buyerAddress",
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
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "oracles",
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
		"constant": false,
		"inputs": [],
		"name": "withdrawLink",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "released",
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
		"name": "getoraclesLength",
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
		"name": "amount",
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
		"constant": false,
		"inputs": [],
		"name": "requestConfirmations",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "invoiceID",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "withdrawETH",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "deploymentTime",
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
				"name": "_invoiceID",
				"type": "string"
			},
			{
				"name": "_sellerAddress",
				"type": "address"
			},
			{
				"name": "_buyerAddress",
				"type": "address"
			},
			{
				"name": "_amount",
				"type": "uint256"
			},
			{
				"name": "_jobIds",
				"type": "string[]"
			},
			{
				"name": "_oracles",
				"type": "address[]"
			}
		],
		"payable": true,
		"stateMutability": "payable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "success",
				"type": "bool"
			}
		],
		"name": "successNodeResponse",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "id",
				"type": "bytes32"
			}
		],
		"name": "ChainlinkRequested",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "id",
				"type": "bytes32"
			}
		],
		"name": "ChainlinkFulfilled",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "id",
				"type": "bytes32"
			}
		],
		"name": "ChainlinkCancelled",
		"type": "event"
	}
];

function createData(operator, oracle, job) {
	return { operator, oracle, job };
};

var LinkPalFactory;
var LinkPal;
var ChainlinkContractAddress = '0x20fE562d797A42Dcb3399062AE9546cd06f63280';
var ChainlinkContract;
var contractAddress;
var linkFee = 1;
var linkPerOracle = 1;

export default class ContractInteraction extends React.Component {

	state ={
		currentContract : '',
        LinkPalAddress : '',
        trueCount : null,
        falseCount : null,
		ethAmount : null,
		invoice_id : '',
        sellerAddress : '',
        buyerAddress : '',
		released : false,	
		oracles : [],
        job_ids : [],
        deploymentTime : '',
		showError :false,
		loading: false,
		newLinkPalAddress : null,
		arrayLength : null,
    };
	
    //Loader function to retrieve the data from the contract
	loadLinkPalContract = async (event) => {
        try{
			LinkPal = new web3.eth.Contract(abiLinkPal, this.state.currentContract);
            await LinkPal.methods.released().call().then(function (res) { if (res != null){this.setState({ released  : res })}}.bind(this));
            await LinkPal.methods.trueCount().call().then(function (res) {  this.setState({ trueCount  : res })}.bind(this));
            await LinkPal.methods.falseCount().call().then(function (res) { this.setState({ falseCount : res })}.bind(this));
            await LinkPal.methods.invoiceID().call().then(function (res) {  this.setState({ invoice_id : res })}.bind(this));
            await LinkPal.methods.sellerAddress().call().then(function (res) {  this.setState({ sellerAddress : res })}.bind(this));
            await LinkPal.methods.buyerAddress().call().then(function (res) {   this.setState({ buyerAddress  : res })}.bind(this));
            await LinkPal.methods.amount().call().then(function (res) { this.setState({ ethAmount : res })}.bind(this));
			await LinkPal.methods.deploymentTime().call().then(function (res) { this.setState({ deploymentTime : res })}.bind(this));
			await LinkPal.methods.getjobIdsLength().call().then(function (res) { this.setState({ arrayLength : res })}.bind(this));
			linkFee = this.state.arrayLength * linkPerOracle;
			console.log("UPDATED LINKFEE : " + linkFee);
        }
		// Non-DApp Browsers
		catch {
            this.toggleError();
		}
	} 
	   
	/*
	//Loader function to retrieve the data from the contract
	loadOracleJobs = async (event) => {
        try{
			LinkPal = new web3.eth.Contract(abiLinkPal, this.state.currentContract);
			linkFee = this.state.arrayLength * linkPerOracle;
			console.log(this.state.arrayLength);
			for (let i = 0; i < this.state.arrayLength; i++) {
					var tempOracle = '';
					var tempJob = '';

					await LinkPal.methods.oracles(i).call().then(function (res) { tempOracle =  res });
					await LinkPal.methods.jobIds(i).call().then(function (res) { tempJob =  res });
					console.log("ANOTHER ONE ");
					console.log(tempOracle);
					console.log(tempJob);

					this.state.oracles.concat([tempOracle]);
					this.state.job_ids.concat([tempJob]);
			}
			console.log("LOOK AT ME PICKLED DICK");
			console.log(this.state.oracles);
			console.log(this.state.job_ids);
        }
		// Non-DApp Browsers
		catch {
            this.toggleError();
		}
    }    
	*/

    async loadChainlinkContract(){
        try{
        	ChainlinkContract  = new web3.eth.Contract(abiERC20, ChainlinkContractAddress);
        }
        // Non-DApp Browsers
        catch {
            this.toggleError();
        }
    }
    
    //Loads the web3 Metamask confirmations and Checks for Events
	async loadBlockChain() {
		// Modern DApp Browsers
		if (window.ethereum) {
			web3 =  new Web3(window.ethereum);
			this.getAccounts();
			try { 
				window.ethereum.enable().then(function() {
					//Set State When recieve Emission from Event from Smart Contract
                    LinkPal = new web3.eth.Contract(abiLinkPal, contractAddress);
                    ChainlinkContract  = new web3.eth.Contract(abiERC20, ChainlinkContractAddress);
                    //this.setState({ LinkPalState : LinkPal });
				}.bind(this));
			} catch(e) {
                // User has denied account access to DApp...
                console.log(e);
			}
		}
		// Legacy DApp Browsers
		else if (window.web3) {
			web3 = new Web3(window.web3.currentProvider);
			this.getAccounts();
		}
		// Non-DApp Browsers
		else {
            this.toggleError();
		}
	}
	getAccounts = () =>{
		web3.eth.getAccounts().then(accounts => { 
				
			this.setState({ account: accounts[0]});
			console.log(accounts);
		
		});}
	
	onClickFund = async (event) =>{
		try{	
			this.getAccounts();
			console.log('CHECK THIS CONSOLE')
			ChainlinkContract.methods.transfer(
				LinkPal.options.address, 
				web3.utils.toHex(linkFee * Math.pow (10, 18))).send( {
				   from: this.state.account
				 }, 
				(error, txHash) => {
				  console.log(txHash);
				});
				
		}catch(err){
			console.log(err)
			this.toggleError();
		}
	}
	
	//This should run the confirmations to see if the paypal invoice was paid.
	onClickConfirmPaid = async (event) =>{
		try{	
			this.getAccounts();
			LinkPal.methods.requestConfirmations().send({
					from: this.state.account
				}, 
				(error, txHash) => {
				  console.log(txHash);
				});
		}catch(err){
			console.log(err)
			this.toggleError();
		}
	}
	
	//This should withdraw the Ethereum
	onWithDrawETH = async (event) =>{
			try{	
				this.getAccounts();
				LinkPal.methods.withdrawETH().send({
						from: this.state.account
					}, 
					(error, txHash) => {
					  console.log(txHash);
					});
			}catch(err){
				console.log(err)
				this.toggleError();
			}
	}

	//This should withdraw the LINK
	onWithDrawLINK = async (event) =>{
		try{	
			this.getAccounts();
			LinkPal.methods.withdrawLink().send({
					from: this.state.account
				}, 
				(error, txHash) => {
				console.log(txHash);
				});
		}catch(err){
			console.log(err)
			this.toggleError();
		}
	}

	toggleError = () => {
		this.setState((prevState, props) => {
		return { showError: true }
		})
    };
    
	async componentDidMount() {
		//this.loadBlockChain()
	}
	
    async componentWillMount(){
		this.loadBlockChain();
        this.loadChainlinkContract();
	}

    render(){
		return(  
          <DivWithErrorHandling showError={this.state.showError}>      
          <h5>View LinkPal contract details by address: </h5>
		  {/* <div className={classes}> */}
			<div >
				<Grid container  justify = "center" spacing={1} alignItems="flex-end">
				<Grid item> 
				<TextField
					onChange ={event => this.setState({ currentContract: event.target.value})}
					id="filled-textarea"
					label="LinkPal Contract Address"
					placeholder="eg. 0xae9b2cf719bf30f8024d29aae341dcb5e581b491"
					multiline
					style = {{width: 430}}
					margin="normal"
					variant="filled"
					/>
				</Grid>
				</Grid>          
			</div>
			<div >
				<Grid container  justify = "center" spacing={1} alignItems="flex-end">
					<Grid item>
					<br/>
					<Fab variant="extended" padding={5} onClick={this.loadLinkPalContract} aria-label="like">
					<NavigationIcon />
						Load Selected Contract
					</Fab>
					</Grid>
				</Grid>  
			</div>
			<div>
				<Table aria-label="simple table">
					<TableBody>                  
					<TableRow>
						<TableCell align="right"><b>Contract Address</b></TableCell>
						<TableCell align="right"> {this.state.currentContract} </TableCell>
					</TableRow> <TableRow>  
					<TableCell align="right"><b>ETH</b></TableCell>    
					<TableCell align="right"> {this.state.ethAmount} </TableCell>     
								</TableRow>         
					<TableRow>
					<TableCell align="right"><b>Invoice</b></TableCell>
						<TableCell align="right"> {"https://www.paypal.com/invoice/p/#" + this.state.invoice_id} </TableCell>
							</TableRow>    
					<TableRow> 
					<TableCell align="right"><b>Buyer Address</b></TableCell>
						<TableCell align="right"> {this.state.buyerAddress} </TableCell>
								</TableRow>    
					<TableRow>    
					<TableCell align="right"><b>Seller Address</b></TableCell>     
						<TableCell align="right"> {this.state.sellerAddress} </TableCell>
								</TableRow>    
					<TableRow>   
					<TableCell align="right"><b>Redeemed</b></TableCell>      
						<TableCell align="right"> {this.state.released.toString()} </TableCell>
								</TableRow>    
					<TableRow>
					<TableCell align="right"><b>Created</b></TableCell>
						<TableCell align="right"> {this.state.deploymentTime} </TableCell>
								</TableRow>    
					<TableRow>
					<TableCell align="right"><b>True Checks</b></TableCell>
						<TableCell align="right"> {this.state.trueCount} </TableCell>
								</TableRow>    
					<TableRow>
					<TableCell align="right"><b>False Checks</b></TableCell>
						<TableCell align="right"> {this.state.falseCount} </TableCell>    
								</TableRow>    
					</TableBody>
				</Table>
			</div>
			<div>
				<Grid container  justify = "center" spacing={1} alignItems="flex-end">
				<Grid item>
					<br/>
					<Fab variant="extended" padding={5} onClick={this.onClickFund} aria-label="like">
					<NavigationIcon />
					Deposit LINK
					</Fab>
					</Grid>
					<Grid item>
					<br/>
					<Fab variant="extended" padding={5} onClick={this.onClickConfirmPaid} aria-label="like">
					<NavigationIcon />
					Query Oracles
					</Fab>
					</Grid>
					<Grid item>
					<br/>
					<Fab variant="extended" padding={5} onClick={this.onWithDrawETH} aria-label="like">
					<NavigationIcon />
					Withdraw ETH
					</Fab>
					</Grid>
					<Grid item>
					<br/>
					<Fab variant="extended" padding={5} onClick={this.onWithDrawLINK} aria-label="like">
					<NavigationIcon />
					Withdraw LINK
					</Fab>
					</Grid>
				</Grid>            
			</div>
        	</DivWithErrorHandling>
        )
    }
 }