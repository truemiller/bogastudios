import { memo } from 'react'

export const About = memo(() => (
  <section
    className="flex p-5 py-40  bg-opacity-50 text-white shadow-xl"
    id="about"
  >
    <div className="container mx-auto text-center">
      <div className="">
        <h2>About</h2>
        <p>BOGA Studios is an NFT studio.</p>
        <p>We innovate and create new collectible NFTs.</p>
        <p>
          Numerous collections will be launched, with varying quantity, pricing,
          and themes.
        </p>
      </div>
    </div>
  </section>
))
