const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
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
});

const Faq = mongoose.model("faq's", FaqSchema);

app.post("/submit", async (req, res) => {
    console.log(req.body);
    const { question } = req.body;

    try {
        const questionn = await Faq.create({ question });
        const submitted = await questionn.save();
        res.status(200).send({ message: "Question submitted Successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Something went wrong" });
    }
});

app.patch("/submit_answer", async(req, res) => {
    const { questionId, answer } = req.body;

    try {
        const questionn = await Faq.findByIdAndUpdate(questionId, {
            answer: answer,
        });
        if (!questionn) {
            return res
                .status(400)
                .send({ message: "question with this id does not exist" });
        }
        res
            .status(200).send({message: "Answer submitted successfully"})
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "kch galat ho gya" });
    }

});

app.get("/faq", async (req, res) => {
    const { answer } = "";
    try {
        // Fetch all faqs from the database
        const faqs = await Faq.find();
        const unanswered = await Faq.find({ answer });
        console.log(unanswered);
        res
            .status(200)
            .send({
                message: "faqs retrieved successfully",
                info: faqs,
                unanswered_ques: unanswered,
            });
    } catch (error) {
        res
            .status(500)
            .send({ message: "Failed to retrieve users", error: error.message });
    }
});

app.get("/translate/:language", async (req, res) => {
    const { language } = req.params;
    const { answer } = "";

    try {
        // Fetch all faqs from the database
        const faqs = await Faq.find();
        const unanswered = await Faq.find({ answer });
        // console.log(faqs[0]);

        // let question;
        // let answer;
        let translated_arr = [];
        let unanswered_questions_translated = [];

        for (let i = 0; i < unanswered.length; i++) {
            const question = unanswered[i].question;
            const id = unanswered[i]._id;
            const translated_unanswered_question_response = await axios.get(
                `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${language}&dt=t&q=${encodeURIComponent(
                    question
                )}`
            );
            const translated_uanswered_question = translated_unanswered_question_response.data[0][0][0];
            unanswered_questions_translated.push({ translated_uanswered_question: translated_uanswered_question, id: id });
            console.log("jo answwer ni hai: ", unanswered_questions_translated);
        }

        for (let i = 0; i < faqs.length; i++) {
            console.log("yeh hai: ", faqs[i].question);
            const question = faqs[i].question;
            const answer = faqs[i].answer;
            const translated_question_response = await axios.get(
                `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${language}&dt=t&q=${encodeURIComponent(
                    question
                )}`
            );
            const translated_question = translated_question_response.data[0][0][0];

            const translated_answer_response = await axios.get(
                `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${language}&dt=t&q=${encodeURIComponent(
                    answer
                )}`
            );
            const translated_answer = translated_answer_response.data[0][0][0];

            translated_arr.push({
                translated_question: translated_question,
                translated_answer: translated_answer,
            });
            console.log("translated answer:", translated_answer_response.data);
        }

        const staticTexts = {
            faq_title: "FAQ",
            faq_heading: "Frequently asked questions",
            faq_description:
                "Can’t find the answer you’re looking for? Ask us now by filling up the box below.",
            placeholder: "Ask a question",
            submit: "Submit",
        };

        let translated_static = {};
        for (const key in staticTexts) {
            const response = await axios.get(
                `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${language}&dt=t&q=${encodeURIComponent(
                    staticTexts[key]
                )}`
            );
            translated_static[key] = response.data[0][0][0];
            console.log(translated_static[key]);
        }
        console.log("yahin hai", translated_static);

        res
            .status(200)
            .send({
                message: "faqs retrieved successfully",
                translated_data: translated_arr,
                translated_static: translated_static,
                translated_unanswered_questions: unanswered_questions_translated,
            });
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .send({ message: "Failed to retrieve users", error: error.message });
    }
});

app.listen(3001, () => {
    console.log("server is running");
});
