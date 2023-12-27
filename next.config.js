/** @type {import('next').NextConfig} */
const nextConfig = {
    swcMinify: true,
    env: {
        CHAIN_ID: 919,
        NFT_ADDRESS:'0xa8BB8FC4A36fdd5957960C6c52828a25Db633416',
        TOKEN_ADDRESS:'0xa8BB8FC4A36fdd5957960C6c52828a25Db633416',
        FAUCET_ADDRESS:'0x63769f68b683763eAB26D317D7238e56dD740026',
        EXPLORER_URL:'https://scan-api-testnet.viction.xyz'
      },
}

module.exports = nextConfig
