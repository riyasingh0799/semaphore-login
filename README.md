# Anonymous Login using Semaphore

## Scope
A decentralized zero knowledge proof of concept for anonymous login using [Semaphore](https://github.com/appliedzkp/semaphore).

Normally, when signing up for a website, we enter our email and then it is verified through a confirmation email. However, this leaks privacy for genuine users, and it is very easy for an attacker to spin up multiple email IDs and accounts. We can prevent these attacks by making the KYC process more extensive, but this leaks even more info for the honest users. So we intend to use ZKP alongwith very high level of KYC to prevent privacy leakage and malicious signups.

User can login to their account by proving they belong to the list of KYC’ed users without revealing their validated properties (eg. phone number). Also, the KYC authority is not notified of the login purpose.

## Architecture
Semaphore is a gadget leveraging ZK to prove membership of a set without revealing identity and to signal endorsement of an arbitrary string.

A trusted Central Entity is responsible for the KYC procedure and adding the user’s identity commitment to the verified users’ set. The Central Entity will be able to update the merkle root to batch insert identities in a centralized manner, to save on gas and to support millions of users.

User will create a keypair and broadcast their pubkey to the external nullifier specific to the service provider.

When a registered user requests for signup, the service provider will send login credentials which expire periodically.

## Local deployment steps

Install npx and http-server globally (to serve the snarks).
`npm install -g npx http-server`

In a terminal, execute the following:

```
git clone https://github.com/riyasingh0799/semaphore-login.git
cd semaphore-login
npm i && npm run bootstrap
```

Download the circuit.json, proving_key.bin, verifier.sol and verification_key.json using the downloadSnarks script and then serve them using http-server.

```
cd packages
./contracts/scripts/downloadSnarks.sh
./contracts/scripts/serveSnarks.sh
```

Launch ganache on a new terminal:

```
cd contracts
npm run ganache
```

Compile and deploy the semaphore and client smart contracts.

```
npm run compileAndDeploy
```

This will execute the command `tsc && node build/compileAndDeploy.js -s solc -o ./abi/ -i ./sol/` in the contracts directory. The MiMC library is linked to the sempahore contracts and finally semaphore and client contracts are deployed (locally, to Ganache).

Now, we deploy the frontend components.

```
cd ../frontend
npm start
```

That's it, you're done! Navigate to `http://localhost:3000/` and try out the webapp!

You can try the dApp with your own mnemonics, just replace the ones in `contracts/package.json` with the new ones, and the `deployKey` in `contracts/ts/compileAndDeploy.ts` with the account's private key.
