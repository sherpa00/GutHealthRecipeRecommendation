const axios = require("axios");
const dotenv = require("dotenv");
const { AzureOpenAI } = require("openai");

dotenv.config();

// env variables
const API_KEY = process.env.OPENAI_API_KEY;
const API_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
const DEPLOYMENT_NAME = process.env.OPENAI_API_DEPLOYMENT;
const API_VERSION = process.env.OPENAI_API_VERSION;

// azure openai client
const client = new AzureOpenAI({
  API_ENDPOINT,
  API_KEY,
  API_VERSION,
  DEPLOYMENT_NAME,
});

// chat history
const chat_history = [];

// chat contoller for recipe recommendation
const ChatController = async (userInput) => {
  try {
    if (!userInput) {
      return {
        success: false,
        message: "Please provide a message",
      };
    }

    // add user message into the chat history
    chat_history.push({
      role: "user",
      content: userInput,
    });

    // if its first questinon, ask for gut issues user is having or worrired about
    if (chat_history.length == 1) {
      chat_history.push({
        role: "system",
        content:
          "You are a helpful assistant who can recommend gut-friendly recipes.",
      });
      const prompt =
        "Ask the user about their gut health issue, and be friendly and conversational.";
      try {
        // first qustion asking gut isssues
        const firstRespose = await client.chat.completions.create({
          messages: chat_history,
          model: "",
        });

        const firstAnswer = firstRespose.choices[0].message.content;
        chat_history.push({ role: "assistant", content: firstAnswer });

        return {
          success: true,
          message: firstAnswer,
        };
      } catch (err) {
        console.log("Error while asking for gut issues", err);
        return {
          success: false,
          message: "Error while asking for gut issues",
        };
      }
    }

    // after getting gut issues, ask for food preferences
    else if (chat_history.length == 2) {
      chat_history.push({
        role: "system",
        content:
          "Now that I know about your gut health issue, I want to know your food preferences.",
      });
      const prompt =
        "Ask the user about their food preferences, such as vegetarian, dairy-free, Nepalese food etc.";
      try {
        // first qustion asking gut isssues
        const secondRequest = await client.chat.completions.create({
          messages: chat_history,
          model: "",
        });

        const secondAnswer = secondRequest.choices[0].message.content;
        chat_history.push({ role: "assistant", content: secondAnswer });

        return {
          success: true,
          message: secondAnswer,
        };
      } catch (err) {
        console.log("Error while asking for gut issues", err);
        return {
          success: false,
          message: "Error while asking for food preferences",
        };
      }
    }

    // now ask for ingredients available
    else if (chat_history.length == 3) {
      chat_history.push({
        role: "system",
        content:
          "Now, ask the user what ingredients they have on hand for the recipe.",
      });
      const prompt =
        "Ask the user about the ingredients they have on hand for the recipe.";
      try {
        // first qustion asking gut isssues
        const thirdRequest = await client.chat.completions.create({
          messages: chat_history,
          model: "",
        });

        const thirdAnswer = thirdRequest.choices[0].message.content;
        chat_history.push({ role: "assistant", content: thirdAnswer });

        return {
          success: true,
          message: thirdAnswer,
        };
      } catch (err) {
        console.log("Error while asking for recipe ingredients", err);
        return {
          success: false,
          message: "Error while asking for recipe ingredients",
        };
      }
    }

    // finaly after all required questions, prepare a recipe
    else if (chat_history.length === 4) {
      const gutIssue = chat_history[1].content;
      const foodPreferences = chat_history[2].content;
      const ingredients = userMessage; // assume that user sends at the final message

      const prompt = `
        Given the user's gut health issue: ${gutIssue},
        their food preferences: ${foodPreferences},
        and the ingredients they have: ${ingredients},
        create a detailed recipe suggestion that is gut-friendly and fits these criteria.
      `;

      try {
        const finalResponse = await client.chat.completions.create({
          messages: [
            ...chat_history,
            {
              role: "user",
              content: userInput, // ingredients
            },
          ],
          model: "",
        });

        const recipeSuggestion = finalResponse.choices[0].message.content;
        chat_history.push({ role: "assistant", content: recipeSuggestion });

        return {
          success: true,
          message: "Here is you personalized recipe",
          recipe: recipeSuggestion,
        };
      } catch (err) {
        console.log("Error while preparing a recipe", err);
        return {
          success: false,
          message: "Error while preparing a recipe",
        };
      }
    }
  } catch (err) {
    console.log("Error while undestanding the chat message", err);
    return {
      success: false,
      message: "Error while understanding the chat message",
    };
  }
};

module.exports = ChatController;
