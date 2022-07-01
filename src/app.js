const { App, ExpressReceiver } = require("@slack/bolt");
const axios = require("axios").default;
const bodyParser = require("body-parser");

const receiver = new ExpressReceiver({
  signingSecret: "your_Signing_secret"
});

const app = new App({
  token: "your_Bot_Token",
  receiver: receiver
});

// receiver.app.use(bodyParser.json);

receiver.app.use(bodyParser.json());

receiver.app.get("/", (_, res) => {
  res.status(200).send("Hello World! from bolt");
});

receiver.app.post("/bot", (req, res) => {
  console.log(req.body.messages.length);
  for (let i = 0; i < req.body.messages.length; i++) {
    // say(req.body.messages[i].content)
    axios
      .post(
        "https://slack.com/api/chat.postMessage",
        {
          channel: req.body.userId,
          text: req.body.messages[i].content
        },
        {
          headers: {
            Authorization:
              "Bearer xoxb-4708139310-3753165626993-TNoxGsR6fe9e1mOmV52xoItX",
            "Content-Type": "application/json"
          }
        }
      )
      .then(function (response) {
        console.log(response.data);
        // say("dasdsad");
      })
      .catch(function (error) {
        console.log(error.response);
      });
  }
  res.status(200).send("Hello World! from bolt");
});

app.event("message", ({ event }) => {
  console.log(event);
  axios
    .post(
      "https://kanal.kata.ai/receive_message/186bc686-b1f2-41cd-bee9-248c5f6a1df8",
      {
        userId: event.channel,
        messages: [
          {
            type: "text",
            content: event.text
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
    .then(function (response) {
      console.log(response.data);
      // say("dasdsad");
    })
    .catch(function (error) {
      console.log(error.response);
    });
});

// app.message(/^help$/, ({ say }) => {
//   say(`Available Message: URL, help, debug`);
// });

// app.message("hello", ({ message, say }) => {
//   say(
//     `Hey there <@${message.user}>!\nYour message.user is ${JSON.stringify(
//       message.user
//     )}`
//   );
// });

// app.message("debug", ({ message, payload, body, say }) => {
//   say(`body : ${JSON.stringify(body, "", 4)}`);
//   say(
//     `payload : ${
//       JSON.stringify(payload) === JSON.stringify(body.event) ? "" : "NOT"
//     } equals body.event\n` +
//       `message : ${
//         JSON.stringify(message) === JSON.stringify(payload) ? "" : "NOT"
//       } equals payload`
//   );
// });

app.error((error) => {
  console.error(error);
});

(async () => {
  await app.start(process.env.PORT || 8080);
  console.log("⚡️ Bolt app is running!");
})();
