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
import c2 from '../../img/c2.png'
import c3 from '../../img/c3.png'
import c4 from '../../img/c4.png'
import c5 from '../../img/c5.png'
import c6 from '../../img/c6.png'
import commit from '../../img/commit.png'

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

      <section className='carousel-section'>
        <h4>CORE VALUES</h4>
        <Swiper
          slidesPerView={3}
          spaceBetween={50}
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

          <SwiperSlide>
            <h5>Innovation</h5>
            <p>Continuously updating advanced transportation technologies and methods.</p>
            <div><img src={c2} alt="" /></div>
          </SwiperSlide>

          <SwiperSlide>
            <h5>Professionalism</h5>
            <p>A team of experienced and well-trained experts.</p>
            <div><img src={c3} alt="" /></div>
          </SwiperSlide>

          <SwiperSlide>
            <h5>Transparency</h5>
            <p>We believe in clear  communication at every step.</p>
            <div><img src={c4} alt="" /></div>
          </SwiperSlide>

          <SwiperSlide>
            <h5>Sustainability</h5>
            <p>We're committed to environmentally responsible practices.</p>
            <div><img src={c5} alt="" /></div>
          </SwiperSlide>

          <SwiperSlide>
            <h5>Community</h5>
            <p>We foster connections among Koi enthusiasts worldwide.</p>
            <div><img src={c6} alt="" /></div>
          </SwiperSlide>
        </Swiper>
      </section>

      <section className='commit-section'>
        <div className='commit-section__item'>
          <h4>Our Commitment</h4>
          <h5>Facilitate knowledge exchange among Koi enthusiasts<br />
            Support conservation efforts for rare Koi varieties<br />
            Promote ethical breeding and trading practices<br />
            Organize virtual and physical Koi exhibitions and competitions</h5>
        </div>
      </section>

      <section className='last-section'>
        <div className='border'></div>
        <div>
          <h4>Future Directions</h4>
          <h5>Expanding our network to reach more remote locations<br /> Developing specialized equipment for long-distance Koi transportation<br /> Collaborating with researchers to advance Koi health during transit<br /> Integrating virtual reality for immersive Koi selection experiences</h5>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default AboutUs