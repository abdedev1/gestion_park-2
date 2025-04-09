import React, { useEffect } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { fetchEmployes } from '../Redux/Reducer/employesSlice';
export default function Overview() {
    const {employes} = useSelector(state=>state.employes)
    const dispatch = useDispatch()
    useEffect(()=>{
        dispatch(fetchEmployes())
    },[])
    console.log(employes)
	return (
		<div>
			<h1>Employee Overview</h1>
			<p>This is the overview of employees.</p>
		</div>
	);
}