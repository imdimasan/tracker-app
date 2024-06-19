import Image from "next/image";
import styles from "./page.module.css";
// import Mapbox from "@components/components/Mapbox";
import dynamic from 'next/dynamic';

const Mapbox = dynamic(() => import('@components/components/Mapbox'), { ssr: false });

export default function Home() {
  return (
  
    <main>
      <h1>Route Tracker</h1>
      <Mapbox />
    </main>
  
  );
}
