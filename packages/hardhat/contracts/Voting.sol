// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Voting {
    struct Proposal {
        string name;
        uint256 voteCount;
    }

    Proposal[] public proposals;
    mapping(address => bool) public hasVoted;

    event Voted(address indexed voter, uint256 indexed proposalId);

    constructor(string[] memory proposalNames) {
        require(proposalNames.length > 0, "No proposals");
        for (uint256 i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({name: proposalNames[i], voteCount: 0}));
        }
    }

    function vote(uint256 proposalId) external {
        require(!hasVoted[msg.sender], "Already voted");
        require(proposalId < proposals.length, "Invalid proposal");

        hasVoted[msg.sender] = true;
        proposals[proposalId].voteCount += 1;

        emit Voted(msg.sender, proposalId);
    }

    function getProposals() external view returns (Proposal[] memory) {
        return proposals;
    }

    function getWinner() external view returns (uint256 winnerId, string memory winnerName, uint256 winnerVotes) {
        uint256 winningVoteCount = 0;
        uint256 winningProposalId = 0;

        for (uint256 i = 0; i < proposals.length; i++) {
            if (proposals[i].voteCount > winningVoteCount) {
                winningVoteCount = proposals[i].voteCount;
                winningProposalId = i;
            }
        }

        winnerId = winningProposalId;
        winnerName = proposals[winningProposalId].name;
        winnerVotes = proposals[winningProposalId].voteCount;
    }
}