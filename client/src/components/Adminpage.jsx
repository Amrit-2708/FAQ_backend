import { useState, useEffect } from "react";
import Navbar from "./navbar";
import axios from "axios";
import LanguageSelector from "react-language-selector-lite";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from "react-router-dom";


const Adminpage = () => {
    const navigate = useNavigate();

    const [answerr, setAnswerr] = useState();
    const [unanswered, setUnanswered] = useState([]);
    const [changedd, setChangedd] = useState([]);
    const [activeQuestionId, setActiveQuestionId] = useState(null);

    function handleSubmit(questionId) {
        const answer = extractPlainText(answerr);
        console.log('chekinnnnn', answer);

        console.log(questionId);
        if (answer.length > 0) {
            axios.patch(`http://localhost:3001/submit_answer`, { questionId, answer }).then((result) => {
                console.log(result.data);
                setTimeout(() => {
                    navigate("/")
                }, 2000)
            }).catch((error) => {
                console.log("error aaya re baba", error);
            })
        }
        else {
            alert("Please type something before submitting")
        }


    }


    const handleLanguageSelect = (language) => {
        console.log('Selected language:', language);
        axios.get(`http://localhost:3001/translate/${language}`).then((result) => {
            console.log(`${language}:`, result);
            setChangedd(result.data.translated_unanswered_questions);
            setTimeout(() => {
                setChangedd(result.data.translated_unanswered_questions);
                console.log("navigation ke baad array check kr rhe: ", changedd);
            }, 2000);
        }).catch((error) => {
            console.log(error);
        })
    };

    const handleAnswerClick = (questionId) => {
        // If the same question's button is clicked again, close the textarea
        if (activeQuestionId === questionId) {
            setAnswerr('');
            setActiveQuestionId(null);
        } else {
            setActiveQuestionId(questionId);
            setAnswerr('');
        }
    };

    const handleChange = (value) => {
        setAnswerr(value); // Storing the HTML text
        console.log("kya aara bhai", value);
    };

    const extractPlainText = (html) => {
        return html.replace(/<[^>]*>/g, ""); // Regex pattern-Removes all HTML tags
    };


    useEffect(() => {
        console.log("use effect ke baad Changed data:", changedd);
    }, [changedd]);

    useEffect(() => {
        axios
            .get("http://localhost:3001/faq")
            .then((res) => {
                console.log("unanswered wla aaya re aaya: ", res.data.unanswered_ques);
                setUnanswered(res.data.unanswered_ques);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [changedd]);

    return (
        <div>
            <Navbar></Navbar>
            <LanguageSelector onSelect={handleLanguageSelect} theme="light"></LanguageSelector>
            <div className="faq_head text-5xl text-center my-8 font-semibold">
                FAQ&apos;s to be answered
            </div>

            <div className="m-15 pl-30 pr-30 bg-damber-400">
                <div className="mb-12">
                    {changedd.length > 0 && (<div className="">
                        {changedd.map((item, index) => (
                            <div key={index} className="flex flex-col mb-8">
                                <h1 className="text-2xl font-semibold">
                                    {item.translated_uanswered_question}
                                </h1>
                                {activeQuestionId === item.id && (
                                    <ReactQuill
                                        value={answerr}
                                        theme="snow"
                                        placeholder="Type your question here"
                                        onChange={handleChange}
                                        className="mt-5"

                                    />
                                )}
                                {/* {activeQuestionId === item.id && (
                                    <textarea
                                        className="border-2 mt-5"
                                        onChange={(e) => setAnswer(e.target.value)}
                                        rows={4}
                                        cols={50}
                                    ></textarea>
                                )} */}
                                <button
                                    className="w-1/5 h-10 mt-4 rounded-md border border-slate-200 bg-blue-700 text-white"
                                    onClick={() => handleAnswerClick(item.id)}
                                >
                                    {activeQuestionId === item.id ? "Close" : "Answer"}
                                </button>
                                {activeQuestionId === item.id && answerr && (<button
                                    className="w-1/5 h-10 mt-2 rounded-md border border-slate-200 bg-blue-700 text-white"
                                    onClick={() => handleSubmit(item.id)}
                                >
                                    Submit
                                </button>)}
                            </div>
                        ))}
                    </div>)}


                    {!changedd.length > 0 && (<div className="">
                        {unanswered.map((unanswered, index) => (
                            <div key={index} className="flex flex-col mb-8">
                                <h1 className="text-2xl font-semibold">
                                    {unanswered.question}
                                </h1>

                                {activeQuestionId === unanswered._id && (
                                    <ReactQuill
                                        value={answerr}
                                        theme="snow"
                                        placeholder="Type your answer here"
                                        onChange={handleChange}
                                        className="mt-5"

                                    />
                                )}
                                {/* {activeQuestionId === unanswered._id && (
                                    <textarea
                                        className="border-2 mt-5"
                                        onChange={(e) => setAnswerr(e.target.value)}
                                        rows={4}
                                        cols={50}
                                    ></textarea>
                                )} */}
                                <button
                                    className="w-1/5 h-10 mt-4 rounded-md border border-slate-200 bg-blue-700 text-white"
                                    onClick={() => handleAnswerClick(unanswered._id)}
                                >
                                    {activeQuestionId === unanswered._id ? "Close" : "Answer"}
                                </button>
                                {activeQuestionId === unanswered._id && answerr && (<button
                                    className="w-1/5 h-10 mt-2 rounded-md border border-slate-200 bg-blue-700 text-white"
                                    onClick={() => handleSubmit(unanswered._id)}
                                >
                                    Submit
                                </button>)}
                            </div>
                        ))}
                    </div>)}
                </div>
            </div>
        </div>
    );
};

export default Adminpage;
