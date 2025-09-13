import { FastMCP } from "fastmcp";
import { weatherTool, weatherToolSchema } from "./weather.js";

const server = new FastMCP({
  name: "Weather MCPServer",
  version: "1.0.0",
});

// This is a simple weather tool implementation that returns mock weather data. Replace this with your actual weather API
server.addTool({
  name: "get_weather",
  description: "Call to get the current weather.",
  parameters: weatherToolSchema,
  execute: async (args) => {
    try {
      const result = await weatherTool.execute(args);
      return JSON.stringify(result, null, 2);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      return JSON.stringify({
        success: false,
        totalDevicesProcessed: 0,
        successes: [],
        failures: [],
        message: `Tool execution failed: ${errorMsg}`
      }, null, 2);
    }
  },
});

server.start({
  transportType: "httpStream",
  httpStream: {
    port: 8080,
  },
});
