import { Suspense } from "react";
import ResultsClient from "./ResultsClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-5">読み込み中...</div>}>
      <ResultsClient />
    </Suspense>
  );
}
