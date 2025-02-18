import ChatComponent from "./components/ChatComponent";
import styles from "./page.module.css";

const HomePage = () => {
  return (
    <div className={styles.page}>
      <h1 className={styles.logoContainer}>amagone</h1>
      <h2 className={styles.tagline}>shop outside the box</h2>
      <ChatComponent />
    </div>
  );
};

export default HomePage;
