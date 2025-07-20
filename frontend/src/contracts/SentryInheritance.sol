// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title SentryInheritance
 * @author SentryWallet Team
 * @notice This contract manages the distribution of funds to designated nominees
 * after a recovery event is triggered by a trusted oracle. It acts as a simple,
 * on-chain digital will.
 * @dev The contract uses the Checks-Effects-Interactions pattern to prevent re-entrancy
 * attacks. The owner is immutable for gas optimization.
 */
contract SentryInheritance {
    // ==============================================================================
    // State Variables
    // ==============================================================================

    /// @notice The address of the contract creator and owner.
    address public immutable owner;

    /// @notice The address of the trusted entity that can trigger the recovery process.
    address public trustedOracle;

    /// @notice A mapping from a nominee's address to their percentage share of the funds.
    mapping(address => uint256) public nominees;

    /// @notice A mapping to track if a nominee has already claimed their funds.
    mapping(address => bool) public hasClaimed;

    /// @notice The sum of all nominee shares, cannot exceed 100.
    uint256 public totalShares;

    /// @notice A flag indicating if the recovery process has been initiated.
    bool public isRecoveryTriggered;

    // ==============================================================================
    // Modifiers
    // ==============================================================================

    /// @dev Throws if called by any account other than the owner.
    modifier onlyOwner() {
        require(msg.sender == owner, "SentryInheritance: Caller is not the owner");
        _;
    }

    /// @dev Throws if the recovery process has not been triggered yet.
    modifier recoveryHasBeenTriggered() {
        require(isRecoveryTriggered == true, "SentryInheritance: Recovery has not been triggered");
        _;
    }

    // ==============================================================================
    // Events
    // ==============================================================================

    /// @notice Emitted when a new nominee is set or an existing one is updated.
    /// @param nominee The address of the nominee.
    /// @param share The percentage share assigned to the nominee.
    event NomineeSet(address indexed nominee, uint256 share);

    /// @notice Emitted when a nominee is removed.
    /// @param nominee The address of the nominee being removed.
    event NomineeRemoved(address indexed nominee);

    /// @notice Emitted when the recovery process is triggered.
    /// @param triggeredBy The address of the trusted oracle that triggered the recovery.
    event RecoveryTriggered(address indexed triggeredBy);

    /// @notice Emitted when a nominee successfully claims their funds.
    /// @param nominee The address of the claimant.
    /// @param amountClaimed The amount of funds claimed (in Wei).
    event FundsClaimed(address indexed nominee, uint256 amountClaimed);

    // ==============================================================================
    // Constructor
    // ==============================================================================

    /// @notice Initializes the contract, setting the owner and trusted oracle.
    /// @dev The owner is set to the contract creator. For the demo, the trustedOracle
    /// is also set to the owner.
    constructor() {
        owner = msg.sender;
        trustedOracle = msg.sender; // For demo purposes
    }

    // ==============================================================================
    // Owner Functions
    // ==============================================================================

    /**
     * @notice Sets or updates a nominee's share percentage.
     * @dev Can only be called by the owner. The total shares of all nominees cannot exceed 100.
     * @param _nomineeAddress The address of the nominee.
     * @param _sharePercentage The percentage share to assign (e.g., 25 for 25%).
     */
    function setNominee(address _nomineeAddress, uint256 _sharePercentage) external onlyOwner {
        require(_nomineeAddress != address(0), "SentryInheritance: Nominee address cannot be the zero address");
        require(_sharePercentage > 0 && _sharePercentage <= 100, "SentryInheritance: Share must be between 1 and 100");

        uint256 oldShare = nominees[_nomineeAddress];
        totalShares -= oldShare;
        totalShares += _sharePercentage;

        require(totalShares <= 100, "SentryInheritance: Total shares cannot exceed 100");

        nominees[_nomineeAddress] = _sharePercentage;
        emit NomineeSet(_nomineeAddress, _sharePercentage);
    }

    /**
     * @notice Removes a nominee from the distribution plan.
     * @dev Can only be called by the owner.
     * @param _nomineeAddress The address of the nominee to remove.
     */
    function removeNominee(address _nomineeAddress) external onlyOwner {
        require(nominees[_nomineeAddress] > 0, "SentryInheritance: Nominee does not exist");

        totalShares -= nominees[_nomineeAddress];
        delete nominees[_nomineeAddress];

        emit NomineeRemoved(_nomineeAddress);
    }

    // ==============================================================================
    // Oracle Functions
    // ==============================================================================

    /**
     * @notice Triggers the recovery process, allowing nominees to claim funds.
     * @dev Can only be called by the trusted oracle. This is a one-time action.
     */
    function triggerRecovery() external {
        require(msg.sender == trustedOracle, "SentryInheritance: Caller is not the trusted oracle");
        require(!isRecoveryTriggered, "SentryInheritance: Recovery has already been triggered");

        isRecoveryTriggered = true;
        emit RecoveryTriggered(msg.sender);
    }

    // ==============================================================================
    // Nominee Functions
    // ==============================================================================

    /**
     * @notice Allows a registered nominee to claim their share of the contract's balance.
     * @dev Can only be called after the recovery process has been triggered.
     * Implements the Checks-Effects-Interactions pattern to prevent re-entrancy.
     */
    function claimFunds() external recoveryHasBeenTriggered {
        // --- Checks ---
        require(nominees[msg.sender] > 0, "SentryInheritance: You are not a registered nominee");
        require(!hasClaimed[msg.sender], "SentryInheritance: You have already claimed your funds");
        uint256 contractBalance = address(this).balance;
        require(contractBalance > 0, "SentryInheritance: No funds available to claim");

        // --- Effects ---
        uint256 amountToClaim = (contractBalance * nominees[msg.sender]) / 100;
        hasClaimed[msg.sender] = true; // Prevents re-entrancy

        // --- Interactions ---
        (bool success, ) = msg.sender.call{value: amountToClaim}("");
        require(success, "SentryInheritance: Fund transfer failed");

        emit FundsClaimed(msg.sender, amountToClaim);
    }

    // ==============================================================================
    // Receive Ether
    // ==============================================================================

    /// @notice Allows the contract to receive Ether (or tBDAG).
    receive() external payable {}
}
