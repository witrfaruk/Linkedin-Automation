export async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries: number = 3,
  backoffMs: number = 1000
): Promise<Response> {
  try {
    const response = await fetch(url, options);
    
    // Retry on 5xx errors or 429 Too Many Requests
    if (!response.ok && (response.status >= 500 || response.status === 429)) {
      if (retries > 0) {
        console.warn(`Fetch failed (${response.status}) for ${url}. Retrying in ${backoffMs}ms...`);
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
        return fetchWithRetry(url, options, retries - 1, backoffMs * 2);
      }
    }
    
    return response;
  } catch (error) {
    if (retries > 0) {
      console.warn(`Fetch threw error for ${url}: ${(error as Error).message}. Retrying in ${backoffMs}ms...`);
      await new Promise((resolve) => setTimeout(resolve, backoffMs));
      return fetchWithRetry(url, options, retries - 1, backoffMs * 2);
    }
    throw error;
  }
}

export function withTimeout(signal: AbortSignal, timeoutMs: number): AbortSignal {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  // If the parent signal aborts, abort our controller
  signal.addEventListener("abort", () => {
    clearTimeout(timeoutId);
    controller.abort();
  });

  return controller.signal;
}
