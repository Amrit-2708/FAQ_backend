import Navbar from './navbar'
import { useNavigate } from 'react-router-dom';

const Submittedfaq = () => {
    const navigate = useNavigate();

    function handleGoToHome() {
        navigate("/");
    }
    return (
        <div>
            <Navbar></Navbar>
            <div className='flex flex-col'>
                <h1 className='text-3xl text-center py-8'>Thank you for submitting your query. You will be answered shortly.</h1>
                <button
                        onClick={handleGoToHome}
                        className={`w-1/5 h-10 rounded-md border self-center border-slate-200 text-white bg-blue-800 cursor-pointer`}
                    >
                        Go to home
                    </button>
            </div>
        </div>
    )
}

export default Submittedfaq
