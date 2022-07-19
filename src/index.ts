import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import { router } from "./routes";
const PORT = process.env.PORT || 8080;
const app = express();

// app.use(express.static(__dirname + "../public"));
app.set("views", __dirname + "/views/pages");
app.set("view engine", "ejs");
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
