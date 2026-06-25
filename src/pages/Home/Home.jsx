import React from "react";
import Hero from "../../components/layouts/Hero/Hero";
import DoctorCard from "../../components/ui/Doctor Card/DoctorCard";
import OurDoctors from "../../components/layouts/Our Doctors/OurDoctors";
import Offer from "../../components/layouts/What we Offer/Offer";
import SearchDoctor from "../../components/layouts/Search For Doctor/searchDoctor";

const Home = () => {
  return (
    <>
      <Hero />
      <SearchDoctor/>
      <OurDoctors />
      <Offer />
    </>
  );
};

export default Home;
