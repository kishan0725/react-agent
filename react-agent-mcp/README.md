# ReAct Agent with MCP

A ReAct (Reasoning and Action) agent implementation using the Model Context Protocol (MCP). This example demonstrates how to create a distributed architecture where tools are served by an MCP server and consumed by a LangChain agent through standardized protocol communication.

## Prerequisites

- Node.js 18+
- AWS account with Bedrock access
- AWS credentials configured

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your AWS credentials:

```env
AWS_ACCESS_KEY_ID=your_aws_access_key_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key_here
AWS_REGION=us-east-1
AWS_SESSION_TOKEN=your_aws_session_token_here  # Optional, for temporary credentials
```

## Running Instructions

This example requires running two separate processes:

### 1. Start the MCP Server (Terminal 1)

```bash
npx tsx src/mcp-server/index.ts
```

This starts the FastMCP server on port 8080, serving the weather tool via HTTP streaming on `/sse` endpoint.

### 2. Start the ReAct Agent (Terminal 2)

```bash
npx tsx src/agent.ts
```

The agent will connect to the MCP server, discover available tools, and prompt for weather questions.

## How It Works

1. **Server Startup**: FastMCP server exposes weather tool on `http://localhost:8080`
2. **Agent Connection**: Agent connects via `MultiServerMCPClient` using SSE transport
3. **Tool Discovery**: Agent automatically discovers available tools from server
4. **ReAct Pattern**: Agent reasons, acts (calls MCP tools), and observes results
5. **Response**: User receives weather information through standard ReAct flow

## Example Interaction

```
? Ask any weather question? What's the weather like in New York?

AI Thinking: I need to get the current weather information for New York.

<<Calling MCP server's get_weather tool with location: "New York">>

AI: The current weather in New York is 90 degrees and sunny. It's a beautiful day!
```

## Learn More

- [Model Context Protocol Specification](https://spec.modelcontextprotocol.io/)
- [FastMCP Documentation](https://github.com/punkpeye/fastmcp) - Typescript version of FastMCP
- [LangChain MCP Documentation](https://docs.langchain.com/oss/javascript/langchain/mcp)
