/* eslint-disable no-dupe-keys */
const express = require("express");
const path = require("path");
// const morgan = require("morgan");
// const client = require('../Client/build')
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const bodyParser = require("body-parser");
// const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const textbookRouter = require("./Routes/textbookRoutes");
const conversationssRouter = require("./Routes/conversationRoutes");
const userRouter = require("./Routes/userRoutes");
//const { Server } = require("socket.io");

const app = express();
// app.locals.moment = require("moment-timezone");
app.use(cookieParser());

app.enable("trust proxy");
// app.use(
//   bodyParser.json({
//     verify: (req, res, buf) => {
//       req.rawBody = buf;
//     },
//   })
// );
// app.use(bodyParser.urlencoded({ extended: true }));

const whitelist = [
  "http://localhost:3000",
  "http://localhost:19006",
  "http://localhost:8081",
  "https://spectacular-granita-d9ed1d.netlify.app/"
];

var corsOptions = {
  origin: function (origin, callback) {
    var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
    callback(null, originIsWhitelisted);
  },
  credentials: true,
};
app.use(cors(corsOptions));
//app.use(cors(corsOptions))




// app.use(
//   cors({
//     credentials: true,
//     origin:
//       process.env.NODE_ENV === "production"
//         ? "https://www.textbook_350.com"
//         : "http://localhost:3000",
//   })
// );

// app.options("*", cors()); //FIX!!!

/*app.use(cors({

origin: 'https://www.textbook_350.com})? */

//MIDDLEWARES
//console.log(process.env.NODE_ENV);
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", "data:", "blob:"],

      baseUri: ["'self'"],

      fontSrc: ["'self'", "https:", "data:"],

      scriptSrc: ["'self'", "https://*.cloudflare.com"],

      scriptSrc: ["'self'", "https://*.stripe.com"],

      scriptSrc: ["'self'", "http:", "https://*.mapbox.com", "data:"],

      frameSrc: ["'self'", "https://*.stripe.com"],

      objectSrc: ["'none'"],

      styleSrc: ["'self'", "https:", "unsafe-inline"],

      workerSrc: ["'self'", "data:", "blob:"],

      childSrc: ["'self'", "blob:"],

      imgSrc: ["'self'", "data:", "blob:"],

      connectSrc: ["'self'", "blob:", "https://*.mapbox.com"],

      upgradeInsecureRequests: [],
    },
  })
);
//1) GLOBAL MIDDLEWARES
//app.use(helmet());

const limiter = rateLimit({
  max: 300,
  window: 60 * 60 * 1000,
  message: "too many requests from that IP please try again in an hour",
});
app.use("/api", limiter);

// app.post( STRIPE!
//   "/webhook-checkout",
//   express.raw({ type: "application/json" }),
//   bookingController.webhookCheckout
// );

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/Client/build")));
}

app.use(express.json({ limit: "10kb" }));
//Data sanitization against NoSQL query injection
app.use(mongoSanitize());
//Data sanitization against XSS
app.use(xss());
//Parameter pollution
//DO this???

//ROUTE HANDLERS

// add other server routes to path array

// app.use(
//   "/api",
//   createProxyMiddleware({
//     target: "http://localhost:8080",
//     changeOrigin: true,
//   })
// );

app.use("/api/v1/conversations", conversationssRouter);
app.use("/api/v1/textbooks", textbookRouter);
app.use("/api/v1/users", userRouter);


// app.get("/*", function (req, res) {
//   res.sendFile(
//     path.join(__dirname, "../Client/build/index.html"),
//     function (err) {
//       if (err) {
//         res.status(500).send(err);
//       }
//     } //try without this first!
//   );
// });

app.all("*", (req, res, next) => {
  return res.status(404).json({
      message: 'could not find the appropriate route.'
  })
//   next(new AppError(`Can't find ${req.originalUrl} on this server!`), 404);
});
// app.use(globalErrorHandler);

module.exports = app;
