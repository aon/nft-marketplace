const { ethers } = require("hardhat");

describe("NFTMarket", () => {
  it("should create and execute market sales", async () => {
    /* Deploy the marketplace */
    const nftMarketplaceContract = await ethers.getContractFactory(
      "NFTMarketplace"
    );
    const nftMarketplace = await nftMarketplaceContract.deploy();
    await nftMarketplace.deployed();

    const listingPrice = (await nftMarketplace.getListingPrice()).toString();
    const auctionPrice = ethers.utils.parseUnits("1", "ether");

    /* Create two tokens */
    await nftMarketplace.createToken(
      "https://www.mytokenlocation.com",
      auctionPrice,
      { value: listingPrice }
      );
      await nftMarketplace.createToken(
        "https://www.mytokenlocation2.com",
        auctionPrice,
        { value: listingPrice }
        );

    const [_, buyerAddress] = await ethers.getSigners();

    /* Execute sale of token to another user */
    await nftMarketplace
      .connect(buyerAddress)
      .createMarketSale(1, { value: auctionPrice });

    /* Resell a token */
    await nftMarketplace
      .connect(buyerAddress)
      .resellToken(1, auctionPrice, { value: listingPrice });

    /* Query for and return the unsold items */
    items = await nftMarketplace.fetchMarketItems();
    items = await Promise.all(
      items.map(async (item) => {
        const tokenUri = await nftMarketplace.tokenURI(item.tokenId);
        return {
          price: item.price.toString(),
          tokenId: item.tokenId.toString(),
          seller: item.seller,
          owner: item.owner,
          tokenUri,
        };
      })
    );
    console.log("items: ", items);
  });
});
