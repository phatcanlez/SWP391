import React, { useEffect } from "react";
import Header from "../../components/header";
import Footer from "../../components/footer";
import "../home/home.css";
import { Button } from "antd";
import home1 from "../../img/home1.png";
import home2 from "../../img/home2.png";
import logo1 from "../../img/logo1.png";
import logo2 from "../../img/logo2.png";
import logo3 from "../../img/logo3.png";
import logo4 from "../../img/logo4.png";
import logo5 from "../../img/logo5.png";
import logo6 from "../../img/logo6.png";
import logo7 from "../../img/logo7.png";
import logo8 from "../../img/logo8.png";
import logo9 from "../../img/logo9.png";
import logo10 from "../../img/logo10.png";
import logo11 from "../../img/logo11.png";
import logo12 from "../../img/logo12.png";
import logo13 from "../../img/logo13.png";
function HomePage() {
  const persistRoot = localStorage.getItem("persist:root");
  let role = null;

  if (persistRoot) {
    const user = JSON.parse(persistRoot).user;
    if (user) {
      const userObj = JSON.parse(user);
      role = userObj.role;
    }
  }

  useEffect(() => {
    console.log("role", role);
    if (role === "CUSTOMER") {
      var Tawk_API = Tawk_API || {},
        Tawk_LoadStart = new Date();
      (function () {
        const s1 = document.createElement("script"),
          s0 = document.getElementsByTagName("script")[0];
        s1.async = true;
        s1.src = "https://embed.tawk.to/67375fd74304e3196ae33499/1ico4sp3d";
        s1.charset = "UTF-8";
        s1.setAttribute("crossorigin", "*");
        s0.parentNode.insertBefore(s1, s0);
      })();
    } else {
      const existingScript = document.getElementById("tawk-script");
      if (existingScript) {
        existingScript.remove();
      }
    }
  }, [role]);

  return (
    <div>
      <Header />
      <div className="home">
        <section className="banner">
          <div className="banner__item">
            <h1>KOIKICHI</h1>
            <h6>Scales of Excellence in Koi Transportation</h6>
          </div>
        </section>

        <section className="cnt">
          <div className="cnt1__wrapper">
            <div className="item">
              <h5>ABOUT</h5>
              <h4>Why choose us?</h4>
              <h5>
                Welcome to KOIKICHI - The leading expert in Koi fish
                transportation!
              </h5>
              <Button className="home__btn">LEARN MORE</Button>
            </div>
            <div className="cnt__img">
              <img src={home1} alt="" />
            </div>
          </div>
        </section>

        <div className="border"></div>

        <section className="cnt">
          <div className="cnt1__wrapper">
            <div className="cnt__img">
              <img src={home2} alt="" />
            </div>
            <div className="item">
              <h5>SERVICE</h5>
              <h4>What we do?</h4>
              <h5>
                Domestic and international Koi fish transportation
                <br />
                Health checks and quality certification
                <br />
                Professional packaging ensuring safety
                <br />
                Import procedure assistance
              </h5>
              <Button className="home__btn">LEARN MORE</Button>
            </div>
          </div>
        </section>

        <div className="border"></div>

        <section className="cnt2">
          <div className="cnt2__wrapper">
            <h5>TRACKING</h5>
            <h4>Bill of Lading</h4>
            <h5>Tracking Bill of Lading</h5>
            <Button className="home__btn">LEARN MORE</Button>
          </div>
          <div className="cnt2__border"></div>
          <div className="cnt2__wrapper">
            <h5>PRICING</h5>
            <h4>Shipping fee</h4>
            <h5>Shipping fee estimation</h5>
            <Button className="home__btn">LEARN MORE</Button>
          </div>
        </section>

        <section className="logo">
          <h2>STRATEGIC PARTNER</h2>
          <div className="wrapper">
            <img src={logo1} alt="" />
            <img src={logo2} alt="" />
            <img src={logo3} alt="" />
            <img src={logo4} alt="" />
            <img src={logo5} alt="" />
          </div>
          <div className="wrapper">
            <img src={logo6} alt="" />
            <img src={logo13} alt="" />
            <img src={logo7} alt="" />
            <img src={logo8} alt="" />
            <img src={logo9} alt="" />
          </div>
          <div className="wrapper">
            <img src={logo10} alt="" />
            <img src={logo11} alt="" />
            <img src={logo12} alt="" />
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}

export default HomePage;
