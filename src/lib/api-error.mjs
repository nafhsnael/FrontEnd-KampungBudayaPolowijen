/**
 * @param {unknown} value
 * @returns {value is Record<string, unknown>}
 */
function isRecord(value) {
  return typeof value === "object" && value !== null;
}

/**
 * @param {Response} response
 * @param {string} fallbackMessage
 */
export async function getApiErrorMessage(response, fallbackMessage) {
  if (response.status >= 500) {
    return fallbackMessage;
  }

  try {
    const body = /** @type {unknown} */ (await response.json());
    if (
      isRecord(body) &&
      typeof body.message === "string" &&
      body.message.trim().length > 0 &&
      body.message.length <= 200
    ) {
      return body.message;
    }
  } catch {
    return fallbackMessage;
  }

  return fallbackMessage;
}
