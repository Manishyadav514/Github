import useWorker from "./useWorker";
import utilWorkers from "../workers/utils/utilWorkers";

/**
 * Our hook that performs the calculation on the worker
 */
function useUtilWorkers() {
  /**
   * Retrive the worker from useWorker hook
   */
  const { api: utilWorker } = useWorker<UtilWorkerExport>(utilWorkers);

  return { utilWorker };
}

export default useUtilWorkers;
