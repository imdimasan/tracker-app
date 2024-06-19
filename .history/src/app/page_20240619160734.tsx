import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div>
    <Head>
      <title>Route Tracker</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main>
      <h1>Route Tracker</h1>
      <Mapbox />
    </main>
  </div>
  );
}
