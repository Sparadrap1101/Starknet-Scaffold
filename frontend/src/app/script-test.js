import { Account, Contract, Provider } from 'starknet';
import fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();

// initialize provider
const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
// initialize existing account
const privateKey = process.env.OZ_NEW_ACCOUNT_PRIVKEY;
const accountAddress = '0x051158d244c7636dde39ec822873b29e6c9a758c6a9812d005b6287564908667';

const account = new Account(provider, accountAddress, privateKey);
// add ,"1" after privateKey if this account is not a Cairo 0 contract

// initialize deployed contract
const contractAddress = '0x7667469b8e93faa642573078b6bf8c790d3a6184b2a1bb39c5c923a732862e1';
const compiledTest = json.parse(fs.readFileSync('./compiledContracts/test.json').toString('ascii'));

// connect the contract
const myContract = new Contract(compiledTest.abi, contractAddress, provider);
