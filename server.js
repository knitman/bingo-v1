const express = require("express");
const QRCode = require("qrcode");
const { v4: uuid } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

let tickets = {};

// Δημιουργία κουπονιού
app.post("/create-ticket", async (req, res) => {
  const id = uuid();

  let numbers = [];
  while (numbers.length < 15) {
    let n = Math.floor(Math.random() * 75) + 1;
    if (!numbers.includes(n)) numbers.push(n);
  }

  tickets[id] = numbers;

  const url = `${req.protocol}://${req.get("host")}/ticket.html?id=${id}`;
  const qr = await QRCode.toDataURL(url);

  res.json({ id, qr });
});

// Πάρε κουπόνι
app.get("/ticket/:id", (req, res) => {
  const ticket = tickets[req.params.id];
  if (!ticket) return res.status(404).json({ error: "Δεν υπάρχει" });
  res.json(ticket);
});

app.listen(PORT, () =>
  console.log("Server running on port", PORT)
);
