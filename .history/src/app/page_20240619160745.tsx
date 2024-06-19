import Image from "next/image";
import styles from "./page.module.css";
import Mapbox from "@components/components/Mapbox";

export default function Home() {
  return (
  
    <main>
      <h1>Route Tracker</h1>
      <Mapbox />
    </main>
  
  );
}
