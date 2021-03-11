const getContractInstance = async (web3, abi, address) => {
    // get network ID and the deployed address

    const networkId = await web3.eth.net.getId()
    const deployedAddress = address
    // create the instance
    const instance = new web3.eth.Contract(abi, deployedAddress)
    return instance
  }
  
  export default getContractInstance