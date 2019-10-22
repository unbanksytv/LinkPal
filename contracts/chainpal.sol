pragma solidity 0.4.24;

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
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

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

contract ChainPal is ChainlinkClient, Ownable{
    
    /*ChainLink Functions*/
    uint256 constant private ORACLE_PAYMENT = 1 * LINK;
    uint256 public currentPrice;
    int256 public changeDay;
    bytes32 public lastMarket;
    
    event RequestEthereumPriceFulfilled(
        bytes32 indexed requestId,
        uint256 indexed price
    );
    
    event RequestEthereumChangeFulfilled(
        bytes32 indexed requestId,
        int256 indexed change
    );
    
    event RequestEthereumLastMarket(
        bytes32 indexed requestId,
        bytes32 indexed market
    );
    
    address public sellerAddress;
    address public buyerAddress;
    uint256 public amount;
    string public url;
    
    constructor(address _sellerAddress, address _buyerAddress, uint256 _amount, string _url) public payable Ownable() {
        
        sellerAddress = _sellerAddress;
        buyerAddress  = _buyerAddress;
        amount        = _amount;
        url           = _url;
        
        setPublicChainlinkToken();
    }
    
    function requestEthereumPrice(address _oracle, string _jobId)
    public
    onlyOwner
    {
        Chainlink.Request memory req = buildChainlinkRequest(stringToBytes32(_jobId), this, this.fulfillEthereumPrice.selector);
        req.add("get", "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD");
        req.add("path", "USD");
        req.addInt("times", 100);
        sendChainlinkRequestTo(_oracle, req, ORACLE_PAYMENT);
    }
    
    function requestEthereumChange(address _oracle, string _jobId)
    public
    onlyOwner
    {
        Chainlink.Request memory req = buildChainlinkRequest(stringToBytes32(_jobId), this, this.fulfillEthereumChange.selector);
        req.add("get", "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD");
        req.add("path", "RAW.ETH.USD.CHANGEPCTDAY");
        req.addInt("times", 1000000000);
        sendChainlinkRequestTo(_oracle, req, ORACLE_PAYMENT);
    }
    
    function requestEthereumLastMarket(address _oracle, string _jobId)
    public
    onlyOwner
    {
        Chainlink.Request memory req = buildChainlinkRequest(stringToBytes32(_jobId), this, this.fulfillEthereumLastMarket.selector);
        req.add("get", "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD");
        string[] memory path = new string[](4);
        path[0] = "RAW";
        path[1] = "ETH";
        path[2] = "USD";
        path[3] = "LASTMARKET";
        req.addStringArray("path", path);
        sendChainlinkRequestTo(_oracle, req, ORACLE_PAYMENT);
    }
    
    function fulfillEthereumPrice(bytes32 _requestId, uint256 _price)
    public
    recordChainlinkFulfillment(_requestId)
    {
        emit RequestEthereumPriceFulfilled(_requestId, _price);
        currentPrice = _price;
    }
    
    function fulfillEthereumChange(bytes32 _requestId, int256 _change)
    public
    recordChainlinkFulfillment(_requestId)
    {
        emit RequestEthereumChangeFulfilled(_requestId, _change);
        changeDay = _change;
    }
    
    function fulfillEthereumLastMarket(bytes32 _requestId, bytes32 _market)
    public
    recordChainlinkFulfillment(_requestId)
    {
        emit RequestEthereumLastMarket(_requestId, _market);
        lastMarket = _market;
    }
    
    function getChainlinkToken() public view returns (address) {
        return chainlinkTokenAddress();
    }
    
    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(link.transfer(msg.sender, link.balanceOf(address(this))), "Unable to transfer");
    }
    
    function stringToBytes32(string memory source) private pure returns (bytes32 result) {
    bytes memory tempEmptyStringTest = bytes(source);
    if (tempEmptyStringTest.length == 0) {
      return 0x0;
    }
    
    assembly { // solhint-disable-line no-inline-assembly
      result := mload(add(source, 32))
    }
    
    }
}

//Proxy Contract to test functions without Link Interferance
contract proxyContract{

}

contract ChainPalFactory {
    //Using OpenZepplins SafeMath Library for safe math information
    using SafeMath for uint256;
    address[] LinkPalAddresses;
    
    /*Solidity Functions*/
    mapping (address => uint256) public  _balances;
    mapping (address => uint256) public  _lockedBalances;
    mapping (address => bool) public  _locks;

    function deposit() public payable {
        require(msg.value > 0);
        _balances[msg.sender] = SafeMath.add(msg.value,_balances[msg.sender]);
    }
    
    function withdrawEth(uint256 _amount) public{
        require(_amount > 0);
        require(_balances[msg.sender] >=  _amount);
        
        msg.sender.transfer(_amount);
        _balances[msg.sender] =  SafeMath.sub(_balances[msg.sender],_amount);
    }
    
    //Need to figure out parameters 
    //Link, Address To, ETH amount, Lock that amount of ETH
    //Specify the chainlink node and job too
    function createLinkPal(address _buyerAddress, uint256 _amount, string _url) public payable{
        require(_balances[msg.sender] > 0);
        LinkPal LinkPalAddress = new LinkPal(msg.sender, _buyerAddress, _amount, _url);
        //Sub from balance
        _balances[msg.sender] = SafeMath.sub(_balances[msg.sender],_amount);
        //Add to locked balance inaccessible to users
        _lockedBalances[msg.sender] = SafeMath.add(_lockedBalances[msg.sender],_amount);
        //If it didn't fail Lock that much into a balance
        LinkPalAddresses.push(LinkPalAddress);
        //Emit an event here
    }
    
    //This function will be used to cancel the ETH transaction
    //Both parties must click it to be able to retrieve the ETH from the locked balance
    //Or a confirmation from the node that the paypal invoice was cancelled.
    function cancelETH(){
        
    }
    
    //This function is used to retrieve and verify that the paypal transaction went through,
    //Then Send the money back to the user.
    function unlockETH() internal{
 
    }
    
    //Functions Needed
    //Lock ETH
    //Unlock ETH
    //Transfer ETH
    
}
