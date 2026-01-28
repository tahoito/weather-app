import { Suspense } from "react";
import MapPageClient from "./MapPageClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <MapPageClient />
    </Suspense>
  );
}
