import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";
import axios from "axios";
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import { ClassicEditor, Essentials, Paragraph, Bold, Italic } from 'ckeditor5';
import "ckeditor5/ckeditor5.css";

const Homepage = () => {
    const [question, setQuestion] = useState();
    const navigate = useNavigate();
    const isQuestionFilled = question;

    function handleSubmit() {
        console.log(question);
        axios
            .post("http://localhost:3001/submit", { question })
            .then((result) => {
                console.log(result);
                setQuestion("");
                setTimeout(() => {
                    navigate("/");
                    console.log("reloaded")
                }, 2000);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <div>
            <Navbar></Navbar>
            <div className="faq_head text-6xl text-center my-8 font-semibold">
                FAQ
            </div>
            <div className="content flex px-20 pt-10">
                <div className="question p-10">
                    <h1 className="text-4xl font-bold mb-4">
                        Frequently asked questions
                    </h1>
                    <p className="text-lg">
                        Can’t find the answer you’re looking for? Ask us now by filling up
                        the box below.
                    </p>
                    <textarea
                        className="border-2 mt-5"
                        name="ques_field"
                        maxLength="255"
                        placeholder="Ask a question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        rows="5"
                        cols="60"
                    ></textarea>
                    <button
                        onClick={handleSubmit}
                        disabled={!isQuestionFilled}
                        className={`w-1/3 h-10 rounded-md border border-slate-200 text-white ${isQuestionFilled
                                ? "bg-blue-800 cursor-pointer"
                                : "bg-gray-500 cursor-not-allowed"
                            }`}
                    >
                        Submit
                    </button>
                </div>

                <div className="with_answer p-10">
                    <div>
                        <h1 className="text-2xl font-semibold">What is FAQ?</h1>
                        <p>Faq stands for Frequently asked question</p>
                    </div>
                    <div className="mt-8">
                        <h1 className="text-2xl font-semibold">
                            Who can open a Fixed Deopsit?
                        </h1>
                        <p>
                            Any Indian citizen who is 18 years old or older and has valid
                            identification documents like a PAN card and Aadhaar can open a
                            Fixed Deposit.
                        </p>
                    </div>
                    <div className="mt-8">
                        <h1 className="text-2xl font-semibold">
                            Is there a minimum or maximum amount required to open an FD?
                        </h1>
                        <p>
                            The minimum amount is usually ₹1,000, while the maximum amount can
                            vary by institution, often up to ₹1 crore or more.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Homepage;
