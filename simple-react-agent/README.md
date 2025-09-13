# Simple ReAct Agent

A basic implementation of the ReAct (Reasoning and Action) pattern using LangGraph's prebuilt agent. This example demonstrates how an AI agent can reason about user queries, decide when to use tools, and provide intelligent responses based on the results.

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

### 3. Run the Agent

```bash
npx tsx src/agent.ts
```

The agent will prompt you for a weather question and respond interactively.

## Example Interaction

```
? Ask any weather question? What's the weather like in San Francisco?

AI Thinking: I need to get the current weather information for San Francisco.

<<Calling get_weather with location: "San Francisco">>

AI: The current weather in San Francisco is 60 degrees and foggy. This is pretty typical for San Francisco, which is known for its cool, foggy climate even during warmer months!
```

## Learn More

- [LangGraph Documentation](https://docs.langchain.com/oss/javascript/langgraph/overview)
- [LangGraph's createReactAgent Docs](https://langchain-ai.github.io/langgraphjs/reference/functions/langgraph_prebuilt.createReactAgent.html)
