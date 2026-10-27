import { useEffect, useState } from "react";

const query = "(max-width: 1199px)";

/** Keep row tasks visible while the sidebar leaves too little room for a table. */
export function useCompactLayout() {
  const [compact, setCompact] = useState(
    () => window.matchMedia(query).matches,
  );
  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setCompact(media.matches);
    media.addEventListener("change", update);
    update();
    return () => media.removeEventListener("change", update);
  }, []);
  return compact;
}
