
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WinnerPage = ({ winner }: { winner: { name: string; score: number } }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/'); // Replace with your home route
        }, 5000);

        return () => clearTimeout(timer); // Cleanup timeout on component unmount
    }, [navigate]);

    return (
        <div className="bg-gradient-to-r from-purple-600 to-blue-500 w-screen h-screen flex flex-col justify-center items-center text-white">
            <div className="text-center animate-pulse">
                <h1 className="text-5xl font-bold mb-4">🎉 Congratulations! 🎉</h1>
                <p className="text-3xl">Winner: <span className="font-bold">{winner.name}</span></p>
                <p className="text-2xl mt-2">Score: <span className="font-bold">{winner.score}</span></p>
            </div>
            <div className="mt-8">
                <p className="text-lg">Redirecting to home in 5 seconds...</p>
            </div>
        </div>
    );
};

export default WinnerPage;
