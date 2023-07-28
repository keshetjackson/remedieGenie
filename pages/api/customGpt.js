//documents loaders for differents files formats
import {DirectoryLoader} from "langchain/document_loaders/fs/directory";
import {JSONLoader} from "langchain/document_loaders/fs/json";
import {TextLoader} from "langchain/document_loaders/fs/text";
import {PDFLoader} from "langchain/document_loaders/fs/pdf";
import {CSVLoader} from "langchain/document_loaders/fs/csv";

//open ai llm and other elated modules
import { OpenAI } from "langchain/llms/openai";
import {RetrievalQAChain} from "langchain/chains";
import {HNSWLib} from "langchain/vectorstores/hnswlib";
import {OpenAIEmbeddings} from "langchain/embeddings/openai";
import {RecursiveCharacterTextSplitter} from "langchain/text_splitter";

// Import Tiktoken for token counting
import { Tiktoken } from "@dqbd/tiktoken/lite";
import { load } from "@dqbd/tiktoken/load";
import registry from "@dqbd/tiktoken/registry.json" assert { type: "json" };
import models from "@dqbd/tiktoken/model_to_encoding.json" assert { type: "json" };

//Import dotenv for loading environment variables and fs for file system operations
import dotenv from 'dotenv';
import fs from "fs";
import path from "path";
dotenv.config({path: "./.env.local"});
const apiKey = process.env.OPENAI_API_KEY;
console.log(apiKey);

//Initialize the document loader with supported file formats
const loader = new DirectoryLoader("./documents", {
    ".json": (path) => new JSONLoader(path),
    ".text": (path) => new TextLoader(path),
    ".csv": (path) => new CSVLoader(path),
    ".pdf": (path) => new PDFLoader(path),
});

//Load documents from the specified directory
console.log("loading documents");
const docs = await loader.load();
console.log("documents have been loaded successfully")


//efine a function to calculate the cost of tokenizing the documents
async function calculateCost() {
    const modelName = "text-embedding-ada-002";
    const modelKey = models[modelName];
    const model = await load(registry[modelKey]);
    const encoder = new Tiktoken(
      model.bpe_ranks,
      model.special_tokens,
      model.pat_str
    );
    const tokens = encoder.encode(JSON.stringify(docs));
    const tokenCount = tokens.length;
    const ratePerThousandTokens = 0.0004;
    const cost = (tokenCount / 1000) * ratePerThousandTokens;
    encoder.free();
    return cost;
  }
  
  const VECTOR_STORE_PATH = "Documents.index";
  const question = "what is the most important thing in homeopathy according the docs";

 //Define a function to normalize the content of the documents
function normalizeDocuments(docs) {
  return docs.map((doc) => {
    if (typeof doc.pageContent === "string") {
      return doc.pageContent;
    } else if (Array.isArray(doc.pageContent)) {
      return doc.pageContent.join("\n");
    }
  });
}

//main function to run the process
export const run = async (acceptableCost) => {

  //calculate the cost
  console.log("calculatin cost...");
  const cost = await calculateCost();
  console.log(cost);

  //choose the range 
  if (cost <= acceptableCost) {

    const model = new OpenAI({
      model: "GPT-3.5 Turbo",
      openAIApiKey: process.env.OPENAI_API_KEY
    });

    let vectorStore;
    // 13. Check if an existing vector store is available
    console.log("Checking for existing vector store...");
    if (fs.existsSync(VECTOR_STORE_PATH)) {
      // 14. Load the existing vector store
      console.log("Loading existing vector store...");
      vectorStore = await HNSWLib.load(
        VECTOR_STORE_PATH,
        new OpenAIEmbeddings()
      );
      console.log("Vector store loaded.");
    } else {
      // 15. Create a new vector store if one does not exist
      console.log("Creating new vector store...");
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
      });
      const normalizedDocs = normalizeDocuments(docs);
      const splitDocs = await textSplitter.createDocuments(normalizedDocs);

      // 16. Generate the vector store from the documents
      vectorStore = await HNSWLib.fromDocuments(
        splitDocs,
        new OpenAIEmbeddings()
      );
      // 17. Save the vector store to the specified path
      await vectorStore.save(VECTOR_STORE_PATH);

      console.log("Vector store created.");
    };
     // 18. Create a retrieval chain using the language model and vector store
     console.log("Creating retrieval chain...");
     const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
     

    // 19. Query the retrieval chain with the specified question
    console.log("Querying chain...");
    const res = await chain.call({ query: question });
    console.log({ res });

  } else {

    // 20. If the cost exceeds the limit, skip the embedding process
    console.log("The cost of embedding exceeds $1. Skipping embeddings.");
  };
};
  
run(3);  