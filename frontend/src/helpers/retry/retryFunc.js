export const fetchWithRetry = async (
  url,
  options = {},
  retries = 3,
  delay = 3000
) => {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      return await res.json();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};
