const express = require("express");
const mongoose = require("mongoose")    
const cors = require("cors");


const app = express();
app.use(express.json());
app.use(cors());


// const translate = require('google-translate-api');

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

    question_hi: {
        type: String,
    },

    question_bn: {
        type: String,
    },

    answer: {
        type: String,
        // required: true,
    },

    answer_hi: {
        type: String,
    },

    answer_bn: {
        type: String,
    }
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
    } catch(error) {
        console.log(error);
        res.status(500).send({ message: "Something went wrong"});
    }
});




app.listen(3001, () => {
    console.log("server is running");
});
