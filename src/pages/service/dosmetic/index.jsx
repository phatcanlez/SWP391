import "../../service/dosmetic/index.css";
import clasp from "../../../img/clasp.png";
import global from "../../../img/global.png";
import money from "../../../img/money.png";
import paymentMethod from "../../../img/payment-method.png";
import trade from "../../../img/trade.png";
import checkout from "../../../img/checkout.png";
import rating from "../../../img/rating.png";
import fee from "../../../img/fee.png";

function Dosmetic() {
  const rec1 = { marginLeft: 50 };
  const rec2 = { marginRight: 50 };
  return (
    <div className="dosmetic">
      <div className="dosmetic__title">
        <p className="dosmetic__title__1">
          WHY DO SELLERS SHOULD SELL OVERSEAS?
        </p>
        <p className="dosmetic__title__2">
          Businesses have many competitive advantages, and therefore, they will
          gain many benefits when expanding sales to other countries.
        </p>
      </div>
      <div className="dosmetic__rectangle" style={rec1}>
        <div className="dosmetic__rectangle__title">
          <p className="dosmetic__rectangle__title__1">Expand customer type</p>
          <p className="dosmetic__rectangle__title__2">
            Cross-border selling allows sellers to access global markets,
            opening up opportunities to reach customers from many different
            countries, increasing potential revenue.
          </p>
        </div>
        <img src={clasp} className="dosmetic__rectangle__img1" />
      </div>
      <div className="dosmetic__rectangle" style={rec2}>
        <img src={global} className="dosmetic__rectangle__img2" />
        <div className="dosmetic__rectangle__title">
          <p className="dosmetic__rectangle__title__1">
            Increase global recognition
          </p>
          <p className="dosmetic__rectangle__title__2">
            Selling to international customers can enhance a brand's reputation
            and global recognition, which can have many positive effects in the
            long run.
          </p>
        </div>
      </div>
      <div className="dosmetic__container">
        <div className="dosmetic__container__left">
          <p className="dosmetic__container__left__title">
            CHALLENGES WHEN SELLING ACROSS BORDERS
          </p>
          <p className="dosmetic__container__left__paragraph">
            There are many problems that businesses face when selling abroad.
          </p>
        </div>
        <div className="dosmetic__container__right">
          <p>
            <img src={money} />
            Language and currency differences
          </p>
          <p>
            <img src={paymentMethod} />
            Many fraudulent payments appeared
          </p>
          <p>
            <img src={trade} />
            Difficult to send abroad
          </p>
          <p>
            <img src={checkout} />
            Order processing and warehousing
          </p>
          <p>
            <img src={rating} />
            Don't know how to attract customers
          </p>
          <p>
            <img src={fee} />
            Complicated taxes and fees arise when selling across borders
          </p>
        </div>
      </div>
      <div className="dosmetic__support">
        <p className="dosmetic__support__title">
          WHAT WILL KOIKICHI LOGISTIC SUPPORT?
        </p>
        <div className="dosmetic__support__rectangle">
          <div>
            <p className="dosmetic__support__rectangle__title">
              Multi-language support
            </p>
            <p className="dosmetic__support__rectangle__paragraph">
              Automatically translate Javascript tags and pop-ups into English
              and several other popular languages ​depending on the visitor's
              country. Receive multilingual order requests.
            </p>
          </div>
          <div>
            <p className="dosmetic__support__rectangle__title">
              International payment
            </p>
            <p className="dosmetic__support__rectangle__paragraph">
              Supports many international payment methods and prevents
              fraudulent payment accounts.
            </p>
          </div>
          <div>
            <p className="dosmetic__support__rectangle__title">
              Shipping abroad
            </p>
            <p className="dosmetic__support__rectangle__paragraph">
              Prepare customs documents, package shipments, international
              shipping and overseas last mile deliveries.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dosmetic;
