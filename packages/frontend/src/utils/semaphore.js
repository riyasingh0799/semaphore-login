import {
    genExternalNullifier,
    genWitness,
    genProof,
    genPublicSignals,
    stringifyBigInts,
    genCircuit,
    genIdentityCommitment,
    genTree
  } from 'libsemaphore'
      
  const fetchWithoutCache = async (url) => {
    return await fetch(url, { cache: "no-store" });
  };

 const genAuth = async (
    externalNullifier,
    signalStr,
    identity,
    scContract,
    account,
  ) => {
    const circuitUrl = "http://localhost:5000/circuit.json";
    console.log("Downloading circuit from ", circuitUrl);

    const cirDef = await (await fetchWithoutCache(circuitUrl)).json();
    const circuit = genCircuit(cirDef);    
    const provingKeyUrl = "http://localhost:5000/proving_key.bin";
    console.log("Downloading provingkey from ", provingKeyUrl);

    const provingKey = new Uint8Array(
      await (await fetch(provingKeyUrl)).arrayBuffer()
    );

    const leaves = await scContract.methods
        .getIDCommitments()
        .call({ from: account });
      console.log("Leaves:", leaves);  

    const res = await genWitness(
        signalStr,
        circuit,
        identity,
        leaves,
        20,
        externalNullifier,
      )
      console.log(res)
    
  }
  
  export default genAuth
