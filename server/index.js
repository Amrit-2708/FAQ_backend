const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose")
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose
    .connect(
        "mongodb+srv://amrit_27:CkS36NvCRroIWUcj@cluster0.0pu3c.mongodb.net/FAQ?retryWrites=true&w=majority&appName=Cluster0"
    )
    .then(() => {
        console.log("Connected to MongoDB Atlas");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB Atlas", err);
    });


const FaqSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },

    answer: {
        type: String,
    },

})

const Faq = mongoose.model("faq's", FaqSchema);


app.post("/submit", async (req, res) => {
    console.log(req.body);
    const { question } = req.body;

    try {
        const questionn = await Faq.create({ question });
        const submitted = await questionn.save();
        res
            .status(200)
            .send({ message: "Question submitted Successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Something went wrong" });
    }
});


app.get("/faq", async (req, res) => {
    try {
        // Fetch all faqs from the database
        const faqs = await Faq.find();
        res.status(200).send({ message: "faqs retrieved successfully", info: faqs });
    } catch (error) {
        res.status(500).send({ message: "Failed to retrieve users", error: error.message });
    }
});



app.get('/translate/:language', async (req, res) => {
    const { language } = req.params;

    try {
        // Fetch all faqs from the database
        const faqs = await Faq.find();
        // console.log(faqs[0]);

        let question;
        let answer;
        let translated_arr = [];

        for (let i = 0; i < faqs.length; i++) {
            console.log("yeh hai: ", faqs[i].question);
            question = faqs[i].question;
            answer = faqs[i].answer;
            const translated_question_response = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${language}&dt=t&q=${encodeURIComponent(question)}`);
            const translated_question = translated_question_response.data[0][0][0];

            const translated_answer_response = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${language}&dt=t&q=${encodeURIComponent(answer)}`);
            const translated_answer = translated_answer_response.data[0][0][0];


            translated_arr.push({
                translated_question: translated_question,
                translated_answer: translated_answer
            });
            console.log("translated answer:", translated_answer_response.data);

        }

        const staticTexts = {
            faq_title: "FAQ",
            faq_heading: "Frequently asked questions",
            faq_description: "Can’t find the answer you’re looking for? Ask us now by filling up the box below.",
            placeholder: "Ask a question",
            submit: "Submit"
        };

        let translated_static = {};
        for (const key in staticTexts) {
            const response = await axios.get(
                `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${language}&dt=t&q=${encodeURIComponent(staticTexts[key])}`
            );
            translated_static[key] = response.data[0][0][0];
            console.log(translated_static[key]);
        }

        res.status(200).send({ message: "faqs retrieved successfully", translated_data: translated_arr, translated_static:translated_static });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Failed to retrieve users", error: error.message });
    }
});















app.listen(3001, () => {
    console.log("server is running");
});
