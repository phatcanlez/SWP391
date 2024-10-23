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
              src="https://s3-alpha-sig.figma.com/img/c7af/6a0a/5500e104f5c724c263645a0d2bdf237b?Expires=1728864000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=I8mMbrWx7e-HBcL9v0kxYQQxlmXwluyrtakEUczXndaNGSAIYZmB01b0wr3lDZCB~pcGqOsMlIvzpxnuDWJSWSe3qNNf1LEgW3chst4pdPqqIVCkP91DmGcx9xMP2-6zAHBo3SL9SGSVky0kyRwtuX~zYPknZZZZIySjOeVF-66DgUebIYf8CoDeYc2~Gmjf64u2mUQrFB94SR5qPg6c8eUj0VwtOsEjbuEYoK9jg6~wXuA-izk-gJnSEX3CkrjLtPIcw9HNfRVLoQ01mqqa5RxTIsrbpxB0VEq1fPAu4fD4PCWoO9~SOTl-wBuWhRgJbPpG6I9CltA0iPbv7hnLxw__"
              alt=""
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
              src="https://s3-alpha-sig.figma.com/img/ff29/3b42/c17ff59eef38b0f422a41d95c9cbd97c?Expires=1728864000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Ea3FeyibuHPpBGaMGFazDrkvxs2jq8ae3tCESpolTTQOnr56JUwGRb70t6Xd2QA9~37CUajD7ysf37GDLh14-mWUer8IokaBA~PV6s-ZiHw1ucUwpKqoDRlXJJbcAJu3EaNQLhwLD9tB69rdYEw2Bb-y-KpsLgi1rb5eJ7R9-tH6XntXBw1cCssn46gKWjoNpcBiNxrVSuYieQU38r0FwCLZJ7tJ1DGNZWdoggHCV9J~cKecrZk5llAbtE5zYWnHBSbhdPdeGEBVruljBWWdL6XkdQqdQ2M1IOPQ2pgZPwjp81hVZ2d27Qkq8GiMPB~ioPDST0FUGCqjYGYsSVmfsw__"
              alt=""
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
              src="https://s3-alpha-sig.figma.com/img/06e0/cee2/cf35d4ef2435eb5754aab0504939fc8c?Expires=1728864000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Ehec58RxTSeFHHSFg6gnnJD6QHzft5LI-f2G7jZ09vEfjoH-mExdk9ZIkVRm1KYEyppS~KRlpvQgPTfmuGHOu2VJO5C4sJQjOLXCldCdRGKMdZbzqjJcHNA0XszZfZeFXvP5X0zi~OOQV4yHUBdlhOJcPfs-At36K6Vlufr~3lN1twosiF96sIuxT-jjyt8iInIeAjM4lMZPENOlgXMlOpg0qdsSV20QbBREhQgfH5DmM0AcKden0Yozn3-0r0-wnLCoMe2i4UeRjF3eYmSIeqWhCgtBJSKE1yvUZMnbq4~fUWN-cFJ6mQoaHnBEo9Uc0Vv0l8eQhmICY2hzxavebA__"
              alt=""
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
              src="https://s3-alpha-sig.figma.com/img/b754/c3fd/3db5320d71276a17f10e802a167deaa8?Expires=1728864000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=iU76QPhkTZ1Oa8D5eWoNXQ9Mcz8Pevz1FYJ-cp69b4i2S1lairlR6JTL8sdzF~CIslEcZSqZS38C6TgO6pFQccQqZuHOFrKCok2DtnrxN-a0NRz8v-Chl915DYCr7QVBlK3xTfVm4aBdiZnCVHVHWCjYOtdBTfhVLmJgGFhMqvce7JaAyQXoddgECK-F8I5-xKMETuONsnbTJK8H0wt-NAavstV5D~Zu1aw5X18kT2hpyLQcqCTZocoHRg0bloqKRGFkUMyYGza9X~eZsHZSbsUJx1KWl-B2gyBqmLQdxfyzc3QLDVF00ZJCQqO7cwD4s1ds~zXROMYLbNkkaakiiQ__"
              alt=""
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
              src="https://s3-alpha-sig.figma.com/img/952b/82ad/5db9f7c6fbab8520072019b71dfc9b39?Expires=1728864000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=PRdvRK~HOELYAK9qaNWQbsJs~5y7ZricrVINXS0Kbc5pR2p4pvLCgJu9woXCy0bFJBfC~0Vtzgh82z7-aSsy9KIFJF4oGDb6IfxAaaZl7Puwgjj2FSE6dFjUkJxeYM7KyHwapUAKwhPae2M5V-KpwXPBAt8zaaHtzI4WrfKlW9EqXHPsk0bV86UcVwDzBh5Bx2Ox197cllVx9-GUlkTuteD0tg62vBfIOzIEn0VyZzH~qd~w9WQhm9JRugvTZ0UGfdfaAUdvHX9mXCMxUwasQrR5p-RemNHN2qh71XNWfgNS6hezC-O3Urk0EUlwRdMvk7rbmUjjmWHplzHf0hPGsw__"
              alt=""
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
              src="https://s3-alpha-sig.figma.com/img/b4ca/2f17/e5b2a60a9f4876566f73835f2bd2ed01?Expires=1728864000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=lKMVm6dCx4he12kg0vnPIOA9DkMEQoEf5LmG0plg7Y2moS38nSYQRQYPmhWw9rglKe4ex4BMNHg1cknfdRVEd6yt-Q5wsvuxbweP1ZMj1s8gW3c~gskLBKeruLYmqxMOvPmNggdAc3E7EAZ5Dw1MhCZzqyOYDT3kddnpoZcxdoaHPj59-LdSu~6Mmf4bfW8LVCS9ybE8zk80AiFBRi68Ew7nanhQqbMbhXm3m24REi6i70tstgTzrDdj4kCyf0UOqPW-J3A~s2LbUwn6uaZJPxoLYM-qzzCZ1PNlhNE~xTPdR7I5oerU9MTOKAEHzZPtx62ENgxTHFjFyj3tCynumA__"
              alt=""
              className="international__container3__rectangle__image"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default International;
