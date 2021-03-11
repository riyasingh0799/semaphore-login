import {
    genExternalNullifier,
    genWitness,
    genProof,
    genPublicSignals,
    stringifyBigInts,
    genCircuit
  } from 'libsemaphore'
    
  const fetchWithoutCache = async (url) => {
    return await fetch(url, { cache: "no-store" });
  };

 const genAuth = async (
    externalNullifier,
    signalStr,
    identity,
    scContract,
    account
  ) => {
    const circuitUrl = "http://localhost:5000/circuit.json";
    console.log("Downloading circuit from ", circuitUrl);

    const cirDef = await (await fetchWithoutCache(circuitUrl)).json();
    const circuit = genCircuit(cirDef);    
    const provingKeyUrl = "http://localhost:5000/proving_key.bin";

    const provingKey = new Uint8Array(
      await (await fetch(provingKeyUrl)).arrayBuffer()
    );

    const leaves = await scContract.methods
        .getIDCommitments()
        .call({ from: account });
      console.log("Leaves:", leaves);  
  
    const t1 = performance.now()
    try {
      const { witness } = await genWitness(
        signalStr,
        circuit,
        identity,
        leaves,
        20,
        externalNullifier
      )
      // const genWitnessTime = ((performance.now() - t1) / 1000).toFixed(2)
    
      // const t2 = performance.now()
      // const proof = await genProof(witness, provingKey)
      // const publicSignals = genPublicSignals(witness, circuit)
      // const genProofTime = ((performance.now() - t2) / 1000).toFixed(2)
    
      // const requestData = {
      //   proof: JSON.stringify(stringifyBigInts(proof)),
      //   publicSignals: JSON.stringify(stringifyBigInts(publicSignals))
      // }
      // return requestData;
    }
    catch(e){
      console.log(e)
    }
    
  }
  
  export default genAuth
