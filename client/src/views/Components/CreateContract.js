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

const rows = [
  createData('Simply', '0x0D31C381c84d94292C07ec03D6FeE0c1bD6e15c1', '9e077ffec34b413b9622f9b21f028c49'),
  createData('Simply', '0x0D31C381c84d94292C07ec03D6FeE0c1bD6e15c1', '5fb4251ba8eb499985d16d69a5eb0060'),
  createData('Simply', '0x0D31C381c84d94292C07ec03D6FeE0c1bD6e15c1', '2db38c41e52b48a99d5d624f9dca8568'),
  createData('Simply', '0x0D31C381c84d94292C07ec03D6FeE0c1bD6e15c1', '95317cc69a3c489fbd053aeec25de5d8'),
  createData('Simply', '0x0D31C381c84d94292C07ec03D6FeE0c1bD6e15c1', 'd88e8aa945ec44dcb4e573265c7ba28b'),
];


const withErrorHandling = WrappedComponent => ({ showError, children }) => {
  return (
    <WrappedComponent>
      {showError && <div className="error-message">Oops! Something went wrong! Install MetaMask or try again.</div>}
      {children}
    </WrappedComponent>
  );
};


//var web3 = new Web3();
//const web3 = new Web3(window.web3.currentProvider); //Use provider from MetaMask
var web3;

const DivWithErrorHandling = withErrorHandling(({children}) => <div>{children}</div>)

const abiFactory = [
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
	},
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
	}
];

function createData(operator, oracle, job) {
  return { operator, oracle, job };
};

var LinkPalFactory;


export default class ContractInteraction extends React.Component {
	  	
	state ={
		account : '',
		eth_amount: null,
		invoice_id: '',
		eth_address: '',
		options:[],	
		oracles : [],
		job_ids : [],
		oracleCount: 0,
		showError:false,
		loading: false,
		createDisabled: false,
		createBtnMessage: 'Submit contract',
		newLinkPalAddress: null
	};
	
	
 getAccounts = () =>{
	web3.eth.getAccounts().then(accounts => { 
			
		this.setState({ account: accounts[0]});
		console.log(accounts);
	
	});}

	//Loads the web3 Metamask confirmations and Checks for Events
	async loadBlockChain() {
		//this.props.toggleNextEnabled();
	
		// Modern DApp Browsers
		if (window.ethereum) {
			web3 = new Web3(window.ethereum);
			try { 
				window.ethereum.enable().then(function() {
				this.getAccounts();

					//Set State When recieve Emission from Event from Smart Contract
					LinkPalFactory = new web3.eth.Contract(abiFactory, contractFactoryAddress);

					LinkPalFactory.events.contractDeployed(function(error, result){
						if (!error){
							var LinkPalAddress = result.returnValues.LinkPalAddress;
							this.setState({ newLinkPalAddress: LinkPalAddress });
							this.props.createHandler(LinkPalAddress,this.state.oracleCount);
							this.props.toggleNextEnabled();
						} else {
							console.log(error);
						}
						
					}.bind(this));
				}.bind(this));	
			} catch(e) {
			// User has denied account access to DApp...
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
	
	toggleError = () => {
		this.setState((prevState, props) => {
		return { showError: true }
		})
	};

	handleChangeChk(e) {
		// current array of options
		const options = this.state.options
		let index

		// check if the check box is checked or unchecked
		if (e.target.checked) {
		// add the numerical value of the checkbox to options array
		options.push(+e.target.value)
		} else {
		// or remove the value from the unchecked checkbox from the array
		index = options.indexOf(+e.target.value)
		options.splice(index, 1)
		}
		
		// update the state with the new array of options
		this.setState({ options: options })
	}

	async componentWillMount() {
		this.loadBlockChain()
	}

	
	onSubmit = async (event) =>{
		var oracles = []
		var job_ids = []
		for (let i = 0; i < this.state.options.length; i++) {
				oracles.push(rows[this.state.options[i]].oracle);
				job_ids.push(rows[this.state.options[i]].job);
		}		

		event.preventDefault();
		this.setState({ oracleCount: oracles.length, loading: true, errorMessage: ''});

		try{	
			console.log('Get all accounts')
			console.log('CHECK THIS CONSOLE')
			this.setState({ loading: false, createDisabled:true, createBtnMessage:'Processing...'});
			await LinkPalFactory.methods.createLinkPal(this.state.invoice_id, this.state.eth_address, job_ids, oracles).send({from:this.state.account,value:web3.utils.toWei(this.state.eth_amount,'ether')});
			
		}catch(err){
			console.log(err)
			this.toggleError();
		}

			// this.setState({createBtnMessage:'Complete'});
		// const accounts = await web3.eth.getAccounts();
		// const driverCd = await factory.methods.getDeployedContract(this.state.driver).call();
	}

    render(){
		return(  
          <DivWithErrorHandling showError={this.state.showError}>      
          <h5>Enter the details required for creating a LinkPal contract: </h5>
          {/* <div className={classes}> */}
          <div >
            <Grid container  justify = "center" spacing={1} alignItems="flex-end">
              <Grid item>
              <TextField
                  onChange ={event => this.setState({ eth_amount: event.target.value})}
                  id="filled-textarea"
                  label="ETH Amount"
                  placeholder="eg. 1.234"
                  multiline
                  style = {{width: 430}}
                  margin="normal"
                  variant="filled"
                />
              </Grid>
            </Grid>            
          </div>
          <div>
            <Grid container  justify = "center" spacing={1} alignItems="flex-end">
              <Grid item> 
              <TextField
                  onChange ={event => this.setState({ invoice_id: event.target.value})}
                  id="filled-textarea"
                  label="Paypal Invoice ID"
                  placeholder="eg. ABCDEFGHIC9BJR2Y"
                  multiline
                  style = {{width: 430}}
                  margin="normal"
                  variant="filled"
                />
              </Grid>
            </Grid>            
          </div>
          <div>
            <Grid container  justify = "center" spacing={1} alignItems="flex-end">
              <Grid item>
              <TextField
                  onChange ={event => this.setState({ eth_address: event.target.value})}
                  id="filled-textarea"
                  label="Buyer ETH Address"
                  placeholder="eg. 0xA1B2C3D4E5F6G..."
                  multiline
                  style = {{width: 430, paddingBottom: 20}}
                  margin="normal"
                  variant="filled"
                />
              </Grid>
            </Grid>            
          </div>
          <div>
          {/* <h5>Select 1 or more PayPal oracle providers (each oracle request will cost 0.2 LINK): </h5> */}
          <h5>Select 1 or more PayPal oracle providers: </h5>
            <Grid container  justify = "center" spacing={1} alignItems="flex-end">
              <Grid item>
                
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                  <TableCell></TableCell>
                    <TableCell><b>Operator</b></TableCell>
                    <TableCell align="right"><b>Oracle</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row,index) => (                    
                    <TableRow>
                        <TableCell padding="checkbox">
                        <Checkbox value={index} onChange={event => this.handleChangeChk(event)}  />
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.operator}
                      </TableCell>
                      <TableCell align="right">{row.oracle}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </Grid>
            </Grid>            
          </div>
          <div>
            <Grid container  justify = "center" spacing={1} alignItems="flex-end">
              <Grid item>
              <br/>
              <Fab variant="extended" padding={5} 
                disabled={this.state.createDisabled} onClick={this.onSubmit} aria-label="like">
                <NavigationIcon />
                {this.state.createBtnMessage}
              </Fab>
              </Grid>
            </Grid>            
          </div>
		</DivWithErrorHandling>
        )
    }
 }