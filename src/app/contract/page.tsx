'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileCode } from 'lucide-react';

const solidityCode = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title StoryVerseNFT
 * @dev A simple ERC721 contract for minting stories, poems, etc., as NFTs.
 * The content itself isn't stored on-chain to save gas, but a URI pointing
 * to the content and metadata is.
 */
contract StoryVerseNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // Event emitted when a new NFT is minted.
    event MasterpieceMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string tokenURI
    );

    constructor(address initialOwner)
        ERC721("StoryVerse", "STORY")
        Ownable(initialOwner)
    {}

    /**
     * @dev Mints a new NFT and assigns it to the 'to' address.
     * The tokenURI should be a URL to a JSON file containing the NFT's
     * metadata (title, description, content, image).
     * Only the contract owner can call this function.
     */
    function safeMint(address to, string memory tokenURI) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);

        emit MasterpieceMinted(tokenId, to, tokenURI);
    }

    // The following functions are overrides required by Solidity.

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
`;

export default function ContractPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center gap-2">
            <FileCode className="text-primary" />
            Sample Smart Contract
          </CardTitle>
          <CardDescription>
            This is an example of a Solidity smart contract that could power StoryVerse.
            This code is for demonstration purposes and is not deployed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-secondary rounded-md p-4 overflow-x-auto">
            <pre className="font-code text-sm whitespace-pre-wrap">
              <code>{solidityCode.trim()}</code>
            </pre>
          </div>
           <div className="mt-4 p-4 border-l-4 border-accent bg-accent/10 text-accent-foreground/80 rounded-r-md">
            <h4 className="font-semibold">Note on OpenZeppelin Contracts</h4>
            <p className="text-sm mt-1">
              This contract uses the <a href="https://www.openzeppelin.com/contracts" target="_blank" rel="noopener noreferrer" className="underline hover:text-accent-foreground">OpenZeppelin Contracts</a> library, which provides secure, community-vetted implementations of common standards like ERC721. To use this in a real project, you would need to install it via npm: <code>npm install @openzeppelin/contracts</code>.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
