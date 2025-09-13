import { StructuredTool, tool } from "@langchain/core/tools";
import { RunnableConfig } from "@langchain/core/runnables";
import { interrupt } from "@langchain/langgraph";
import { HumanInterrupt } from "@langchain/langgraph/prebuilt";

interface HumanInterruptConfig {
  allowAccept?: boolean;
  allowEdit?: boolean;
  allowRespond?: boolean;
}

// interface HumanInterrupt {
//   actionRequest: {
//     action: string;
//     args: Record<string, any>;
//   };
//   config: HumanInterruptConfig;
//   description: string;
// }

export function addHumanInTheLoop(
  originalTool: StructuredTool,
  interruptConfig = {
    allow_accept: true,
    allow_edit: true,
    allow_respond: true,
    allow_ignore: false,
  }
): StructuredTool {
  // Wrap the original tool to support human-in-the-loop review
  return tool(
    async (toolInput: Record<string, any>, config?: RunnableConfig) => {
      const request: HumanInterrupt = {
        action_request: {
          action: originalTool.name,
          args: toolInput,
        },
        config: interruptConfig,
        description: "Please review the tool call",
      };

      const response = interrupt([request])[0];

      // approve the tool call
      if (response.type === "accept") {
        return await originalTool.invoke(toolInput, config);
      }
      // update tool call args
      else if (response.type === "edit") {
        const updatedArgs = response.args;
        return await originalTool.invoke(updatedArgs, config);
      }
      // respond to the LLM with user feedback
      else if (response.type === "response") {
        return response.args;
      } else {
        throw new Error(
          `Unsupported interrupt response type: ${response.type}`
        );
      }
    },
    {
      name: originalTool.name,
      description: originalTool.description,
      schema: originalTool.schema,
    }
  );
}
