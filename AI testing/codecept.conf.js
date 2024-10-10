const { setHeadlessWhen, setCommonPlugins } = require("@codeceptjs/configure");
// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);

// enable all common plugins https://github.com/codeceptjs/configure#setcommonplugins
setCommonPlugins();

/** @type {CodeceptJS.MainConfig} */
exports.config = {
  tests: "./*_test.js",
  output: "./output",
  helpers: {
    Playwright: {
      browser: "chromium",
      url: "http://localhost",
      show: true,
    },
  },
  include: {
    I: "./steps_file.js",
  },
  name: "AI testing",

  ai: {
    request: async (messages) => {
      const Groq = require("groq-sdk");
      const groq = new Groq({
        apiKey: "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",
      });
      const chatCompletion = await groq.chat.completions.create({
        messages,
        model: "mixtral-8x7b-32768",
      });
      return chatCompletion.choices[0]?.message?.content || "";
    },
  },
};
