import React from 'react'
import Helmet from 'react-helmet'
import { MintSection } from './components/MintSection'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Header } from './components/Header'

export function App() {
  return (
    <>
      <Header />
      <Hero />
      <Helmet>
        <title>BOGA Studios | Minting BOGA Dogs Soon</title>
        <meta
          name="description"
          content="An NFT studio. Minting BOGA Dogs soon."
        />
      </Helmet>
      <MintSection />
      <About />
      <footer className="flex w-screen mt-auto bg-black">
        <div className="container text-white mx-auto p-3 flex">
          <span>&copy; BOGA, 2023. All rights reserved.</span>
        </div>
      </footer>
    </>
  )
}
