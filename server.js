import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const app = express();   // ✅ REQUIRED
app.use(express.json());

// DB setup
const adapter = new JSONFile("db.json");
const db = new Low(adapter, { cases: [] });

async function initDB() {
  await db.read();

  if (!db.data || db.data.cases.length === 0) {
    db.data = {
      cases: [
        { case_id: "CASE-101", status: "OPEN" },
        { case_id: "CASE-102", status: "CLOSED" },
        { case_id: "CASE-103", status: "OPEN" }
      ]
    };
    await db.write();
  }
}

await initDB();

// ✅ API
app.post("/get-cases", async (req, res) => {
  await db.read();

  res.json({
    data: db.data.cases
  });
});

// ✅ Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});