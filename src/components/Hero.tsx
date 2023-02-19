import { memo } from "react";
import { FaAngleDown } from "react-icons/fa";

export const Hero = memo(() => {
  return (
    <>
      <div className="flex p-5 py-80 bg-opacity-50  shadow-xl">
        <div className="container mx-auto text-center">
          <h1 className="mb-5">BOGA Studios</h1>
          <span className="block mb-5">Presents</span>
          <span className="text-5xl mb-5">DOGS</span>
          <span className="block pt-5">
            <FaAngleDown style={{ margin: "0 auto" }} />
          </span>
        </div>
      </div>
      <div className="grid grid-cols-3">
        <img src="/img/dogs/4.png" alt="" />
        <img src="/img/dogs/5.png" alt="" />
        <img src="/img/dogs/3.png" alt="" />
      </div>
    </>
  );
});

export default Hero;
