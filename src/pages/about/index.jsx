import React from 'react'
import Header from '../../components/header'
import Footer from '../../components/footer'
import '../about/about.css'

import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules'

import a1 from '../../img/a1.png'
import a2 from '../../img/a2.png'
import c1 from '../../img/c1.png'

function AboutUs() {
  return (
    <div className='about-us'>
      <Header />
      <div className='border'></div>
      <section className='about-banner'>
        <h1>KOIKICHI</h1>
        <h6>Scales of Excellence in Koi Transportation</h6>
        <div className='about-banner__item'>
          <h5>Welcome to the Koi Fish Transportation Management System - a groundbreaking initiative designed to transform the global Koi fish transportation industry. Our project aims to address the unique challenges of transporting these living works of art while providing an unparalleled experience for Koi enthusiasts, breeders, and businesses worldwide.</h5>
        </div>
      </section>

      <section className='story-section'>
        <div className='cnt'>
          <h4>OUR STORY</h4>
          <h5>Born from a passion for Koi and a recognition of the complexities involved in their transportation, this project began as a collaborative effort between Koi experts, logistics professionals, and technology innovators. We identified a critical need in the market for a specialized, end-to-end solution that could ensure the safe, efficient, and transparent movement of these prized fish across local and international borders.</h5>
        </div>
        <div><img src={a1} alt="" /></div>
      </section>

      <section className='vision-section'>
        <div>
          <div className='item'>
            <h4>VISION</h4>
            <h5>We aim to become the leading platform in the field of Koi fish transportation, connecting fish enthusiasts worldwide and ensuring that each fish is cared for with the utmost dedication and professionalism throughout its journey.</h5>
          </div>
          <div><img src={a2} alt="" /></div>
          <div className='item'>
            <h5>Our mission is to provide safe, efficient, and transparent Koi fish transportation services while enhancing the experience for both customers and partners in the industry.</h5>
            <h4>MISSION</h4>
          </div>
        </div>
      </section>

      <section >
        <Swiper
          slidesPerView={3}
          spaceBetween={30}
          pagination={{
            clickable: true,
          }}
          modules={[Pagination]}
          className="carousel"
        >
          <SwiperSlide>
            <h5>Safety</h5>
            <p>Top priority for the health and safety of Koi fish.</p>
            <div><img src={c1} alt="" /></div>
          </SwiperSlide>
          <SwiperSlide>Slide 2</SwiperSlide>
          <SwiperSlide>Slide 3</SwiperSlide>
          <SwiperSlide>Slide 4</SwiperSlide>
          <SwiperSlide>Slide 5</SwiperSlide>
          <SwiperSlide>Slide 6</SwiperSlide>
          <SwiperSlide>Slide 7</SwiperSlide>
          <SwiperSlide>Slide 8</SwiperSlide>
          <SwiperSlide>Slide 9</SwiperSlide>
        </Swiper>
      </section>

      <Footer />
    </div>
  )
}

export default AboutUs