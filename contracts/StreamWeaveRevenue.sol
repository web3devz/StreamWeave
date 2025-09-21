// FVM Smart Contract for Revenue Distribution
// Deployed on Filecoin Virtual Machine for automated payments

pragma solidity ^0.8.19;

// FEVM-compatible smart contract for StreamWeave
contract StreamWeaveRevenue {
    
    struct Stream {
        address streamer;
        uint256 totalRevenue;
        uint256 viewerCount;
        uint256 startTime;
        uint256 endTime;
        bool isActive;
        mapping(address => uint256) viewerPayments;
    }
    
    struct Creator {
        address wallet;
        uint256 totalEarnings;
        uint256 streamCount;
        uint256 subscriptionFee; // in FIL wei
        bool isVerified;
    }
    
    mapping(bytes32 => Stream) public streams;
    mapping(address => Creator) public creators;
    mapping(address => mapping(address => uint256)) public subscriptions; // viewer => creator => expiry
    
    // Platform fee (2.5%)
    uint256 public constant PLATFORM_FEE = 250; // 2.5% in basis points
    uint256 public constant BASIS_POINTS = 10000;
    
    address public owner;
    uint256 public totalPlatformFees;
    
    event StreamCreated(bytes32 indexed streamId, address indexed streamer, uint256 subscriptionFee);
    event PaymentReceived(bytes32 indexed streamId, address indexed viewer, uint256 amount);
    event RevenueDistributed(bytes32 indexed streamId, address indexed streamer, uint256 amount);
    event SubscriptionPurchased(address indexed viewer, address indexed creator, uint256 expiry);
    event CreatorVerified(address indexed creator);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyStreamer(bytes32 streamId) {
        require(streams[streamId].streamer == msg.sender, "Only streamer can call this function");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    // Register as a creator
    function registerCreator(uint256 _subscriptionFee) external {
        creators[msg.sender] = Creator({
            wallet: msg.sender,
            totalEarnings: 0,
            streamCount: 0,
            subscriptionFee: _subscriptionFee,
            isVerified: false
        });
    }
    
    // Verify creator (only owner)
    function verifyCreator(address _creator) external onlyOwner {
        require(creators[_creator].wallet != address(0), "Creator not registered");
        creators[_creator].isVerified = true;
        emit CreatorVerified(_creator);
    }
    
    // Create a new stream
    function createStream(bytes32 _streamId) external {
        require(creators[msg.sender].wallet != address(0), "Must be registered creator");
        require(!streams[_streamId].isActive, "Stream already exists");
        
        Stream storage newStream = streams[_streamId];
        newStream.streamer = msg.sender;
        newStream.totalRevenue = 0;
        newStream.viewerCount = 0;
        newStream.startTime = block.timestamp;
        newStream.isActive = true;
        
        creators[msg.sender].streamCount++;
        
        emit StreamCreated(_streamId, msg.sender, creators[msg.sender].subscriptionFee);
    }
    
    // End a stream and distribute revenue
    function endStream(bytes32 _streamId) external onlyStreamer(_streamId) {
        require(streams[_streamId].isActive, "Stream not active");
        
        Stream storage stream = streams[_streamId];
        stream.isActive = false;
        stream.endTime = block.timestamp;
        
        // Distribute revenue
        if (stream.totalRevenue > 0) {
            uint256 platformFee = (stream.totalRevenue * PLATFORM_FEE) / BASIS_POINTS;
            uint256 streamerRevenue = stream.totalRevenue - platformFee;
            
            totalPlatformFees += platformFee;
            creators[msg.sender].totalEarnings += streamerRevenue;
            
            // Transfer FIL to streamer
            payable(msg.sender).transfer(streamerRevenue);
            
            emit RevenueDistributed(_streamId, msg.sender, streamerRevenue);
        }
    }
    
    // Pay for stream access (per-view payment)
    function payForStream(bytes32 _streamId) external payable {
        require(streams[_streamId].isActive, "Stream not active");
        require(msg.value > 0, "Payment required");
        
        Stream storage stream = streams[_streamId];
        
        // Check if viewer has active subscription
        if (subscriptions[msg.sender][stream.streamer] > block.timestamp) {
            // Subscriber gets free access, refund payment
            payable(msg.sender).transfer(msg.value);
            return;
        }
        
        stream.totalRevenue += msg.value;
        stream.viewerPayments[msg.sender] += msg.value;
        stream.viewerCount++;
        
        emit PaymentReceived(_streamId, msg.sender, msg.value);
    }
    
    // Purchase subscription to creator
    function purchaseSubscription(address _creator, uint256 _months) external payable {
        require(creators[_creator].wallet != address(0), "Creator not found");
        require(_months > 0 && _months <= 12, "Invalid subscription duration");
        
        uint256 totalCost = creators[_creator].subscriptionFee * _months;
        require(msg.value >= totalCost, "Insufficient payment");
        
        // Calculate expiry (extend if already subscribed)
        uint256 currentExpiry = subscriptions[msg.sender][_creator];
        uint256 startTime = currentExpiry > block.timestamp ? currentExpiry : block.timestamp;
        uint256 newExpiry = startTime + (_months * 30 days);
        
        subscriptions[msg.sender][_creator] = newExpiry;
        
        // Distribute payment
        uint256 platformFee = (totalCost * PLATFORM_FEE) / BASIS_POINTS;
        uint256 creatorRevenue = totalCost - platformFee;
        
        totalPlatformFees += platformFee;
        creators[_creator].totalEarnings += creatorRevenue;
        
        // Transfer to creator
        payable(_creator).transfer(creatorRevenue);
        
        // Refund excess payment
        if (msg.value > totalCost) {
            payable(msg.sender).transfer(msg.value - totalCost);
        }
        
        emit SubscriptionPurchased(msg.sender, _creator, newExpiry);
    }
    
    // Check if viewer has access to stream
    function hasStreamAccess(bytes32 _streamId, address _viewer) external view returns (bool) {
        Stream storage stream = streams[_streamId];
        
        // Check subscription status
        if (subscriptions[_viewer][stream.streamer] > block.timestamp) {
            return true;
        }
        
        // Check if paid for this stream
        return stream.viewerPayments[_viewer] > 0;
    }
    
    // Get subscription status
    function getSubscriptionExpiry(address _viewer, address _creator) external view returns (uint256) {
        return subscriptions[_viewer][_creator];
    }
    
    // Get stream details
    function getStreamInfo(bytes32 _streamId) external view returns (
        address streamer,
        uint256 totalRevenue,
        uint256 viewerCount,
        uint256 startTime,
        uint256 endTime,
        bool isActive
    ) {
        Stream storage stream = streams[_streamId];
        return (
            stream.streamer,
            stream.totalRevenue,
            stream.viewerCount,
            stream.startTime,
            stream.endTime,
            stream.isActive
        );
    }
    
    // Get creator info
    function getCreatorInfo(address _creator) external view returns (
        uint256 totalEarnings,
        uint256 streamCount,
        uint256 subscriptionFee,
        bool isVerified
    ) {
        Creator storage creator = creators[_creator];
        return (
            creator.totalEarnings,
            creator.streamCount,
            creator.subscriptionFee,
            creator.isVerified
        );
    }
    
    // Update subscription fee
    function updateSubscriptionFee(uint256 _newFee) external {
        require(creators[msg.sender].wallet != address(0), "Creator not registered");
        creators[msg.sender].subscriptionFee = _newFee;
    }
    
    // Withdraw platform fees (only owner)
    function withdrawPlatformFees() external onlyOwner {
        require(totalPlatformFees > 0, "No fees to withdraw");
        uint256 amount = totalPlatformFees;
        totalPlatformFees = 0;
        payable(owner).transfer(amount);
    }
    
    // Emergency withdrawal (only owner)
    function emergencyWithdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
    
    // Update platform fee (only owner)
    function updatePlatformFee(uint256 _newFee) external onlyOwner {
        require(_newFee <= 1000, "Fee cannot exceed 10%");
        // Note: This would require a new deployment as fee is constant
        // Included for completeness in upgrade scenarios
    }
}