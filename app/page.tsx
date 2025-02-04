import styles from "./page.module.css";

const result = [
  {
    title: "Qwant",
    url: "https://www.qwant.com/",
    description:
      "The search engine that values you as a user, not as a product",
  },
  {
    title: "DuckDuckGo",
    url: "https://duckduckgo.com/",
    description:
      "DuckDuckGo is a privacy-focused search engine that doesn't track you.",
  },
];

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.logoContainer}>
        <h1>amagon</h1>
        <h2>search outside the box</h2>
      </div>
      <input className={styles.searchInput} type="text" />
      {/* Which would be better here, an input or a button? */}
      <input className={styles.searchSubmit} type="submit" />
      <button className={styles.searchButton}>Search</button>
      {/* Should this be a component? */}
      <div className={styles.results}>
        {result.map((item, index) => (
          <div key={index} className={styles.result}>
            <div className={styles.resultTitle}>
              <a href={item.url}>{item.title}</a>
            </div>
            <div className={styles.resultDescription}>{item.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
