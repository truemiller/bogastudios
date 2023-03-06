import { memo } from "react";
import { FaHome, FaTwitter, FaDiscord, FaShip } from "react-icons/fa";

export const Header = memo(() => {
  return (
    <nav className=" bg-black p-3 text-white shadow-xl">
      <div className="container mx-auto flex">
        <div className="flex">
          <a href="/" className="mr-5 flex text-white">
            <FaHome className="mt-1 mr-1" /> Home
          </a>
          <a
            href="https://twitter.com/boga_studios"
            className="mr-5 flex  text-white"
          >
            <FaTwitter className="mt-1 mr-1" /> Twitter
          </a>
          <a
            href="https://discord.gg/w3UnQPYx2W"
            className="mr-5 flex  text-white"
          >
            <FaDiscord className="mt-1 mr-1" /> Discord
          </a>
          <a
            href="https://opensea.io/collection/boga-cats"
            className="mr-5 flex  text-white"
          >
            <FaShip className="mt-1 mr-1" /> Opensea
          </a>
        </div>
        <div className="flex ml-auto">
          <a href={"#about"} className="mr-5">
            About
          </a>
          <a href={"#mint"} className="mr-5">
            Mint
          </a>
        </div>
      </div>
    </nav>
  );
});
