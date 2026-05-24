import { useEffect, useState } from 'react';
import './Recommendation.css';
import '../General.css'

export default function Recommendation({ resource }) {
    return (
        <div className='c_recommendation'>
            <p className='font-20 jost-400'>Título: {resource.title}</p>
            <p className='font-16 jost-400'>Enlace: <a className='font-16 jost-400 tx_url' href={resource.url}>{resource.url}</a></p>
            <p className='font-16 jost-400'>Tipo de recomendación: {resource.type}</p>
        </div>
    );
}