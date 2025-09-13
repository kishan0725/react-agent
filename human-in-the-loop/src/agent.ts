import { MemorySaver, MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { tool } from "@langchain/core/tools";
import { z } from "zod/v4";
import { ChatBedrockConverse } from "@langchain/aws";
import { AIMessage, SystemMessage } from "@langchain/core/messages";

import dotenv from "dotenv";
import { addHumanInTheLoop } from "src/humanInterrupt.js";

dotenv.config();

const checkpointer = new MemorySaver();

const bookHotel = tool(
  async ({ hotelName }) => {
    return `Successfully booked a stay at ${hotelName}.`;
  },
  {
    name: "bookHotel",
    description: "Book a hotel",
    schema: z.object({
      hotelName: z.string(),
    }),
  }
);

const bookFlightTicket = tool(
  async ({ cityName, flightNumber }) => {
    return `Successfully booked ticket at ${cityName} with flight number ${flightNumber}.`;
  },
  {
    name: "bookFlightTicket",
    description: "Book a flight ticket",
    schema: z.object({
      cityName: z.string(),
      flightNumber: z.string(),
    }),
  }
);

// Define the tools for the agent to use
const tools = [addHumanInTheLoop(bookHotel), addHumanInTheLoop(bookFlightTicket)];
const toolNode = new ToolNode(tools);

// Create a model and give it access to the tools
const model = new ChatBedrockConverse({
  model: "us.anthropic.claude-3-7-sonnet-20250219-v1:0",
  streaming: true,
  temperature: 0.3,
  maxTokens: 64000
}).bindTools(tools);

// Define the function that determines whether to continue or not
function shouldContinue({ messages }: typeof MessagesAnnotation.State) {
  const lastMessage = messages[messages.length - 1] as AIMessage;

  // If the LLM makes a tool call, then we route to the "tools" node
  if (lastMessage.tool_calls?.length) {
    return "tools";
  }
  // Otherwise, we stop (reply to the user) using the special "__end__" node
  return "__end__";
}

// Define the function that calls the model
async function callModel(state: typeof MessagesAnnotation.State) {
  const response = await model.invoke([
    new SystemMessage({
      content: `
        You are a helpful assistant who should help user with travel and hotel booking.
        You should use the tools provided to book a hotel or flight ticket.
        If user ask for anything else, you should politely inform them that you can only help with travel and hotel booking.
      `
    }),
    ...state.messages
  ]);

  return { messages: [response] };
}

// Define a new graph
const workflow = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addNode("tools", toolNode)

  .addEdge("__start__", "agent") // __start__ is a special name for the entrypoint
  .addConditionalEdges("agent", shouldContinue)
  .addEdge("tools", "agent")
  
export const agent = workflow.compile({ checkpointer }); // Finally, we compile it into a LangChain Runnable.

// const config = { configurable: { thread_id: "1" } };

// const stream = await app.stream(
//   { messages: [{ role: "user", content: "book a stay at McKittrick hotel" }] },
//   config
// );

// for await (const chunk of stream) {
//   console.log(chunk);
//   console.log("\n");
// }