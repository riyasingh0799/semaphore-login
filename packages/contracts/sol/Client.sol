pragma solidity ^0.5.0;

import { Semaphore } from './Semaphore.sol';
import "./Ownable.sol";

contract Client is Ownable {

    uint256[] identityCommitments;
    
    mapping(uint256 => uint256) public indexToIDCommitment;

    uint256[] public pendingRegistrationRequests;

    mapping(uint256 => bool) public registrationRequestExists;

    uint256 public totalPendingRegistrationRequests = 0;
    
    mapping(uint232 => mapping(uint256 => bool)) public signupRequestExists;

    mapping(uint256 => uint256) enToTotalPendingSignupRequests;

    mapping(uint232 => mapping(uint256 => uint256)) public enToIndexToPendingSignupRequests;

    mapping(uint232 => uint256) public externalNullifierToCreatorID; 

    mapping(uint256 => bool) public registeredUser;

    mapping(uint256 => mapping(uint256 => Challenge)) public identityCommitmentToindexToChallenge;

    mapping(uint232 => mapping(uint256 => bool)) public signedUp;

    // request to add ID (after successful KYC)
    Semaphore public semaphore;

    struct Challenge{
        uint232 externalNullifier;
        string challenge;
        bool solved;
    }
     constructor(Semaphore _semaphore) public {
        semaphore = _semaphore;
    }
    function insertIdentity(uint256 _leaf) private{
        semaphore.insertIdentity(_leaf);
        identityCommitments.push(_leaf);
    }

    function insertIdentityCA(uint256 _leaf) public onlyOwner{
        semaphore.insertIdentity(_leaf);
        identityCommitments.push(_leaf);
    }

    function getIDCommitment(uint256 index) public view returns(uint256){
        return indexToIDCommitment[index];
    }

    function getIDCommitments() public view returns(uint256[] memory) {
        return identityCommitments;
    }
 
    function requestRegistration(uint256 _identityCommitment) public returns (uint256){
        require(isOwner() == false, "CA cannot register");
        require(registrationRequestExists[_identityCommitment] == false, "Request already exists");
        registrationRequestExists[_identityCommitment]=true;
        pendingRegistrationRequests.push(_identityCommitment);
        totalPendingRegistrationRequests++;
        return totalPendingRegistrationRequests-1;
    }

    function approveRegistrationRequest(uint256 index) public onlyOwner{
        insertIdentity(pendingRegistrationRequests[index]);
        registrationRequestExists[pendingRegistrationRequests[index]]=false;
        registeredUser[pendingRegistrationRequests[index]]=true;

    }


    function approveAllRegistrationRequests() public onlyOwner{

    for (uint256 i=0; i<totalPendingRegistrationRequests; i++) {
        approveRegistrationRequest(i);
        }
    totalPendingRegistrationRequests = 0;
    
    }

    function denyRegistrationRequest(uint256 index) public onlyOwner{
        registrationRequestExists[pendingRegistrationRequests[index]]=false;
        registeredUser[pendingRegistrationRequests[index]]=true;
    }

    function resetRegistrationRequestsNum() public onlyOwner{
    }

    function removeIdentity(uint256 _identityCommitment) public onlyOwner{
        registeredUser[_identityCommitment]= false;
    }

    function addExternalNullifier(uint232 _externalNullifier, uint256 _identityCommitment) public {
        semaphore.addExternalNullifier(_externalNullifier);
        externalNullifierToCreatorID[_externalNullifier] = _identityCommitment;
    }

    function requestSignup(uint232 _externalNullifier, uint256 _identityCommitment) public returns (uint256){
        require(externalNullifierToCreatorID[_externalNullifier] != _identityCommitment, "user is the external nullifier owner");
        // require(semaphore.isExternalNullifierActive(_externalNullifier), "EN is inactive");
        require(signedUp[_externalNullifier][_identityCommitment]==false, "Already signed up");
        require(signupRequestExists[_externalNullifier][_identityCommitment]==false, "Already requested");
        enToIndexToPendingSignupRequests[_externalNullifier][enToTotalPendingSignupRequests[_externalNullifier]]=_identityCommitment;
        enToTotalPendingSignupRequests[_externalNullifier]++;
        signupRequestExists[_externalNullifier][_identityCommitment] = true;
        return (enToTotalPendingSignupRequests[_externalNullifier]-1);
    }

    function getTotalPendingSignupRequests(uint232 _externalNullifier, uint256 _senderID) public view returns(uint256) {
        require(externalNullifierToCreatorID[_externalNullifier] == _senderID, "You don't have access to this info.");
        return enToTotalPendingSignupRequests[_externalNullifier];
    }

    function resetSignupRequestsNum(uint232 _externalNullifier, uint256 _senderID) public {
        require(externalNullifierToCreatorID[_externalNullifier] == _senderID, "You don't have access to this function.");
        enToTotalPendingSignupRequests[_externalNullifier] = 0;
    }
    function signupAccept(uint232 _externalNullifier, uint256 _identityCommitment) public {
        signedUp[_externalNullifier][_identityCommitment] = true;
        signupRequestExists[_externalNullifier][_identityCommitment] = false;
    }

    function signupDecline(uint232 _externalNullifier, uint256 _identityCommitment) public {
        signupRequestExists[_externalNullifier][_identityCommitment] = false;
    }
}
