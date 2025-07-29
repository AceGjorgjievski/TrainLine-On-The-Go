'use client';
import dynamic from "next/dynamic";


const Map = dynamic(() => import('./map-container-view'), { ssr: false });

export default function HomeView() {
    return (
        <Map/>
    );
}
