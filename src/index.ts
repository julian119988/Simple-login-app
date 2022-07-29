import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import { router } from "./routes";
import cookieParser from "cookie-parser";
import "./passport";
import session from "express-session";
import passport from "passport";
const PORT = process.env.PORT || 8080;
const app = express();

// app.use(express.static(__dirname + "../public"));
app.set("views", __dirname + "/views/pages");
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(
  session({
    name: "session",
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`App started on port: ${PORT}`);
});
