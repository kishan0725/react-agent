import { z } from "zod";
import { ChatBedrockConverse } from "@langchain/aws";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { tool } from "@langchain/core/tools";
import { input } from "@inquirer/prompts";

import dotenv from "dotenv";
import { AIMessage } from "@langchain/core/messages";

dotenv.config();

const getWeather = tool((input) => {
  if (["sf", "san francisco"].includes(input.location.toLowerCase())) {
    return "It's 60 degrees and foggy.";
  } else {
    return "It's 90 degrees and sunny.";
  }
}, {
  name: "get_weather",
  description: "Call to get the current weather.",
  schema: z.object({
    location: z.string().describe("Location to get the weather for."),
  })
})

const model = new ChatBedrockConverse({
  model: "us.anthropic.claude-3-7-sonnet-20250219-v1:0",
  streaming: true,
  temperature: 0.3,
  maxTokens: 64000
})

const agent = createReactAgent({
    llm: model,
    tools: [getWeather],
    prompt: "You are a helpful weather assistant."
});

const userInput = await input({
  message: "Ask any weather question?",
});

await agent.invoke({
    messages: [{ role: "user", content: userInput }],
}).then((res) => {
    res.messages.forEach((message) => {
        if(message.getType() === "ai") {
            const aiMessage = message as AIMessage;
            if (aiMessage.tool_calls && aiMessage.tool_calls.length) {
                console.log("AI Thinking:", aiMessage.content);
            }
            else {
                console.log("AI:", aiMessage.content);
            }
        }
    })
})
