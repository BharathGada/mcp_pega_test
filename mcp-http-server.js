import express from "express";

const app = express();

// ✅ parse JSON safely
app.use(express.json());

// ✅ In-memory data
const cases = [
  { case_id: "CASE-101", status: "OPEN" },
  { case_id: "CASE-102", status: "CLOSED" },
  { case_id: "CASE-103", status: "OPEN" }
];

// ✅ ✅ GET /mcp → return tools (IMPORTANT FIX)
app.get("/mcp", (req, res) => {
  return res.json({
    jsonrpc: "2.0",
    id: 1,
    result: {
      tools: [
        {
          name: "get_cases",
          description: "Fetch cases",
          inputSchema: {
            type: "object",
            properties: {
              status: { type: "string" }
            }
          }
        },
        {
          name: "get_summary",
          description: "Get case summary",
          inputSchema: {
            type: "object",
            properties: {}
          }
        }
      ]
    }
  });
});

// ✅ ✅ POST /mcp
app.post("/mcp", async (req, res) => {
  try {
    const body = req.body || {};
    const method = body.method;
    const params = body.params || {};
    const id = body.id || 1;

    // ✅ If no method → return tools (IMPORTANT)
    if (!method) {
      return res.json({
        jsonrpc: "2.0",
        id: id,
        result: {
          tools: [
            {
              name: "get_cases",
              description: "Fetch cases"
            },
            {
              name: "get_summary",
              description: "Get summary"
            }
          ]
        }
      });
    }

    // ✅ tools/list
    if (method === "tools/list") {
      return res.json({
        jsonrpc: "2.0",
        id: id,
        result: {
          tools: [
            {
              name: "get_cases",
              description: "Fetch cases",
              inputSchema: {
                type: "object",
                properties: {
                  status: { type: "string" }
                }
              }
            },
            {
              name: "get_summary",
              description: "Get summary",
              inputSchema: {
                type: "object",
                properties: {}
              }
            }
          ]
        }
      });
    }

    // ✅ tools/call
    if (method === "tools/call") {
      const { name, arguments: args } = params;

      let result;

      if (name === "get_cases") {
        result = cases.filter(c =>
          !args?.status || c.status === args.status.toUpperCase()
        );
      }

      if (name === "get_summary") {
        const summary = {};
        cases.forEach(c => {
          summary[c.status] = (summary[c.status] || 0) + 1;
        });
        result = summary;
      }

      return res.json({
        jsonrpc: "2.0",
        id: id,
        result: {
          content: [
            {
              type: "text",
              text: JSON.stringify(result)
            }
          ]
        }
      });
    }

    // ✅ fallback
    return res.json({
      jsonrpc: "2.0",
      id: id,
      result: {}
    });

  } catch (err) {
    return res.json({ status: "ok" });
  }
});

// ✅ start server
app.listen(4000, "0.0.0.0", () => {
  console.log("✅ MCP running on port 4000");
});
