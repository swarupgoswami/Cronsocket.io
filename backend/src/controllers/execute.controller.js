import fetch from "node-fetch";

export const executeCode = async (req, res) => {
  try {
    const { language, code } = req.body;

    const extensions = {
      javascript: "js",
      python: "py",
      java: "java",
    };

    const fileExt = extensions[language] || "txt";

    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language,
        version: "*",
        files: [
          {
            name: `main.${fileExt}`,
            content: code,
          },
        ],
      }),
    });

    const data = await response.json();
    res.json(data);
    console.log("PISTON RESPONSE:", data);

  } catch (err) {
    console.error("Execution error:", err);
    res.status(500).json({ message: "Execution failed" });
  }
};
