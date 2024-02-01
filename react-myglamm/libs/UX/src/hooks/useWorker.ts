import { useEffect, useMemo } from "react";

function useWorker<T>(worker: () => workerInstance<T>) {
  /**
   * memoise a worker so it can be reused; create one worker up front
   * and then reuse it subsequently; no creating new workers each time
   */
  const workerApiAndCleanup = useMemo(() => worker(), []);

  useEffect(() => {
    const { cleanup } = workerApiAndCleanup;

    /**
     * cleanup our worker when we're done with it
     */
    return () => {
      cleanup();
    };
  }, [workerApiAndCleanup]);

  return workerApiAndCleanup;
}

export default useWorker;
