import express from "express";

const app = express();

// ✅ parse JSON safely
app.use(express.json());

// ✅ ✅ GET /mcp (Pega test)
app.get("/mcp", (req, res) => {
  return res.status(200).json({
    status: "ok"
  });
});

// ✅ POST /mcp
app.post("/mcp", async (req, res) => {
  try {
    const body = req.body || {};

    // ✅ Connectivity test (empty call)
    if (!body || Object.keys(body).length === 0) {
      return res.status(200).json({
        status: "ok"
      });
    }

    const method = body.method;
    const params = body.params || {};
    const id = body.id || 1;

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

      let response;

      if (name === "get_cases") {
        response = await fetch("http://localhost:3000/get-cases", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(args || {})
        });
      }

      if (name === "get_summary") {
        response = await fetch("http://localhost:3000/summary");
      }

      if (!response) {
        return res.json({
          jsonrpc: "2.0",
          id: id,
          result: {}
        });
      }

      const data = await response.json();

      return res.json({
        jsonrpc: "2.0",
        id: id,
        result: {
          content: [
            {
              type: "text",
              text: JSON.stringify(data)
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
    return res.status(200).json({
      status: "ok"
    });
  }
});

// ✅ expose publicly
app.listen(4000, "0.0.0.0", () => {
  console.log("✅ MCP running on port 4000");
});
``
