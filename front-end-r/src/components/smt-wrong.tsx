import { Link } from "react-router-dom";
import { BrandMark } from "./brand-mark";
import { Button } from "./ui/button";

export default function SmtError() {
  return (
    <main className="account-help">
      <div>
        <BrandMark size={58} />
        <h1>A little pause in the story.</h1>
        <p>
          Something interrupted this page. Please try loading it again, or
          return to your library.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => window.location.reload()}>Try again</Button>
          <Button asChild variant="outline">
            <Link to="/">Back to the library</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
