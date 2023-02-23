import express from "express";
import * as dotenv from 'dotenv';
import cors from 'cors';
import { OpenAIApi, Configuration } from "openai";

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration);

const app = express();
//we want to use middlewares
app.use(cors());

// we want to send json data from frontend to backend
app.use(express.json());

// get route can't really receive a lot of data from frontend
app.get('/', async(req,res) =>{
    res.status(200).send({
        message:'hello from codex'
    })
})

// allows us to get data from body of front end (prompt)
app.post('/', async(req,res) =>{
    try{
        const prompt = req.body.prompt;
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0, // take more risks
            max_tokens: 3000, // can give long responses
            top_p: 1,
            frequency_penalty: 0.5, // less likely to repeat hte same thing
            presence_penalty: 0,
        })
        res.status(200).send({
            // returns us in json format.
            bot:response.data.choices[0].text
        })
    }
    catch (error){
        console.log(error);
        res.status(500).send({error})
    }
})

app.listen(5000, () =>{
    console.log('Server is running on port http://localhost:5000');
})