import express from 'express'
import dotenv from 'dotenv';
import path from 'path';

import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { AgentExecutor, createToolCallingAgent } from 'langchain/agents';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { z } from "zod";



const app = express()
const port = 8080

dotenv.config();
app.use(express.json());
const __dirname = path.resolve()

const model = new ChatGoogleGenerativeAI({
model: "models/gemini-2.5-flash", // Free-tier model - use pro
maxOutputTokens: 2048,
temperature: 0.7,
apiKey: process.env.GOOGLE_API_KEY,
});

// 🍲 Tool: Restaurant Menu Tool
const getMenuTool = new DynamicStructuredTool({
  name: "getMenu",
  description: "Returns the final answer for today's menu for the given category (breakfast, lunch, or dinner). Use this tool to answer the user's menu question directly.",
  schema: z.object({ 
    category: z.string().describe("Type of food. Example: breakfast, lunch, dinner"),
}),
  func: async ({ category }) => {
    const menus = {
      breakfast: "Aloo Paratha, Poha, Masala Chai",
      lunch: "Paneer Butter Masala, Dal Fry, Jeera Rice, Roti",
      dinner: "Veg Biryani, Raita, Salad, Gulab Jamun",
  };
    return menus[category.toLowerCase()] || "No menu found for that category.";
  },
})

const prompt = ChatPromptTemplate.fromMessages(
  [
    ["system", "You are a helpful assistant"],
    ["placeholder", "{chat_history}"],
    ["human", "{input}"],
    ["ai", "{agent_scratchpad}"],
  ]
);

const agent = await createToolCallingAgent({
  llm: model,
  tools: [getMenuTool],
  prompt
})

const executor = await AgentExecutor.fromAgentAndTools({
  agent,
  tools: [getMenuTool],
  // verbose: true, 
  maxIterations: 10, // Optional: Let it think more steps if needed
  returnIntermediateSteps: true

});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.post("/api/chat", async (req, res)=>{
  const userInput = req.body.input;
  console.log("userInput:- ", userInput);
  try{
    const response = await executor.invoke({input: userInput});
    console.log("Agent full Response:- ", response);
    const data = response.intermediateSteps?.[0]?.observation;

    if (response.output && response.output !== 'Agent stopped due to max iterations.') {
      return res.json({ output: response.output });
    }

    if (data != null) {
      return res.json({ output: String(data) });
    }

    return res.status(500).json({ output: "Agent couldn't find a valid answer." });
  }catch(err){
    console.log("Error during agent execution:- ", err);
    return res.status(500).json({ output: "Sorry, something went wrong. Please try again." });
  }
})

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})
