import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LanguageSelector from 'react-language-selector-lite';


import Navbar from "./navbar";
import axios from "axios";


const Homepage = () => {
    const [question, setQuestion] = useState();
    const [data, setData] = useState([]);
    const [changed, setChanged] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const isQuestionFilled = question;

    const [translatedStatic, setTranslatedStatic] = useState({
        faq_title: "FAQ",
        faq_heading: "Frequently asked questions",
        faq_description: "Can’t find the answer you’re looking for? Ask us now by filling up the box below.",
        placeholder: "Ask a question",
        submit: "Submit"
    });


    const handleLanguageSelect = (language) => {
        console.log('Selected language:', language);
        axios.get(`http://localhost:3001/translate/${language}`).then((result) => {
            console.log(`${language}:`, result);
            setChanged(result.data.translated_data);
            setTranslatedStatic(result.data.translated_static);
            console.log("navigation ke pehle: ", changed);
            setTimeout(() => {
                navigate(`/${language}`);
                setChanged(result.data.translated_data);
                console.log("navigation ke baad array check kr rhe: ", changed);
            }, 2000);
        })
    };

    useEffect(() => {
        console.log("use effect ke baad Changed data:", changed);
    }, [changed]);

    useEffect(() => {
        console.log("static change hue ki nhi: ", translatedStatic);
    }, [translatedStatic]);




    useEffect(() => {
        axios
            .get("http://localhost:3001/faq")
            .then((res) => {
                console.log("aaya re aaya: ", res.data.info);
                setData(res.data.info)
            }).catch((error) => {
                console.log(error);
            });
    }, [])


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
            <LanguageSelector onSelect={handleLanguageSelect} theme="light" />
            <div className="faq_head text-6xl text-center my-8 font-semibold">
                {translatedStatic.faq_title}
            </div>
            <div className="content flex px-20 pt-10">
                <div className="question p-10">
                    <h1 className="text-4xl font-bold mb-4">
                        {translatedStatic.faq_heading}
                    </h1>
                    <p className="text-lg">
                        {translatedStatic.faq_description}
                    </p>
                    <textarea
                        className="border-2 mt-5"
                        name="ques_field"
                        maxLength="255"
                        placeholder={translatedStatic.placeholder}
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
                        {translatedStatic.submit}
                    </button>
                </div>

                {!changed.length > 0 && (<div className="with_answer p-10">
                    {data.map((data, index) => (<div key={index} className="mb-8">
                        <h1 className="text-2xl font-semibold">{data.question}</h1>
                        <p>{data.answer}</p>
                    </div>))}
                </div>)}

                {changed.length > 0 && (<div className="with_answer p-10">
                    {changed.map((item, index) => (<div key={index} className="mb-8">
                        <h1 className="text-2xl font-semibold">{item.translated_question}</h1>
                        <p>{item.translated_answer}</p>
                    </div>))}
                </div>)}

            </div>
        </div>
    );
};

export default Homepage;
