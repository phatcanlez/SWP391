import "./index.css";
import diagram from "../../../img/diagram.png";
import revenue from "../../../img/revenue.png";
import growthRate from "../../../img/growth-rate.png";
import world from "../../../img/world.png";
import noGroup from "../../../img/no-group.png";
import protectedImg from "../../../img/protected.png";
import checkout from "../../../img/checkout.png";
import delivery from "../../../img/delivery.png";
import customerCare from "../../../img/customer-care.png";
import resume from "../../../img/resume.png";
import device from "../../../img/device.png";
import storage from "../../../img/storage.png";
import marketing from "../../../img/marketing.png";
import support24hours from "../../../img/24-hours-support.png";
import salary from "../../../img/salary.png";

function International() {
  const container1P1 = { fontSize: 45, fontWeight: 700 };
  const container1P2 = { fontSize: 30, fontWeight: 300 };
  const container1P3 = { fontSize: 25, fontWeight: 600 };
  const container1P4 = { fontSize: 25, fontWeight: 300 };
  const container2P1 = { fontSize: 50, fontWeight: 600 };
  const container2P2 = { fontSize: 32, fontWeight: 500 };
  return (
    <div className="international">
      <div className="international__container1">
        <div className="international__container1__title">
          <p style={container1P1}>
            WHY SHOULD YOU EXPAND YOUR BUSINESS TO THE VIETNAMESE MARKET?
          </p>
          <p style={container1P2}>
            Explore the potential of this promising market!
          </p>
        </div>
        <div className="international__container1__diagram">
          <img src={diagram} />
          <ul>
            <li>
              <img src={revenue}></img>
              <p>B2c Revenue</p>
            </li>
            <li>
              <img src={growthRate}></img>
              <p>Growth rate</p>
            </li>
          </ul>
        </div>
        <div className="international__container1__foot">
          <p style={container1P3}>
            B2C e-commerce revenue in Vietnam from 2018 to 2023 (billion USD){" "}
          </p>
          <p style={container1P4}>Source: VnEconomy</p>
        </div>
      </div>
      <div className="international__container2">
        <div className="international__container2__left">
          <p style={container2P1}>CHALLENGES WHEN SELLING IN VIETNAM</p>
          <p style={container2P2}>
            Vietnam is a potential e-commerce market. However, there are many
            obstacles that Japanese sellers have to cope with.
          </p>
        </div>
        <div className="international__container2__right">
          <p>
            <img src={world} />
            Language barier
          </p>
          <p>
            <img src={noGroup} />
            Cultural differences
          </p>
          <p>
            <img src={protectedImg} />
            Complex regulations and laws
          </p>
          <p>
            <img src={checkout} />
            Order processing and warehousing
          </p>
          <p>
            <img src={delivery} />
            Delivery and return processing
          </p>
          <p>
            <img src={customerCare} />
            Customer care
          </p>
        </div>
      </div>
      <div className="international__container3">
        <p className="international__container3__title">
          How does KOIKICHI LOGISTIC help Japanese businesses when entering the
          Vietnamese market?
        </p>
        <div className="international__container3__rectangle">
          <div className="international__container3__rectangle__1">
            <p className="international__container3__rectangle__title">
              Register business in Vietnam
            </p>
            <p className="international__container3__rectangle__paragraph">
              We help foreign sellers register their business in Vietnam thanks
              to our partnership with the Department of Planning and Investment
              in major cities such as Hanoi, Da Nang and Ho Chi Minh City.
            </p>
            <img
              src={resume}
              className="international__container3__rectangle__image"
            />
          </div>
          <div className="international__container3__rectangle__2">
            <p className="international__container3__rectangle__title">
              Open a multi-platform online store in Vietnam
            </p>
            <p className="international__container3__rectangle__paragraph">
              We support foreign merchants to set up online stores on various
              platforms and channels, including their own website, social
              networks, Shopee, Lazada, etc. This multi-channel approach helps
              increase brand coverage in the Vietnamese market.
            </p>
            <img
              src={device}
              className="international__container3__rectangle__image"
            />
          </div>
          <div className="international__container3__rectangle__3">
            <p className="international__container3__rectangle__title">
              Providing goods storage and handling services
            </p>
            <p className="international__container3__rectangle__paragraph">
              KOIKICHI Logistic satisfies all your requirements for warehousing
              and order fulfillment in Vietnam. Providing an OMS system to help
              sellers manage inventory and handle import/export of goods.
            </p>
            <img
              src={storage}
              className="international__container3__rectangle__image"
            />
          </div>
        </div>
        <div className="international__container3__rectangle">
          <div className="international__container3__rectangle__4">
            <p className="international__container3__rectangle__title">
              Marketing support in Vietnamese market
            </p>
            <p className="international__container3__rectangle__paragraph">
              KOIKICHI provides appropriate marketing services for foreign
              sellers such as running ads, managing fanpages, livestreaming
              sales, creating SEO strategies,... to improve product visibility
              and increase sales. .
            </p>
            <img
              src={marketing}
              className="international__container3__rectangle__image"
            />
          </div>
          <div className="international__container3__rectangle__5">
            <p className="international__container3__rectangle__title">
              After-sale customer care
            </p>
            <p className="international__container3__rectangle__paragraph">
              Rest assured that whether you are in Vietnam or not, the KOIKICHI
              Logistic team is always ready to take care of customers on your
              behalf.
            </p>
            <img
              src={support24hours}
              className="international__container3__rectangle__image"
            />
          </div>
          <div className="international__container3__rectangle__6">
            <p className="international__container3__rectangle__title">
              Support revenue and expenditure management/reconciliation
            </p>
            <p className="international__container3__rectangle__paragraph">
              KOIKICHI simplifies expense tracking and reconciliation for
              foreign businesses, making the management of financial
              transactions more transparent and easier.
            </p>
            <img
              src={salary}
              className="international__container3__rectangle__image"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default International;
