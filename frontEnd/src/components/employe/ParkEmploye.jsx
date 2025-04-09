import React, { useEffect } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { fetchEmployes } from '../Redux/Reducer/employesSlice';
import HeaderEmploye from './HeaderEmploye';
export default function Overview() {
    const {employes} = useSelector(state=>state.employes)
    const dispatch = useDispatch()
    useEffect(()=>{
        dispatch(fetchEmployes())
    },[])
    console.log(employes)
	return (
		<div>
			
		</div>
	);
}