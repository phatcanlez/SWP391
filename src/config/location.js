// promise + async await + class
//..../path/?query parameter=
const baseUrl = "https://provinces.open-api.vn/api";

class Http {
  async get(url) {
    //ai gọi get() thì ko chấm then đc ,chỉ nhận data,ko .then xử lý data tiếp đc, nên phải return
    let response = await fetch(url);
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(response.statusText);
    }
  }
}

class Store {
  constructor() {
    this.http = new Http();
  }

  //getProvinces: lấy danh sách các thành phố
  getProvinces(code = "") {
    //code = "" là default parameter nếu ko truyền gì hết thì nó rỗng
    return this.http.get(`${baseUrl}/p/${code}`);
  }
  // getDistrictsByProvinceCode: lấy dánh sách các Quận dựa vào provinceCode
  async getDistrictsByProvinceCode(provinceCode) {
    let province = await this.http.get(`${baseUrl}/p/${provinceCode}/?depth=2`);

    return province.districts;
  }
  // getWardsByDistrictCode: lấy dánh sách các Ward dựa vào districtCode
  async getWardsByDistrictCode(districtCode) {
    let district = await this.http.get(`${baseUrl}/d/${districtCode}/?depth=2`);
    return district.wards;
  }
}

class RenderUI {
  //renderProvinces: hàm nhận vào danh sách provinces và render lên UI
  renderProvinces(provinces) {
    let htmlContent = "";
    provinces.forEach((provinceItem) => {
      const { code, name } = provinceItem; //destructuring
      htmlContent += `<option value="${code}">${name}</option>`; //nếu để = nó sẽ ghi đè lên giá trị hiện có của biến cho từng vòng lặp
    }); //còn += cho phép nối giá trị vào mới vào cuối
    //nhét vào select#province
    document.querySelector("#province").innerHTML = htmlContent;
  }
  //renderDistricts: hàm nhận vào danh sách districts và render lên UI
  renderDistricts(districts) {
    let htmlContent = "";
    districts.forEach((districtItem) => {
      const { code, name } = districtItem;
      htmlContent += `<option value="${code}">${name}</option>`;
    });
    //nhét vào select#district
    document.querySelector("#district").innerHTML = htmlContent;
  }
  //renderWards: hàm nhận vào danh sách wards và render lên UI
  renderWards(wards) {
    let htmlContent = "";
    wards.forEach((wardItem) => {
      const { code, name } = wardItem;
      htmlContent += `<option value="${code}">${name}</option>`;
    });
    //nhét vào select#ward
    document.querySelector("#ward").innerHTML = htmlContent;
  }

  renderInformation(information) {
    // const { address, district, ward, province } = information; //phân rã
    // let htmlContent = `${address}, ${ward}, ${district}, ${province}`;
    // document.querySelector("#information").innerHTML = htmlContent;

    let htmlContent = "";
    for (const key in information) {
      htmlContent += information[key] ? `${information[key]}, ` : "";
    }
    htmlContent = htmlContent.slice(0, -2); //cắt 2 kí tự cuối
    document.querySelector("#information").innerHTML = htmlContent;
  }
}

//khi code gì ở đây thì mới vô web cũng sẽ chạy nhưng viết cho chuẩn chỉ thì
//sự kiện load trang     sự kiện sau khi trang web load xong thì mới chạy
document.addEventListener("DOMContentLoaded", async (event) => {
  let store = new Store();
  let ui = new RenderUI();

  let provinces = await store.getProvinces();

  //render danh sách provinces lên ui
  ui.renderProvinces(provinces);
  //lấy provinceCode hiện tại
  let provinceCode = document.querySelector("#province").value; //.value lấy đc mã lúc render

  //dùng provinceCode getDistrictsByProvinceCode
  // store.getDistrictsByProvinceCode(provinceCode).then((districts) => {}); này lấy quận tí lấy huyện nữa sẽ bị promise hell

  //tìm quận = provinceCode
  let districts = await store.getDistrictsByProvinceCode(provinceCode);
  ui.renderDistricts(districts);
  //lấy districtCode hiện tại
  let districtCode = document.querySelector("#district").value;
  //tìm ward bằng districtCode
  let wards = await store.getWardsByDistrictCode(districtCode);
  //render wards vừa thu đc lên ui
  ui.renderWards(wards);
});

//sự province bị thay đổi                           sự kiện thay đổi giá trị là change
document
  .querySelector("#province")
  .addEventListener("change", async (event) => {
    let store = new Store();
    let ui = new RenderUI();

    //lấy provinceCode hiện tại
    let provinceCode = document.querySelector("#province").value;
    //lấy các quận = provinceCode
    let districts = await store.getDistrictsByProvinceCode(provinceCode);
    ui.renderDistricts(districts);
    //lấy districtCode hiện tại
    let districtCode = document.querySelector("#district").value;
    //tìm ward bằng districtCode
    let wards = await store.getWardsByDistrictCode(districtCode);
    //render wards vừa thu đc lên ui
    ui.renderWards(wards);
  });

//sự kiện district bị thay đổi
document
  .querySelector("#district")
  .addEventListener("change", async (event) => {
    let store = new Store();
    let ui = new RenderUI();

    //lấy districtCode hiện tại
    let districtCode = document.querySelector("#district").value;
    //tìm ward bằng districtCode
    let wards = await store.getWardsByDistrictCode(districtCode);
    //render ward vừa lấy
    ui.renderWards(wards);
  });

//khi submit đặt hàng
document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
  let province = document.querySelector("#province option:checked").innerHTML; //vào option bị checked
  let district = document.querySelector("#district option:checked").innerHTML;
  let ward = document.querySelector("#ward option:checked")?.innerHTML; //
  let address = document.querySelector("#address").value; //input
  //làm cái hàm information
  let information = {
    //object
    address,
    ward,
    district,
    province,
  };

  //
  let ui = new RenderUI();
  ui.renderInformation(information);
  //phân rã để xài
});
let map;
let directionsService;
let directionsRenderer;

function initMap() {
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  const center = { lat: 21.0285, lng: 105.8542 }; // Hà Nội, Việt Nam
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 7,
    center: center,
  });
  directionsRenderer.setMap(map);
}

function calculateRoute() {
  const start = "Hà Nội, Việt Nam";
  const end = "Hồ Chí Minh, Việt Nam";
  const request = {
    origin: start,
    destination: end,
    travelMode: google.maps.TravelMode.DRIVING,
  };

  directionsService.route(request, (result, status) => {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsRenderer.setDirections(result);
      const distance = result.routes[0].legs[0].distance.text;
      document.getElementById(
        "output"
      ).innerHTML = `Khoảng cách từ ${start} đến ${end} là: ${distance}`;
    } else {
      document.getElementById("output").innerHTML =
        "Không thể tính toán khoảng cách.";
    }
  });
}

window.onload = () => {
  initMap();
  calculateRoute();
};

// ===============================================================
// tính toán số hộp cần để chứa cá
// window.onload = getTable;

let sizeInCM = [
  "-19.9",
  "20-25",
  "25.1 - 30",
  "30.1 - 40",
  "40.1 - 44",
  "44.1 - 50",
  "50.1 - 55",
  "55.1 - 65",
  "50 - 60 Hirenaga (Butterfly)",
  "60.1 - 65 Hirenaga (Butterfly)",
  "65.1 - 73",
  "73.1 - 83",
];
let sizeInInch = [
  "7.86",
  "7.87 - 9.84",
  "9.85 - 11.81",
  "11.82 - 15.75",
  "15.76 - 17.32",
  "17.33 - 19.6",
  "19.7 - 21.6",
  "21.7 - 25.5",
  "19.7 - 23.4",
  "23.5 - 25.5",
  "25.6 - 28.7",
  "28.8 - 32.6",
];

// function getTable() {
//   let table = document.getElementById("KOI_Table");
//   table.innerHTML = "";

//   for (let i = 0; i < sizeInCM.length; i++) {
//     let row = document.createElement("tr");
//     let td_1 = document.createElement("td");
//     let td_2 = document.createElement("td");
//     let td_3 = document.createElement("td");

//     td_1.innerHTML = sizeInCM[i];
//     td_2.innerHTML = sizeInInch[i];
//     td_3.innerHTML =
//       ' <input type="number" name="' +
//       i +
//       '" id="KOIQuantity' +
//       i +
//       '" class="form-control">';

//     row.appendChild(td_1);
//     row.appendChild(td_2);
//     row.appendChild(td_3);
//     table.append(row);
//   }
// }

let pointsArray = [
  "1.25",
  "2",
  "2.5",
  "3",
  "5",
  "7.5",
  "9",
  "14",
  "12",
  "14",
  "16",
  "18",
];

// let mediumBoxPoints = 9;
// let UPSChargesMedium = 190; //140;
// let surchargePerBoxMedium = 25; //20;

// let largeBoxPoints = 15;
// let UPSChargesLarge = 210; //179;
// let surchargePerBoxLarge = 25;

// let extraLargeBoxPoints = 16;
// let UPSChargesExtraLarge = 260; //259;
// let surchargePerBoxExtraLarge = 50;

// let specialLargeBoxPoints = 18;
// let UPSChargesSpecialLarge = 339;
// let surchargePerBoxSpecialLarge = 70;

// function calculatePoints() {
//   let totalPoints = 0;
//   let mediumBoxNeeded = 0,
//     noOfBoxesLarge = 0,
//     extraLargeBoxesQuantity = 0,
//     specialLargeBoxesQuantity = 0;

//   let extraKOI = 0,
//     extraKOI2 = 0,
//     extraKOI3 = 0,
//     extraKOI4 = 0,
//     extraKOI5 = 0;
//   let extraKOISize = 0,
//     extraKOISize2 = 0,
//     extraKOISize3 = 0,
//     extraKOISize4 = 0,
//     extraKOISize5 = 0;

//   for (let i = 0; i < pointsArray.length - 2; i++) {
//     let points =
//       parseFloat(document.getElementById("KOIQuantity" + i).value) || 0;
//     totalPoints += points * parseFloat(pointsArray[i]);
//   }

//   let remainingPoints = 0;

//   let extraLargeBoxesIndex = Number(pointsArray.length - 2);

//   extraLargeBoxesQuantity =
//     parseFloat(
//       document.getElementById("KOIQuantity" + extraLargeBoxesIndex).value
//     ) || 0;

//   let specialLargeBoxesIndex = Number(pointsArray.length - 1);
//   specialLargeBoxesQuantity =
//     parseFloat(
//       document.getElementById("KOIQuantity" + specialLargeBoxesIndex).value
//     ) || 0;

//   if (totalPoints % mediumBoxPoints == 0) {
//     mediumBoxNeeded = totalPoints / mediumBoxPoints;
//     remainingPoints = 0;
//   } else if (totalPoints % largeBoxPoints == 0) {
//     noOfBoxesLarge = totalPoints / largeBoxPoints;
//     remainingPoints = 0;
//   } else {
//     if (totalPoints < largeBoxPoints && totalPoints < mediumBoxPoints) {
//       mediumBoxNeeded = 1;
//       remainingPoints = mediumBoxPoints - totalPoints;
//     } else if (totalPoints <= largeBoxPoints && totalPoints > mediumBoxPoints) {
//       noOfBoxesLarge = 1;
//       remainingPoints = largeBoxPoints - totalPoints;
//     } else {
//       noOfBoxesLarge = totalPoints / largeBoxPoints;
//       remainingPoints = Math.abs(
//         Math.floor(noOfBoxesLarge) * largeBoxPoints - totalPoints
//       );
//       if (remainingPoints <= 9) {
//         mediumBoxNeeded++;
//         remainingPoints = mediumBoxPoints - remainingPoints;
//       } else if (remainingPoints > 9 && remainingPoints <= 15) {
//         mediumBoxNeeded += 2;
//         remainingPoints = mediumBoxPoints * mediumBoxNeeded - remainingPoints;
//       }
//     }
//   }

//   if (remainingPoints > 0) {
//     extraKOI = Math.floor(remainingPoints / 1.25);
//     extraKOISize = "19 CM" + "  (" + sizeInInch[0] + " Inch)";

//     extraKOI2 = Math.floor(remainingPoints / 2);
//     extraKOISize2 = "20-25 CM" + "  (" + sizeInInch[1] + " Inch)";

//     extraKOI3 = Math.floor(remainingPoints / 2.5);
//     extraKOISize3 = "25.5 - 30 CM" + "  (" + sizeInInch[2] + " Inch)";

//     extraKOI4 = Math.floor(remainingPoints / 3);
//     extraKOISize4 = "30.5 - 40 CM" + "  (" + sizeInInch[3] + " Inch)";

//     extraKOI5 = Math.floor(remainingPoints / 5);
//     extraKOISize5 = "40.5 - 44 CM" + "  (" + sizeInInch[4] + " Inch)";
//   } else {
//     // extraKOI = 0;
//     // extraKOISize = 0;
//     extraKOI = Math.floor(remainingPoints / 1.25);
//     extraKOISize = "19 CM" + "  (" + sizeInInch[0] + " Inch)";

//     extraKOI2 = Math.floor(remainingPoints / 2);
//     extraKOISize2 = "20-25 CM" + "  (" + sizeInInch[1] + " Inch)";

//     extraKOI3 = Math.floor(remainingPoints / 2.5);
//     extraKOISize3 = "25.5 - 30 CM" + "  (" + sizeInInch[2] + " Inch)";

//     extraKOI4 = Math.floor(remainingPoints / 3);
//     extraKOISize4 = "30.5 - 40 CM" + "  (" + sizeInInch[3] + " Inch)";

//     extraKOI5 = Math.floor(remainingPoints / 5);
//     extraKOISize5 = "40.5 - 44 CM" + "  (" + sizeInInch[4] + " Inch)";
//   }

//   let shippingCostLargeBox =
//     Math.floor(noOfBoxesLarge) * (UPSChargesLarge + surchargePerBoxLarge);
//   let shippingCostMediumBox =
//     mediumBoxNeeded * (UPSChargesMedium + surchargePerBoxMedium);
//   let shippingCostExtraLargeBox =
//     extraLargeBoxesQuantity *
//     (UPSChargesExtraLarge + surchargePerBoxExtraLarge);
//   let shippingCostSpecialLargeBox =
//     specialLargeBoxesQuantity *
//     (UPSChargesSpecialLarge + surchargePerBoxSpecialLarge);
//   let shippingCost =
//     shippingCostLargeBox +
//     shippingCostMediumBox +
//     shippingCostExtraLargeBox +
//     shippingCostSpecialLargeBox;
//   document.getElementById("shippingCost").innerHTML = toComma(shippingCost);
//   document.getElementById(
//     "extraKOI"
//   ).innerHTML = `You can purchase this many more koi, of each size, to fit in the same size box shown above. <br><br>
// <span class="red mt-2 text-left">${Math.round(
//     extraKOI
//   )}</span> of <a class="rangelink" href="/shop/live-koi/?swoof=1&slider_wc_custom_size=0^7.86">${extraKOISize}</a> or,
// <br><br> <span class="red mt-2 text-left">${Math.round(
//     extraKOI2
//   )}</span> of <a class="rangelink" href="/shop/live-koi/?swoof=1&slider_wc_custom_size=7.87^9.84">${extraKOISize2}</a> or,
// <br><br> <span class="red mt-2 text-left">${Math.round(
//     extraKOI3
//   )}</span> of <a class="rangelink" href="/shop/live-koi/?swoof=1&slider_wc_custom_size=9.85^11.81">${extraKOISize3}</a> or,
// <br><br> <span class="red mt-2 text-left">${Math.round(
//     extraKOI4
//   )}</span> of <a class="rangelink" href="/shop/live-koi/?swoof=1&slider_wc_custom_size=11.82^15.75">${extraKOISize4}</a> or,
// <br><br> <span class="red mt-2 text-left">${Math.round(
//     extraKOI5
//   )}</span> of <a class="rangelink" href="/shop/live-koi/?swoof=1&slider_wc_custom_size=15.76^17.32">${extraKOISize5}</a>
// <br><br><p id="calcCTA"> Click koi size ranges to <a class="rangelink" href="/shop/live-koi/">search for koi</a> of that size to add to the box.</p>`;

//   document.getElementById("boxesNeeded").innerHTML = `${Math.floor(
//     noOfBoxesLarge
//   )} large boxes , ${mediumBoxNeeded} medium boxes, ${extraLargeBoxesQuantity} extra large boxes and ${specialLargeBoxesQuantity} special large boxes`;
//   document.getElementById("resultDiv").scrollIntoView({ behavior: "smooth" });
// }

// let toComma = (x) =>
//   "$" +
//   x
//     .toFixed(2)
//     .toString()
//     .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
let mediumBoxPoints = 9;
let UPSChargesMedium = 190;
let surchargePerBoxMedium = 25;

let largeBoxPoints = 15;
let UPSChargesLarge = 210;
let surchargePerBoxLarge = 25;

let extraLargeBoxPoints = 16;
let UPSChargesExtraLarge = 260;
let surchargePerBoxExtraLarge = 50;
function calculatePoints() {
  let totalPoints = 0;
  let mediumBoxNeeded = 0,
    noOfBoxesLarge = 0,
    extraLargeBoxesQuantity = 0;
  let extraKOI = 0,
    extraKOI2 = 0,
    extraKOI3 = 0,
    extraKOI4 = 0,
    extraKOI5 = 0;
  let extraKOISize = 0,
    extraKOISize2 = 0,
    extraKOISize3 = 0,
    extraKOISize4 = 0,
    extraKOISize5 = 0;

  for (let i = 0; i < pointsArray.length; i++) {
    let points =
      parseFloat(document.getElementById("KOIQuantity" + i).value) || 0;
    totalPoints += points * parseFloat(pointsArray[i]);
  }

  let remainingPoints = 0;

  if (totalPoints % mediumBoxPoints == 0) {
    mediumBoxNeeded = totalPoints / mediumBoxPoints;
    remainingPoints = 0;
  } else if (totalPoints % largeBoxPoints == 0) {
    noOfBoxesLarge = totalPoints / largeBoxPoints;
    remainingPoints = 0;
  } else {
    if (totalPoints < largeBoxPoints && totalPoints < mediumBoxPoints) {
      mediumBoxNeeded = 1;
      remainingPoints = mediumBoxPoints - totalPoints;
    } else if (totalPoints <= largeBoxPoints && totalPoints > mediumBoxPoints) {
      noOfBoxesLarge = 1;
      remainingPoints = largeBoxPoints - totalPoints;
    } else {
      noOfBoxesLarge = Math.floor(totalPoints / largeBoxPoints);
      remainingPoints = totalPoints - noOfBoxesLarge * largeBoxPoints;
      if (remainingPoints <= mediumBoxPoints) {
        mediumBoxNeeded++;
        remainingPoints = mediumBoxPoints - remainingPoints;
      } else {
        noOfBoxesLarge++;
        remainingPoints = largeBoxPoints - remainingPoints;
      }
    }
  }

  if (remainingPoints > 0) {
    extraKOI = Math.floor(remainingPoints / 1.25);
    extraKOISize = "19 CM" + "  (" + sizeInInch[0] + " Inch)";
    extraKOI2 = Math.floor(remainingPoints / 2);
    extraKOISize2 = "20-25 CM" + "  (" + sizeInInch[1] + " Inch)";
    extraKOI3 = Math.floor(remainingPoints / 2.5);
    extraKOISize3 = "25.5 - 30 CM" + "  (" + sizeInInch[2] + " Inch)";
    extraKOI4 = Math.floor(remainingPoints / 3);
    extraKOISize4 = "30.5 - 40 CM" + "  (" + sizeInInch[3] + " Inch)";
    extraKOI5 = Math.floor(remainingPoints / 5);
    extraKOISize5 = "40.5 - 44 CM" + "  (" + sizeInInch[4] + " Inch)";
  }

  let shippingCostLargeBox =
    noOfBoxesLarge * (UPSChargesLarge + surchargePerBoxLarge);
  let shippingCostMediumBox =
    mediumBoxNeeded * (UPSChargesMedium + surchargePerBoxMedium);
  let shippingCostExtraLargeBox =
    extraLargeBoxesQuantity *
    (UPSChargesExtraLarge + surchargePerBoxExtraLarge);
  let shippingCost =
    shippingCostLargeBox + shippingCostMediumBox + shippingCostExtraLargeBox;

  document.getElementById("shippingCost").innerHTML = toComma(shippingCost);
  document.getElementById(
    "extraKOI"
  ).innerHTML = `You can purchase this many more koi, of each size, to fit in the same size box shown above. <br><br>
    <span class="red mt-2 text-left">${Math.round(
      extraKOI
    )}</span> of <a class="rangelink" href="/shop/live-koi/?swoof=1&slider_wc_custom_size=0^7.86">${extraKOISize}</a> or,
    <br><br> <span class="red mt-2 text-left">${Math.round(
      extraKOI2
    )}</span> of <a class="rangelink" href="/shop/live-koi/?swoof=1&slider_wc_custom_size=7.87^9.84">${extraKOISize2}</a> or,
    <br><br> <span class="red mt-2 text-left">${Math.round(
      extraKOI3
    )}</span> of <a class="rangelink" href="/shop/live-koi/?swoof=1&slider_wc_custom_size=9.85^11.81">${extraKOISize3}</a> or,
    <br><br> <span class="red mt-2 text-left">${Math.round(
      extraKOI4
    )}</span> of <a class="rangelink" href="/shop/live-koi/?swoof=1&slider_wc_custom_size=11.82^15.75">${extraKOISize4}</a> or,
    <br><br> <span class="red mt-2 text-left">${Math.round(
      extraKOI5
    )}</span> of <a class="rangelink" href="/shop/live-koi/?swoof=1&slider_wc_custom_size=15.76^17.32">${extraKOISize5}</a>
    <br><br><p id="calcCTA"> Click koi size ranges to <a class="rangelink" href="/shop/live-koi/">search for koi</a> of that size to add to the box.</p>`;

  document.getElementById(
    "boxesNeeded"
  ).innerHTML = `${noOfBoxesLarge} large boxes , ${mediumBoxNeeded} medium boxes, ${extraLargeBoxesQuantity} extra large boxes`;
  document.getElementById("resultDiv").scrollIntoView({ behavior: "smooth" });
}

let toComma = (x) =>
  "$" +
  x
    .toFixed(2)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
