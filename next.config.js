/** @type {import('next').NextConfig} */
const nextConfig = {
    swcMinify: true,
    env: {
        CHAIN_ID: 34443,
        NFT_ADDRESS:'0xcE489c3aAba295d1df9cE3c7111AD01ab79A21A8',
        TOKEN_ADDRESS:'0xcE489c3aAba295d1df9cE3c7111AD01ab79A21A8',
        FAUCET_ADDRESS:'0x2F3AE88cF1a5aa86b151Bc8879AF3f7DAFF4b4A0',
        EXPLORER_URL:'https://explorer.mode.network'
      },
}

module.exports = nextConfig
