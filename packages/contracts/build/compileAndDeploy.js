"use strict";
// The MiMCSponge contract is not written in Solidity. Instead, its bytecode is
// generated by circomlib/src/mimcsponge_gencontract.js.
//
// Most (if not all) Solidity tooling frameworks, like Etherlime or Truffle,
// do not integrate the solc binary and therefore take ages to compile
// contracts.
//
// This script does the following:
//
// 1. Build the MiMC contract bytecode and deploy it to the Ethereum node
//    specified by --rpcUrl.
// 2. Copy Solidity files from the semaphore submodule to sol/semaphore
// 2. Compile the Solidity files specified by --input using the solc binary
//    specified by --solc. All output files will be in the directory specified
//    by --out.
// 3. Link the MiMC contract address to hardcoded contract(s) (just
//    MerkleTreeLib for now)
// 4. Deploy the rest of the contracts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.compileAndDeploy = void 0;
// import { config } from 'su-config'
var argparse_1 = require("argparse");
var shell = require("shelljs");
var path = require("path");
var fs = require("fs");
var ethers = require("ethers");
var mimcGenContract = require('circomlib/src/mimcsponge_gencontract.js');
var MIMC_SEED = 'mimcsponge';
var buildMimcBytecode = function () {
    return mimcGenContract.createCode(MIMC_SEED, 220);
};
var execute = function (cmd) {
    var result = shell.exec(cmd, { silent: false });
    if (result.code !== 0) {
        throw 'Error executing ' + cmd;
    }
    return result;
};
var readFile = function (abiDir, filename) {
    return fs.readFileSync(path.join(abiDir, filename)).toString();
};
var compileAbis = function (abiDir, solDir, solcBinaryPath) {
    if (solcBinaryPath === void 0) { solcBinaryPath = 'solc'; }
    return __awaiter(void 0, void 0, void 0, function () {
        var solcCmd, result;
        return __generator(this, function (_a) {
            shell.mkdir('-p', abiDir);
            solcCmd = solcBinaryPath + " -o " + abiDir + " " + solDir + "/*.sol --overwrite --abi";
            result = execute(solcCmd);
            shell.rm('-rf', '../frontend/src/abi/');
            // Copy ABIs to the frontend and backend modules
            shell.mkdir('-p', '../frontend/src/abi/');
            shell.ls(path.join(abiDir, '*.abi')).forEach(function (file) {
                var baseName = path.basename(file);
                shell.cp('-R', file, "../frontend/src/abi/" + baseName + ".json");
            });
            return [2 /*return*/];
        });
    });
};
var compileAndDeploy = function (abiDir, solDir, solcBinaryPath, rpcUrl) {
    if (solcBinaryPath === void 0) { solcBinaryPath = 'solc'; }
    if (rpcUrl === void 0) { rpcUrl = 'http://localhost:8545'; }
    return __awaiter(void 0, void 0, void 0, function () {
        var readAbiAndBin, semaphorePathPrefix, mimcBin, solcCmd, result, provider, deployKey, wallet, mimcAbi, mimcContractFactory, mimcContract, filesToLink, _i, filesToLink_1, fileToLink, filePath, linkCmd, semaphoreAB, semaphoreContractFactory, semaphoreContract, scAB, scContractFactory, scContract, tx, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    readAbiAndBin = function (name) {
                        var abi = readFile(abiDir, name + '.abi');
                        var bin = readFile(abiDir, name + '.bin');
                        return { abi: abi, bin: bin };
                    };
                    semaphorePathPrefix = './sol/';
                    mimcBin = buildMimcBytecode();
                    // compile contracts
                    shell.rm('-rf', abiDir);
                    shell.mkdir('-p', abiDir);
                    solcCmd = solcBinaryPath + " -o " + abiDir + " " + solDir + "/*.sol --overwrite --optimize --abi --bin";
                    result = execute(solcCmd);
                    provider = new ethers.providers.JsonRpcProvider(rpcUrl);
                    deployKey = "0x0b6d3bf278e3aeb8b45a9a460f183a49ba30d03318a236f27ca6ed7a66b88e3d";
                    wallet = new ethers.Wallet(deployKey, provider);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 10, , 11]);
                    mimcAbi = mimcGenContract.abi;
                    mimcContractFactory = new ethers.ContractFactory(mimcAbi, mimcBin, wallet);
                    return [4 /*yield*/, mimcContractFactory.deploy({ gasPrice: ethers.utils.parseUnits('10', 'gwei') })];
                case 2:
                    mimcContract = _a.sent();
                    return [4 /*yield*/, mimcContract.deployed()];
                case 3:
                    _a.sent();
                    console.log('MiMC deployed at', mimcContract.address);
                    filesToLink = ['MiMC.sol'];
                    for (_i = 0, filesToLink_1 = filesToLink; _i < filesToLink_1.length; _i++) {
                        fileToLink = filesToLink_1[_i];
                        filePath = path.join(solDir, fileToLink);
                        linkCmd = solcCmd + " --libraries " + filePath + ":MiMC:" + mimcContract.address;
                        execute(linkCmd);
                    }
                    semaphoreAB = readAbiAndBin('Semaphore');
                    semaphoreContractFactory = new ethers.ContractFactory(semaphoreAB.abi, semaphoreAB.bin, wallet);
                    return [4 /*yield*/, semaphoreContractFactory.deploy(20, 0, { gasPrice: ethers.utils.parseUnits('10', 'gwei'), gasLimit: 8800000 })];
                case 4:
                    semaphoreContract = _a.sent();
                    return [4 /*yield*/, semaphoreContract.deployed()];
                case 5:
                    _a.sent();
                    console.log('Deployed Semaphore at', semaphoreContract.address);
                    scAB = readAbiAndBin('Client');
                    scContractFactory = new ethers.ContractFactory(scAB.abi, scAB.bin, wallet);
                    return [4 /*yield*/, scContractFactory.deploy(semaphoreContract.address, { gasPrice: ethers.utils.parseUnits('10', 'gwei') })];
                case 6:
                    scContract = _a.sent();
                    return [4 /*yield*/, scContract.deployed()];
                case 7:
                    _a.sent();
                    console.log('Deployed Client Contract at', scContract.address);
                    shell.rm('-rf', '../frontend/src/addr/');
                    shell.mkdir('-p', '../frontend/src/addr/');
                    execute('touch ../frontend/src/addr/addr.json');
                    shell.env.semAddr = String(semaphoreContract.address);
                    shell.env.scAddr = String(scContract.address);
                    shell.env.json = execute("jo -p -- -s semAddr=$semAddr -s scAddr=$scAddr");
                    execute("echo $json >> ../frontend/src/addr/addr.json");
                    return [4 /*yield*/, semaphoreContract.transferOwnership(scContract.address)];
                case 8:
                    tx = _a.sent();
                    return [4 /*yield*/, tx.wait()];
                case 9:
                    _a.sent();
                    console.log('Transferred ownership of the Semaphore contract');
                    return [2 /*return*/, {
                            MiMC: mimcContract,
                            Semaphore: semaphoreContract,
                            Client: scContract
                        }];
                case 10:
                    e_1 = _a.sent();
                    console.log(e_1);
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/];
            }
        });
    });
};
exports.compileAndDeploy = compileAndDeploy;
if (require.main === module) {
    var parser = new argparse_1.ArgumentParser({
        description: 'Build and deploy contracts'
    });
    parser.addArgument(['-s', '--solc'], {
        help: 'The path to the solc binary',
        required: false
    });
    parser.addArgument(['-r', '--rpcUrl'], {
        help: 'The JSON-RPC URL of the Ethereum node',
        required: false
    });
    parser.addArgument(['-o', '--out'], {
        help: 'The output directory for compiled files',
        required: true
    });
    parser.addArgument(['-i', '--input'], {
        help: 'The input directory with .sol files',
        required: true
    });
    parser.addArgument(['-k', '--privKey'], {
        help: 'The private key to use to deploy the contracts',
        required: false
    });
    parser.addArgument(['-a', '--abi-only'], {
        help: 'Only generate ABI files',
        action: 'storeTrue'
    });
    // parse command-line options
    var args = parser.parseArgs();
    var abiDir = path.resolve(args.out);
    var solDir = path.resolve(args.input);
    var solcBinaryPath = args.solc ? args.solc : 'solc';
    if (args.abi_only) {
        compileAbis(abiDir, solDir);
    }
    else {
        var rpcUrl = args.rpcUrl ? args.rpcUrl : "http://localhost:8545";
        compileAndDeploy(abiDir, solDir, solcBinaryPath, rpcUrl);
        compileAbis(abiDir, solDir);
    }
}
//# sourceMappingURL=compileAndDeploy.js.map