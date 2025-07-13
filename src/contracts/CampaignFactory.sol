// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Campaign.sol";

contract CampaignFactory {
    address[] public deployedCampaigns;
    mapping(address => address[]) public creatorCampaigns;
    
    event CampaignCreated(
        address indexed campaignAddress,
        address indexed creator,
        string title,
        uint256 goal,
        uint256 deadline
    );
    
    function createCampaign(
        string memory _title,
        string memory _description,
        string memory _imageHash,
        uint256 _goal,
        uint256 _deadline,
        string memory _category
    ) public {
        require(_goal > 0, "Goal must be greater than 0");
        require(_deadline > block.timestamp, "Deadline must be in the future");
        
        Campaign newCampaign = new Campaign(
            _title,
            _description,
            _imageHash,
            _goal,
            _deadline,
            _category,
            msg.sender
        );
        
        address campaignAddress = address(newCampaign);
        deployedCampaigns.push(campaignAddress);
        creatorCampaigns[msg.sender].push(campaignAddress);
        
        emit CampaignCreated(
            campaignAddress,
            msg.sender,
            _title,
            _goal,
            _deadline
        );
    }
    
    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
    
    function getCampaignsByCreator(address creator) public view returns (address[] memory) {
        return creatorCampaigns[creator];
    }
    
    function getCampaignsCount() public view returns (uint256) {
        return deployedCampaigns.length;
    }
}