# Anonymous Login using Semaphore

## Scope
A decentralized zero knowledge proof of concept for anonymous login using [Semaphore](https://github.com/appliedzkp/semaphore).

Normally, when signing up for a website, we enter our email and then it is verified through a confirmation email. However, this leaks privacy for genuine users, and it is very easy for an attacker to spin up multiple email IDs and accounts. We can prevent these attacks by making the KYC process more extensive, but this leaks even more info for the honest users. So we intend to use ZKP alongwith very high level of KYC to prevent privacy leakage and malicious signups.

User can login to their account by proving they belong to the list of KYC’ed users without revealing their personal details every time they try to login. Also, the KYC authority is not notified of the login purpose.

## Architecture
Semaphore is a gadget leveraging ZK to prove membership of a set without revealing identity and to signal endorsement of an arbitrary string.

A trusted Central Entity is responsible for the KYC procedure and adding the user’s identity commitment to the verified users’ set. The Central Entity will be able to update the merkle root to batch insert identities in a centralized manner, to save on gas and to support millions of users.

User will create a keypair and broadcast their pubkey to the external nullifier specific to the service provider.

When a registered user requests for signup, the service provider will send login credentials which expire periodically.

## Local deployment steps

Install npx and http-server globally (to serve the snarks).
`npm install -g npx http-server`.

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

The backend server handles storage and retrieval of temporary external nullifiers, OTPs and login credentials of the users. We can deploy the server using:

```
cd ../backend
npm run start
```

The server is now running on `http://127.0.0.1:8080`. Currently the data is stored using MongoDB Community Edition. You can install it using instructions [here](https://docs.mongodb.com/manual/installation). Start the mongo shell using `brew services start mongodb-community` (on macOS) or 
`sudo systemctl start mongod` on Linux systems. MongoDB server is now running on localhost with default port 27017. Create new database SemaphoreDB with collections userCredentials, enStore, userOTP, userKycData using mongo shell or MongoDB Compass GUI.

Now, we will deploy the frontend components.

```
cd ../frontend
npm start
```

The example service provider website can be launched using ` http-server -f ../example_sp_website/index.html` or with Live Server on VS Code.

That's it, you're done! Navigate to `http://localhost:3000/` and try out the webapp!

You can try the dApp with your own mnemonics, just replace the ones in `contracts/package.json` with the new ones, and the `deployKey` in `contracts/ts/compileAndDeploy.ts` with the account's private key.