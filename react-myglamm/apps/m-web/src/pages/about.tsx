import React from "react";
import Link from "next/link";
import Image from "next/legacy/image";

const About = () => (
  <div>
    <Link href="/" aria-label="Home">
      Home
    </Link>
    <Image
      src="https://files.myglamm.com/site-images/original/POSE-Foundation-Stick-Homepage-Mobile_2.jpg"
      alt="test"
      height="375"
      width="390"
    />
  </div>
);

export default About;
