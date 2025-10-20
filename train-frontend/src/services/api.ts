export async function apiGet<T>(url: string): Promise<T> {
  try {
    console.log("url:", url);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: T = await response.json();
    return data;
  } catch (error) {
    console.error('API GET request failed:', error);
    throw error;
  }
}
