import Web3 from 'web3';

let web3: Web3 | null = null;

export const getProvider = (): Web3 => {
    if (!web3) {
        web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
    }
    return web3;
};

export const sendTransaction = async (transaction: any): Promise<string> => {
    const provider = getProvider();
    const accounts = await provider.eth.getAccounts();
    transaction.from = accounts[0];
    return provider.eth.sendTransaction(transaction);
};