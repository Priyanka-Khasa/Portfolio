import { Link } from "react-router-dom";
import "./not-found.css";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <section className="not-found-panel">
        <p className="not-found-code">404</p>
        <h1>Page not found</h1>
        <p>
          This page is not part of Priyanka's portfolio, but the work, skills,
          and contact sections are just one click away.
        </p>
        <Link className="not-found-link" to="/">
          Back to portfolio
        </Link>
      </section>
    </main>
  );
}
