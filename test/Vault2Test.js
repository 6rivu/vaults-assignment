const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 2", () => {
	let vault;
	let owner;

	beforeEach(async () => {
		[owner] = await ethers.getSigners();
		const Vault2 = await ethers.getContractFactory("Vault2");
		vault = await Vault2.deploy();
	});

	describe("mint", function () {

		it("mint tokens equal to number of ether received", async function () {
			await vault.mint({value: 10});
			const ownerTokenBalance = await vault.balanceOf(owner.address);
			expect(await ownerTokenBalance).to.equal(10);
			const vaultEtherBalance = await vault.getContractEthBalance();
			expect(await vaultEtherBalance).to.equal(10);
		});
	});

	describe("burn", function () {
		it("burn tokens and get equal amount of ether back", async function () {
			await vault.mint({value: 10});
			await expect(
				vault.burn(50)
			).to.be.revertedWith("User doesn't have enough Vault tokens to burn");
			await vault.burn(5);
			const ownerTokenBalance = await vault.balanceOf(owner.address);
			expect(await ownerTokenBalance).to.equal(5);
			const vaultEtherBalance = await vault.getContractEthBalance();
			expect(await vaultEtherBalance).to.equal(5);
		});
	});
});