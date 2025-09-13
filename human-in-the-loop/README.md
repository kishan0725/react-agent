# LangGraph Interrupt with Human-In-The-Loop

This example showcases an implementation of human-in-the-loop functionality with LangGraph, featuring a travel booking agent that can interrupt execution for human review and approval. This project integrates with [Agent Inbox](https://github.com/langchain-ai/agent-inbox) to provide a web-based UI for handling interrupts.

## Prerequisites

Before getting started, ensure you have:

- Node.js 18+ and yarn/npm installed
- AWS credentials configured for Bedrock access
- LangSmith API key (for Agent Inbox integration)
- [Agent Inbox](https://github.com/langchain-ai/agent-inbox) set up and running

## Project Structure

```
/
├── src/
│   ├── agent.ts          # Main LangGraph agent with travel booking tools
│   └── humanInterrupt.ts # Human-in-the-loop interrupt functionality
├── package.json          # Project configuration
├── tsconfig.json         # TypeScript configuration
├── langgraph.json        # LangGraph CLI configuration
├── .env                  # Environment variables
└── README.md            # This file
```

## Key Files

- **`src/agent.ts`**: Defines the main LangGraph workflow with hotel and flight booking tools, wrapped with human interrupt capabilities
- **`src/humanInterrupt.ts`**: Implements the human-in-the-loop wrapper that integrates with Agent Inbox schemas
- **`langgraph.json`**: Configuration for LangGraph CLI, specifying the agent export

## Setup Instructions

### 1. Install Dependencies

```bash
yarn install
```

### 2. Environment Configuration

Copy the example environment file and add your credentials:

```bash
cp .env.example .env
```

Then edit `.env` with your AWS and LangSmith credentials:

```env
# AWS Bedrock Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_SESSION_TOKEN=your_aws_session_token

# LangSmith (for Agent Inbox)
LANGSMITH_API_KEY=your_langsmith_api_key
```

### 3. Agent Inbox Setup

1. Clone and set up the Agent Inbox:
   ```bash
   git clone https://github.com/langchain-ai/agent-inbox.git
   cd agent-inbox
   yarn install
   yarn dev
   ```

2. Configure the Agent Inbox (Settings → Add Inbox):
   - **Assistant/Graph ID**: `my_agent`
   - **Deployment URL**: Your LangGraph deployment URL (e.g., `http://localhost:8123`)
   - **Name**: `Travel Booking Agent`

## Running the Project

### 1. Start the LangGraph Development Server

```bash
npm run dev
```

This will start the LangGraph CLI development server at `http://localhost:2024`, making your agent available for the Agent Inbox to connect to.

### 2. Start the Agent Inbox

In a separate terminal, run the Agent Inbox:

```bash
cd agent-inbox
yarn dev
```

The Agent Inbox will be available at `http://localhost:3000`.

### 3. Test the Integration

1. Open the Agent Inbox & LangGraph Studio in your browser
2. Start a new conversation with the agent in LangGraph Studio
3. Ask the agent to book a hotel or flight (e.g., "book a stay at McKittrick hotel")
4. The agent will interrupt execution and show the booking request in the inbox
5. Review and approve/edit/respond to the interrupt

## How It Works

### Interrupt Flow

1. **Tool Call**: Agent decides to use a booking tool (hotel or flight)
2. **Interrupt Trigger**: The `addHumanInTheLoop` wrapper intercepts the tool call
3. **Agent Inbox Display**: The interrupt appears in the Agent Inbox UI
4. **Human Response**: User reviews and responds (accept/edit/respond/ignore)
5. **Execution Continues**: Agent processes the human response and continues

## References

- [LangGraph Documentation](https://docs.langchain.com/oss/javascript/langgraph/overview)
- [Agent Inbox Repository](https://github.com/langchain-ai/agent-inbox)
- [LangGraph Human-in-the-Loop Guide](https://docs.langchain.com/oss/javascript/langgraph/human-in-the-loop)
- [LangChain AWS Integration](https://docs.langchain.com/oss/javascript/integrations/chat/bedrock_converse)
