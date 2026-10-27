import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { BrandMark } from "./brand-mark";
import { Button } from "./ui/button";

export default function NotFound() {
  return (
    <main className="account-help">
      <div>
        <BrandMark size={58} />
        <h1>This page isn’t on the shelf.</h1>
        <p>
          The link may have moved, or the page may no longer be part of the
          library. Let’s find your way back.
        </p>
        <Button asChild>
          <Link to="/">
            <ArrowLeft size={16} />
            Back to the library
          </Link>
        </Button>
      </div>
    </main>
  );
}
