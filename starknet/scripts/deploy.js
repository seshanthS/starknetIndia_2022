const { ethers } = rquire("hardhat");
const main = async () => {
    const [deployer] = await ethers.getSigners()
    let Forwarder = await ethers.getContractFactory("L2Forwarder", deployer)
    let forwarder = await Forwarder.deploy(
        "0xAB43bA48c9edF4C2C4bB01237348D1D7B28ef168",
        "0xde29d060D45901Fb19ED6C6e959EB22d8626708e"
    )

    await forwarder.deployed()

    await forwarder.deployTransaction.wait(5)

    console.log("Forwarder deployed to:", forwarder.address)

    await run("verify:verify", {
        address: forwarder.address,
        constructorArguments: [
            "0xAB43bA48c9edF4C2C4bB01237348D1D7B28ef168",
            "0xde29d060D45901Fb19ED6C6e959EB22d8626708e"
        ],
    });

}

main().then(() => process.exit(0)).catch(error => {
    console.error(error);
    process.exit(1);
})