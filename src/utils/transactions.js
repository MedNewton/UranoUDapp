import { getErrorMessage } from "@/utils/errors";

export async function handleTransaction(txPromise, onSuccess, onError) {
  try {
    const result = await txPromise;
    if (onSuccess) onSuccess(result);
    return result;
  } catch (error) {
    const message = getErrorMessage(error);
    console.error("Transaction failed:", message);
    if (onError) onError(new Error(message));
    return null;
  }
}
