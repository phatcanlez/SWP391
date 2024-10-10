Feature("ai ");

// Scenario("test something", ({ I }) => {
//   I.amOnPage("https://web.facebook.com/?locale2=vi_VN&_rdc=1&_rdr");
//   pause();
// });

// Feature("Facebook login page");

Scenario("Check that Facebook logo is displayed", ({ I }) => {
  I.amOnPage("https://web.facebook.com/?locale2=vi_VN&_rdc=1&_rdr");
  I.seeElement('#globalContainer img[alt="Facebook"]');
});

Scenario("Check that email input field is displayed and enabled", ({ I }) => {
  I.amOnPage("https://web.facebook.com/?locale2=vi_VN&_rdc=1&_rdr");
  I.seeElement("#email");
  I.canSeeInField("#email", "");
  I.seeElement("#email").shouldBeActive();
});

Scenario("Check that password input field is displayed and hidden", ({ I }) => {
  I.amOnPage("https://web.facebook.com/?locale2=vi_VN&_rdc=1&_rdr");
  I.seeElement("#pass");
  I.see("", "#pass");
  I.dontSeeElement("#pass").within(":focus");
});

Scenario(
  "Check that login button is disabled when email and password fields are empty",
  ({ I }) => {
    I.amOnPage("https://web.facebook.com/?locale2=vi_VN&_rdc=1&_rdr");
    I.seeElement("#u_0_5_p0");
    I.dontSeeElement("#u_0_5_p0").within(":enabled");
  }
);

Scenario("Check that user can navigate to create account page", ({ I }) => {
  I.amOnPage("https://web.facebook.com/?locale2=vi_VN&_rdc=1&_rdr");
  I.click("#u_0_0_3B");
  I.seeInCurrentUrl("/signup/");
});
