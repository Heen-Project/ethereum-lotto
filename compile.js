const path = require('path')
const fs = require('fs')
const solc = require('solc')

const lottoPath = path.resolve(__dirname, 'contracts', 'Lotto.sol')
const source = fs.readFileSync(lottoPath, 'utf8')

const input = {
    language: "Solidity",
    sources: {
      "Lotto.sol": {
        content: source
      }
    },
    settings: {
      metadata: {
        useLiteralContent: true
      },
      outputSelection: {
        "*": {
          "*": ["*"]
        }
      }
    }
}
  
const output = JSON.parse(solc.compile(JSON.stringify(input)))

module.exports = output.contracts['Lotto.sol'].Lotto