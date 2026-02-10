const { GoogleGenAI } = require("@google/genai");
const { json } = require("node:stream/consumers");
const Listing = require("../Models/ListingSchema.js");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const cache = new Map();


module.exports.aiExample = async (req, res) => {
  // console.log();
  // res.send("Hello, The maintainace is going on, Please try again later!");
  const { message } = req.body;
  const jsonData = await extractJsonFromText(message);
  const dbResponse = await searchProperty(jsonData);
  const aiResponse = await generateResponse(dbResponse);
  res.send(aiResponse);
};

const extractJsonFromText = async (message) => {
  if (cache.has(message)) {
    return cache.get(message);
  }
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",

    contents: [
      {
        role: "user",
        parts: [{ text: message }],
      },
    ],

    config: {
      systemInstruction: `
You are a STRICT JSON extractor.

RULES:
- Return ONLY valid JSON.
- Use ONLY these exact fields:
  type, size, purpose, price, area, city, state
- If a field is not mentioned, set it to null.
- Do NOT add extra fields.
- Do NOT rename fields.
- Do NOT add units or currency.
- Do NOT generate sample or market data.
- Do NOT include explanations or text.

EXAMPLE:
User: "Show me a 2000 sqft flat in Lucknow under 30 lakh"

Output:
{
  "type": "flat",
  "size": 2000,
  "purpose": null,
  "price": 3000000,
  "area": null,
  "city": "Lucknow",
  "state": null
}
`,
    },
  });

  cache.set(message, JSON.parse(response.text));

  return JSON.parse(response.text);
};

const searchProperty = async (jsonData) => {
  const hasAnyFilter = Object.values(jsonData).some(v => v !== null);
  if(!hasAnyFilter) return [];
  // const jsonData = {
  //   type: "villa",
  //   size: 2500,
  //   purpose: null,
  //   price: 50000000,
  //   area: null,
  //   city: "Lucknow",
  //   state: null,
  // };
  const query = {};
  if (jsonData.type) query.type = new RegExp(`^${jsonData.type}$`, "i");
  if (jsonData.size)
    query.size = { $lte: jsonData.size + 100, $gte: jsonData.size - 100 };
  if (jsonData.pupose) query.purpose = new RegExp(`^${jsonData.purpose}$`, "i");
  if (jsonData.price) query.price = { $lte: jsonData.price };
  if (jsonData.area) query.area = new RegExp(jsonData.area, "i");
  if (jsonData.city) query.city = new RegExp(`^${jsonData.city}$`, "i");
  if (jsonData.state) query.state = new RegExp(`^${jsonData.state}$`, "i");
  const listings = await Listing.find(query).limit(10).populate("owner").populate("agent");
  return listings;
};

const generateResponse = async (listings) =>{
  if (listings.length == 0) {
    return "Sorry, If you are asking question normally, Please ask direct queries like 'Show me a flat in Gomti-Nagar, Lucknow bellow 50 lakh. etc'. \n Thank you!";
  }
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        role: "user",
        parts: [{text: `${JSON.stringify(listings)}, ${JSON.stringify(listings.owner)}, ${ JSON.stringify(listings.agent)}}`}],
      }
    ],
    config:{
      systemInstruction: `
      You are a real-estate assistance for this application.
      Rules:
      1. Summarize listings using given json data.
      2. Remember that it should be professional and user-friendly.
      3. Explain all the information of property based on data.
      4. Don't polish information yourself.
      5. Don't add extra data.
      6. Don't generate sample or market data.
      7. Generate links for each property in this format: "http://localhost:3000/listings/{listings.id}
      `
    }
  });
  return response.text;
}
