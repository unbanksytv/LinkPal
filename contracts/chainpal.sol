pragma solidity 0.4.24;
pragma experimental ABIEncoderV2;

import "https://github.com/thodges-gh/chainlink/evm/contracts/ChainlinkClient.sol";
import "https://github.com/thodges-gh/chainlink/evm/contracts/vendor/Ownable.sol";

//SafeMath library to perform safe arithmetic operations
library SafeMath {

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");
        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return sub(a, b, "SafeMath: subtraction overflow");
    }

    function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        uint256 c = a - b;
        return c;
    }

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
        if (a == 0) {
            return 0;
        }
        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");
        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return div(a, b, "SafeMath: division by zero");
    }

    function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        // Solidity only automatically asserts when dividing by 0
        require(b > 0, errorMessage);
        uint256 c = a / b;
        return c;
    }
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        return mod(a, b, "SafeMath: modulo by zero");
    }
    function mod(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b != 0, errorMessage);
        return a % b;
    }
}

//Proxy Contract to test functions without Link Interferance
contract ChainPal is ChainlinkClient, Ownable{

    //Set the payment as one Oracle time the amount of link the contract has I Believe?
    uint256 constant private ORACLE_PAYMENT = 1 * LINK;
    bool public released;
    uint8 public trueCount;
    uint8 public falseCount;
    //These must all be set on creation
    string public invoiceID;
    address public sellerAddress;
    address public buyerAddress;
    uint256 public amount;

    //Arrays 1:1 of Oracales and the corresponding Jobs IDs in those oracles
    string[] public jobIds;
    address[] public oracles;
    bool public returnedPinged;
    constructor(
        string _invoiceID,
        address  _sellerAddress,
        address  _buyerAddress,
        uint256  _amount,
        string[] _jobIds,
        address[] _oracles
    )public Ownable{
        trueCount = 0;
        falseCount = 0;
        released = false;
        invoiceID = _invoiceID;
        sellerAddress = _sellerAddress;
        buyerAddress = _buyerAddress;
        amount = _amount;
        jobIds = _jobIds;
        oracles = _oracles;
        setPublicChainlinkToken();
    }
    
    //modifier to only allow buyers to access functions
    modifier onlyBuyer(){
        require(buyerAddress == msg.sender,"Unauthorised , must be Buyer");
        _;
    }

    //Might Encounter ORACLE_PAYMENT problems with more than one oracle 
    //Needs more testing
    function requestConfirmations()
    public 
    onlyBuyer{
        //Loop to iterate through all the responses from different nodes
        //for(uint i = 0; i < oracles.length; i++){
        //Putting this in a for loop 
        uint i = 0;
        Chainlink.Request memory req = buildChainlinkRequest(stringToBytes32(jobIds[i]), this, this.fulfillNodeRequest.selector);
        req.add("invoice_id", invoiceID);
        //req.add("path", "result.data.paid");
        sendChainlinkRequestTo(oracles[i], req, ORACLE_PAYMENT);
        //}
    }

    //This should fulfill the node request
    function fulfillNodeRequest(bytes32 _requestId, bool paid)
    public
    recordChainlinkFulfillment(_requestId)
    {
        returnedPinged = paid;
        //emit NodeRequestFulfilled(_requestId, _output);
        //Append to these to calculate if the funds should be released
        /*
        if(keccak256(abi.encodePacked((paid))) == keccak256(abi.encodePacked(("true")))){
            //Invoice Paid
            trueCount += 1;
        }else if (keccak256(abi.encodePacked((paid))) == keccak256(abi.encodePacked(("false")))){
            //Invoice Not Paid Yet
            falseCount +=1;
        }else{
            //Just Ignore it, Oracle is most probably down
        }
        */
    }

    function releaseFunds() public onlyOwner{
        if(trueCount > falseCount){
            released = true;
        }else{
            //Reset them to 0 to be able to safely re run the oracles
            trueCount = 0;
            falseCount = 0;
        }
    }

    //Return the released funds to be checked by Factory Contract
    function getReleased() public view returns(bool){
        return released;
    }

    //Return the address of the Seller of the contract
    function getSeller() public view returns(address){
        return sellerAddress;
    }

    //Return the address of the Seller of the contract
    function getBuyer() public view returns(address){
        return buyerAddress;
    }

    function getChainlinkToken() public view returns (address) {
        return chainlinkTokenAddress();
    }

    function getAmount() public view returns(uint256){
        return amount;
    }

    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(link.transfer(msg.sender, link.balanceOf(address(this))), "Unable to transfer");
    }

    //Idk what this is going to be used for.
    function stringToBytes32(string memory source) private pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
          return 0x0;
        }
        //Or this
        assembly { // solhint-disable-line no-inline-assembly
          result := mload(add(source, 32))
        }    
    }
}

contract ChainPalFactory{
    //Using OpenZepplins SafeMath Library for safe math information
    using SafeMath for uint256;
    //address[] public LinkPalAddresses;
    mapping (address => address[]) public LinkPalAddresses;
    /*Solidity Functions*/
    mapping (address => uint256) public  balances;
    mapping (address => uint256) public  lockedBalances;
    mapping (address => bool) public  locks;

    function deposit() public payable {
        require(msg.value > 0);
        balances[msg.sender] = SafeMath.add(msg.value,balances[msg.sender]);
    }
    
    function withdrawEth(uint256 _amount) public{
        require(_amount > 0);
        require(balances[msg.sender] >=  _amount);
        
        msg.sender.transfer(_amount);
        balances[msg.sender] =  SafeMath.sub(balances[msg.sender],_amount);
    }
    
    //Need to figure out parameters 
    //Link, Address To, ETH amount, Lock that amount of ETH
    //Specify the chainlink node and job too
    function createLinkPal(
        string _invoiceID,
        address  _buyerAddress,
        uint256  _amount,
        string[] _jobIds,
        address[] _oracles
    ) public payable{
        //Probably need more requirement checks
        require(balances[msg.sender] > 0);
        ChainPal LinkPalAddress = new ChainPal(
             _invoiceID,
            msg.sender,
            _buyerAddress,
            _amount,
            _jobIds,
            _oracles
        );

        //Sub from balance
        balances[msg.sender] = SafeMath.sub(balances[msg.sender],_amount);
        //Add to locked balance inaccessible to users
        lockedBalances[msg.sender] = SafeMath.add(lockedBalances[msg.sender],_amount);
        //If it didn't fail Lock that much into a balance
        LinkPalAddresses[msg.sender].push(LinkPalAddress);
        //Emit an event here
    }

    //This function will be used to cancel the ETH transaction
    //Both parties must click it to be able to retrieve the ETH from the locked balance
    //Or a confirmation from the node that the paypal invoice was cancelled.
    function cancelETH() public{

    }

    //Function to just release funds to the seller immediately and transfer to their balance
    function releaseFundsImmediately(address _ChainPalAddress) public{
        address tempSellerAddress = ChainPal(_ChainPalAddress).getSeller();
        address tempBuyerAddress = ChainPal(_ChainPalAddress).getBuyer();
        uint256 lockedBalance = ChainPal(_ChainPalAddress).getAmount();
        //Only Seller is required to transfer the funds
        require(tempSellerAddress == msg.sender,"User doesn't have given contract address deployed under it");
        require(lockedBalances[tempBuyerAddress] >= lockedBalance, "Locked Balance According to contract is incorrect");

        //Remove that amount of locked balance from the buyer
        lockedBalances[tempBuyerAddress] = SafeMath.sub(lockedBalances[tempBuyerAddress], lockedBalance);

        //Add the locked balance to the actual balance of the buyer
        balances[tempBuyerAddress] = SafeMath.add(balances[tempBuyerAddress],lockedBalance);
    }

    //This function is used to retrieve and verify that the paypal transaction went through,
    //Then Send the money back to the user.
    function unlockETH(address _ChainPalAddress) public{
        require(ChainPal(_ChainPalAddress).getReleased() == true, "Funds aren't released for this contract address");
        //Add the locked amount to the senders balance
        balances[msg.sender] = SafeMath.add(balances[msg.sender],lockedBalances[msg.sender]);
        //Set the locked balance to 0 for the message sender
        lockedBalances[msg.sender] = 0;
    }
}
