// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Campaign {
    struct CampaignInfo {
        string title;
        string description;
        string imageHash;
        uint256 goal;
        uint256 deadline;
        string category;
        address creator;
        uint256 amountRaised;
        bool isActive;
        bool goalReached;
    }
    
    CampaignInfo public campaignInfo;
    mapping(address => uint256) public donations;
    address[] public donors;
    
    event DonationReceived(address indexed donor, uint256 amount);
    event FundsWithdrawn(address indexed creator, uint256 amount);
    event CampaignClosed(bool goalReached);
    
    modifier onlyCreator() {
        require(msg.sender == campaignInfo.creator, "Only creator can call this");
        _;
    }
    
    modifier campaignActive() {
        require(campaignInfo.isActive, "Campaign is not active");
        require(block.timestamp < campaignInfo.deadline, "Campaign has ended");
        _;
    }
    
    constructor(
        string memory _title,
        string memory _description,
        string memory _imageHash,
        uint256 _goal,
        uint256 _deadline,
        string memory _category,
        address _creator
    ) {
        campaignInfo = CampaignInfo({
            title: _title,
            description: _description,
            imageHash: _imageHash,
            goal: _goal,
            deadline: _deadline,
            category: _category,
            creator: _creator,
            amountRaised: 0,
            isActive: true,
            goalReached: false
        });
    }
    
    function donate() public payable campaignActive {
        require(msg.value > 0, "Donation must be greater than 0");
        
        if (donations[msg.sender] == 0) {
            donors.push(msg.sender);
        }
        
        donations[msg.sender] += msg.value;
        campaignInfo.amountRaised += msg.value;
        
        if (campaignInfo.amountRaised >= campaignInfo.goal) {
            campaignInfo.goalReached = true;
        }
        
        emit DonationReceived(msg.sender, msg.value);
    }
    
    function withdrawFunds() public onlyCreator {
        require(campaignInfo.amountRaised > 0, "No funds to withdraw");
        require(
            campaignInfo.goalReached || block.timestamp >= campaignInfo.deadline,
            "Cannot withdraw: goal not reached and campaign still active"
        );
        
        uint256 amount = campaignInfo.amountRaised;
        campaignInfo.amountRaised = 0;
        campaignInfo.isActive = false;
        
        payable(campaignInfo.creator).transfer(amount);
        emit FundsWithdrawn(campaignInfo.creator, amount);
        emit CampaignClosed(campaignInfo.goalReached);
    }
    
    function refund() public {
        require(!campaignInfo.goalReached, "Goal was reached, no refunds");
        require(block.timestamp >= campaignInfo.deadline, "Campaign still active");
        require(donations[msg.sender] > 0, "No donation to refund");
        
        uint256 amount = donations[msg.sender];
        donations[msg.sender] = 0;
        
        payable(msg.sender).transfer(amount);
    }
    
    function getCampaignDetails() public view returns (
        string memory title,
        string memory description,
        string memory imageHash,
        uint256 goal,
        uint256 deadline,
        string memory category,
        address creator,
        uint256 amountRaised,
        bool isActive,
        bool goalReached,
        uint256 donorCount
    ) {
        return (
            campaignInfo.title,
            campaignInfo.description,
            campaignInfo.imageHash,
            campaignInfo.goal,
            campaignInfo.deadline,
            campaignInfo.category,
            campaignInfo.creator,
            campaignInfo.amountRaised,
            campaignInfo.isActive,
            campaignInfo.goalReached,
            donors.length
        );
    }
    
    function getDonors() public view returns (address[] memory) {
        return donors;
    }
    
    function getDonation(address donor) public view returns (uint256) {
        return donations[donor];
    }
}