// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AccessControlLite {


    // State variables
    address public owner;

    mapping(address => bool) private admins;
    mapping(address => bool) private users;

    // Events
    event OwnerTransferred(address indexed previousOwner, address indexed newOwner);
    event AdminGranted(address indexed account);
    event AdminRevoked(address indexed account);
    event UserGranted(address indexed account);
    event UserRevoked(address indexed account);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "AccessControlLite: caller is not the owner");
        _;
    }

    modifier onlyAdminOrOwner() {
        require(
            msg.sender == owner || admins[msg.sender],
            "AccessControlLite: caller is not admin or owner"
        );
        _;
    }

    // Constructor
    constructor() {
        owner = msg.sender;
        emit OwnerTransferred(address(0), msg.sender);
    }

    // View functions

    // @notice Check if an address is an admin.
    function isAdmin(address account) external view returns (bool) {
        return admins[account];
    }

    /// @notice Check if an address is a user.
    function isUser(address account) external view returns (bool) {
        return users[account];
    }

    // Owner-only functions

    // @notice Transfer ownership of the contract.
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "AccessControlLite: new owner is zero address");
        address oldOwner = owner;
        owner = newOwner;
        emit OwnerTransferred(oldOwner, newOwner);
    }

    // @notice Grant admin role.
    function grantAdmin(address account) external onlyOwner {
        require(account != address(0), "AccessControlLite: zero address");
        require(!admins[account], "AccessControlLite: already admin");
        admins[account] = true;
        emit AdminGranted(account);
    }

    // @notice Revoke admin role.
    function revokeAdmin(address account) external onlyOwner {
        require(admins[account], "AccessControlLite: not admin");
        admins[account] = false;
        emit AdminRevoked(account);
    }

    // Admin or Owner functions

    // @notice Grant user role.
    function grantUser(address account) external onlyAdminOrOwner {
        require(account != address(0), "AccessControlLite: zero address");
        require(!users[account], "AccessControlLite: already user");
        users[account] = true;
        emit UserGranted(account);
    }

    // @notice Revoke user role.
    function revokeUser(address account) external onlyAdminOrOwner {
        require(users[account], "AccessControlLite: not user");
        users[account] = false;
        emit UserRevoked(account);
    }

    // Example protected function
 
    function protectedAction() external view returns (string memory) {
        require(users[msg.sender], "AccessControlLite: caller is not a user");
        return "Protected action executed";
    }
}
