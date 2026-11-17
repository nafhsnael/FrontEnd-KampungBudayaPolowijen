/**
 * @param {Record<string, unknown>} data
 */
export function serializeJsonLd(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
