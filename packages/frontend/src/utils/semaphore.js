import {
    genExternalNullifier,
    genWitness,
    genProof,
    genPublicSignals,
    stringifyBigInts,
    genCircuit,
    genIdentityCommitment,
    genTree,
    genSignedMsg
  } from 'libsemaphore'

  const execute = (cmd) => {
    const result = shell.exec(cmd, { silent: false })
    if (result.code !== 0) {
        throw 'Error executing ' + cmd
    }

    return result
  }

  const keccak256 = require('keccak256')
  var bigInt = require("big-integer");

  const fetchWithoutCache = async (url) => {
    return await fetch(url, { cache: "no-store" });
  };

//   const genIDpath = async (
//     signal,
//     circuit,
//     identity,
//     leaves,
//     treeDepth=20,
//     externalNullifier) => {

//     // convert idCommitments
//     const idCommitmentsAsBigInts = []
//     for (let idc of leaves) {
//         idCommitmentsAsBigInts.push(BigInt(idc.toString()))
//     }

//     const identityCommitment = genIdentityCommitment(identity)
//     const index = idCommitmentsAsBigInts.indexOf(identityCommitment)
//     console.log("index: "+ index)
//     const tree = await genTree(treeDepth, leaves)
//     if(tree)
//       console.dir(tree)

//     const identityPath = await tree.path(index)
//     if(identityPath)
//       console.dir(identityPath)
    
//     const identityPathElements = identityPath.path_elements;

//     const identityPathIndex = identityPath.path_index;

//     // return {identityPathElements, identityPathIndex}

//     const sighash = keccak256(signal).toString('hex');
//     const signalHash = new bigInt(sighash, 16)

//     const { signature, msg } = genSignedMsg(
//         identity.keypair.privKey,
//         externalNullifier,
//         signalHash)

//         const params = { 'identity_pk[0]': identity.keypair.pubKey[0],
//         'identity_pk[1]': identity.keypair.pubKey[1],
//         'auth_sig_r[0]': signature.R8[0],
//         'auth_sig_r[1]': signature.R8[1],
//         auth_sig_s: signature.S,
//         signal_hash: signalHash,
//         external_nullifier: externalNullifier,
//         identity_nullifier: identity.identityNullifier,
//         identity_trapdoor: identity.identityTrapdoor,
//         identity_path_elements: identityPathElements,
//         identity_path_index: identityPathIndex,
//         fake_zero: bigInt(0)}
//         console.log(params)

//         // shell.env.identity_pk_0 = String(identity.keypair.pubKey[0])
//         // shell.env.identity_pk_1 = String(identity.keypair.pubKey[1])
//         // shell.env.auth_sig_r_0 = String(signature.R8[0])
//         // shell.env.auth_sig_r_1 = String(signature.R8[1])
//         // shell.env.auth_sig_s= String(signature.S,)
//         // shell.env.signal_hash= String(signalHash),
//         // shell.env.external_nullifier= String(externalNullifier),
//         // shell.env.identity_nullifier= String(identity.identityNullifier),
//         // shell.env.identity_trapdoor= String(identity.identityTrapdoor),
//         // shell.env.identity_path_elements= Array(identityPathElements),
//         // shell.env.identity_path_index= Array(identityPathIndex),
//         // shell.env.fake_zero= String(BigInt(0))

//         // shell.env.input = execute(`jo -p -- 
//         //   -s identity_pk[0]=$identity_pk_0 
//         //   -s identity_pk[1]=$identity_pk_1
//         //   -s auth_sig_r[0]=$auth_sig_r_0
//         //   -s auth_sig_r[1]=$auth_sig_r_1
//         //   -s auth_sig_s=$auth_sig_s
//         //   -s signal_hash=$signal_hash
//         //   -s external_nullifier= $externalNullifier,
//         //   -s identity_nullifier= $identityNullifier,
//         //   -s identity_trapdoor= $identityTrapdoor,
//         //   -a identity_path_elements= $identityPathElements,
//         //   -a identity_path_index= $identityPathIndex,
//         //   -s fake_zero= $fake_zero
//         // `)

//         // execute(`echo $input >> ./input.json`)

//     try{
//           const {witness} = circuit.calculateWitness({
//         'identity_pk[0]': identity.keypair.pubKey[0],
//         'identity_pk[1]': identity.keypair.pubKey[1],
//         'auth_sig_r[0]': signature.R8[0],
//         'auth_sig_r[1]': signature.R8[1],
//         auth_sig_s: signature.S,
//         signal_hash: signalHash,
//         external_nullifier: externalNullifier,
//         identity_nullifier: identity.identityNullifier,
//         identity_trapdoor: identity.identityTrapdoor,
//         identity_path_elements: identityPathElements,
//         identity_path_index: identityPathIndex,
//         fake_zero: bigInt(0),
//     })
//     return witness

//         }catch(e) {
//           return e
//         }
        


// //     // return {
// //     //     witness,
// //     //     signal,
// //     //     signalHash,
// //     //     signature,
// //     //     msg,
// //     //     tree,
// //     //     identityPath,
// //     //     identityPathIndex,
// //     //     identityPathElements,
// //     // }
// }

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
    console.log(circuit)  
    const provingKeyUrl = "http://localhost:5000/proving_key.bin";
    console.log("Downloading provingkey from ", provingKeyUrl);

    const provingKey = new Uint8Array(
      await (await fetch(provingKeyUrl)).arrayBuffer()
    );

    const leaves = await scContract.methods
        .getIDCommitments()
        .call({ from: account });
      console.log("Leaves:", leaves);  

      // const res = await genIDpath(
      //   signalStr,
      //   circuit,
      //   identity,
      //   leaves,
      //   20,
      //   externalNullifier,
      // )
      // console.log(res)
    
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
