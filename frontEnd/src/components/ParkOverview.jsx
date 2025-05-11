// import { EditableParkMap, ParkMap } from "./ParkMap";
// import { getPark } from "../assets/api/parks/park";
// import { useEffect, useState } from "react";
// import { useParams } from 'react-router-dom'


// // export default function ParkOverview({ park }) {
// export default function ParkOverview() {
//     const { id } = useParams();

//     const [park, setParks] = useState(null)
//     const [loading, setLoading] = useState(true)
    
//     useEffect(() => {
//         const fetchPark = async () => {
//             try {
//                 const res = await getPark(id);
//                 setParks(res);
//             } catch (error) {
//                 console.error("Error fetching park data:", error);
//             }
//             finally {
//                 setLoading(false);
//             }
//         };
    
//         fetchPark();
//         }
//     , []);
//     if (loading) {
//         return (
//             <div className="flex justify-center items-center mt-4">
//                 <span className="loading loading-spinner loading-md text-primary" />
//             </div>
//         );
//     }

//   return (
//     <div className="bg-base-100 mx-auto my-4 flex justify-center">
//         {park ? <ParkMap park={park}/> : <p className="text-center text-gray-500">No parks available</p>}
//     </div>
//   );
// }













import { EditableParkMap, ParkMap } from "./ParkMap";
import { getPark } from "../assets/api/parks/park";
import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { motion } from "framer-motion";

export default function ParkOverview() {
    const { id } = useParams();
    const [park, setPark] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchPark = async () => {
            try {
                const res = await getPark(id);
                setPark(res);
                setError(null);
            } catch (err) {
                console.error("Error fetching park data:", err);
                setError("Failed to load park data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
    
        fetchPark();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600 font-medium">Loading park details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                    <div className="text-red-500 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        {park?.name || 'Park Overview'}
                    </h1>
                    <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-500">
                        {park?.description || 'Explore the beautiful park layout'}
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                    <div className="p-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                    
                    <div className="p-6">
                        {park ? (
                            <div className="relative">
                                <ParkMap park={park} />
                                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                                    <p className="text-sm font-medium text-gray-700">Zoom and pan to explore</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="mt-4 text-lg font-medium text-gray-700">No park data available</h3>
                                <p className="mt-1 text-gray-500">The park map couldn't be loaded</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}