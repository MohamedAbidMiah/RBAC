const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AccessControlLite", function () {
  async function deployFixture() {
    const [owner, admin, user, stranger] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("AccessControlLite");
    const c = await Factory.deploy();
    await c.waitForDeployment();
    return { c, owner, admin, user, stranger };
  }

  it("sets deployer as owner", async function () {
    const { c, owner } = await deployFixture();
    expect(await c.owner()).to.equal(owner.address);
  });

  it("owner can grant and revoke admin", async function () {
    const { c, admin } = await deployFixture();
    await expect(c.grantAdmin(admin.address)).to.emit(c, "AdminGranted").withArgs(admin.address);
    expect(await c.isAdmin(admin.address)).to.equal(true);

    await expect(c.revokeAdmin(admin.address)).to.emit(c, "AdminRevoked").withArgs(admin.address);
    expect(await c.isAdmin(admin.address)).to.equal(false);
  });

  it("non-owner cannot grant admin", async function () {
    const { c, admin, stranger } = await deployFixture();
    await expect(c.connect(stranger).grantAdmin(admin.address))
      .to.be.revertedWith("AccessControlLite: caller is not the owner");
  });

  it("owner/admin can grant and revoke user", async function () {
    const { c, admin, user } = await deployFixture();

    await c.grantAdmin(admin.address);

    await expect(c.grantUser(user.address)).to.emit(c, "UserGranted").withArgs(user.address);
    expect(await c.isUser(user.address)).to.equal(true);

    await expect(c.connect(admin).revokeUser(user.address))
      .to.emit(c, "UserRevoked").withArgs(user.address);
    expect(await c.isUser(user.address)).to.equal(false);
  });

  it("non-admin/non-owner cannot grant user", async function () {
    const { c, user, stranger } = await deployFixture();
    await expect(c.connect(stranger).grantUser(user.address))
      .to.be.revertedWith("AccessControlLite: caller is not admin or owner");
  });

  it("only users can call protectedAction", async function () {
    const { c, user, stranger } = await deployFixture();
    await c.grantUser(user.address);

    expect(await c.connect(user).protectedAction()).to.equal("Protected action executed");

    await expect(c.connect(stranger).protectedAction())
      .to.be.revertedWith("AccessControlLite: caller is not a user");
  });
});
