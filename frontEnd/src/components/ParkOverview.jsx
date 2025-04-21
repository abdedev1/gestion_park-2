import { EditableParkMap } from "./ParkMap";
import { getPark } from "../assets/api/parks/park";
import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom'


// export default function ParkOverview({ park }) {
export default function ParkOverview() {
    const { id } = useParams();

    const [park, setParks] = useState(null)
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        const fetchPark = async () => {
            try {
                const res = await getPark(id);
                setParks(res);
            } catch (error) {
                console.error("Error fetching park data:", error);
            }
            finally {
                setLoading(false);
            }
        };
    
        fetchPark();
        }
    , []);
    if (loading) {
        return (
            <div className="flex justify-center items-center mt-4">
                <span className="loading loading-spinner loading-md text-primary" />
            </div>
        );
    }

  return (
    <div className="bg-base-100 mx-auto my-4 flex justify-center">
        {park ? <EditableParkMap park={park}/> : <p className="text-center text-gray-500">No parks available</p>}
    </div>
  );
}