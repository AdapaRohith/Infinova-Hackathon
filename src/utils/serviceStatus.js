/**
 * Shared vocabulary for Gemini API request failures.
 *
 * A browser cannot distinguish "origin server is down" from "CORS is
 * misconfigured": an unreachable host's error page (e.g. a Cloudflare 530)
 * carries no Access-Control-Allow-Origin header, so the preflight fails, fetch
 * rejects with an opaque TypeError, and the console reports a CORS block. Both
 * are the same thing from this app's point of view — an outage — so they are
 * reported as one condition instead of leaking `Failed to fetch` to the user.
 */

export const SERVICE_OFFLINE = 'SERVICE_OFFLINE'
export const SERVICE_TIMEOUT = 'SERVICE_TIMEOUT'
export const SERVICE_ERROR = 'SERVICE_ERROR'
export const SERVICE_EMPTY = 'EMPTY_RESPONSE'
export const SERVICE_BAD_PAYLOAD = 'SERVICE_BAD_PAYLOAD'

/**
 * Statuses that mean the review never ran. These say nothing about the
 * candidate, so callers must not treat them as negative evidence.
 * Earlier stored candidates may still contain legacy failure codes.
 */
export const SERVICE_FAILURE_STATUSES = [
  'UNREACHABLE',
  'UNAVAILABLE',
  SERVICE_OFFLINE,
  SERVICE_TIMEOUT,
  SERVICE_ERROR,
  SERVICE_EMPTY,
  SERVICE_BAD_PAYLOAD,
]

export const isServiceFailure = (status) => SERVICE_FAILURE_STATUSES.includes(status)

/**
 * Gateway/tunnel codes that mean nothing is serving behind the hostname.
 * 520-530 are Cloudflare-specific; 530 is the tunnel-down case.
 */
const GATEWAY_STATUSES = [502, 503, 504, 520, 521, 522, 523, 524, 525, 526, 530]

export const isGatewayStatus = (httpStatus) => GATEWAY_STATUSES.includes(Number(httpStatus))

/** Error carrying a classified reason plus a message safe to show a user. */
export class ServiceUnavailableError extends Error {
  constructor(code, message, { httpStatus = null, cause = null } = {}) {
    super(message)
    this.name = 'ServiceUnavailableError'
    this.code = code
    this.httpStatus = httpStatus
    this.cause = cause
  }

  /** True when the backend never processed the request at all. */
  get isOutage() {
    return this.code === SERVICE_OFFLINE || this.code === SERVICE_TIMEOUT
  }
}

/**
 * Map a thrown fetch error to a reason code. A rejected fetch is always a
 * transport failure — DNS, TLS, connection refused, or a blocked preflight.
 */
export const classifyRequestError = (error) => {
  if (error?.name === 'AbortError') return SERVICE_TIMEOUT
  if (error instanceof TypeError) return SERVICE_OFFLINE
  return SERVICE_ERROR
}

/** Reason code for a response that arrived but was not usable. */
export const classifyResponseStatus = (httpStatus) =>
  isGatewayStatus(httpStatus) ? SERVICE_OFFLINE : SERVICE_ERROR

/** User-facing copy. Outage wording never implies the candidate failed. */
export const describeServiceFailure = (code, { label = 'verification service', httpStatus } = {}) => {
  switch (code) {
    case SERVICE_OFFLINE:
      return httpStatus
        ? `The ${label} is offline (HTTP ${httpStatus}). The request reached the network edge but no server answered behind it, so nothing was evaluated.`
        : `The ${label} is unreachable. The request never arrived, so nothing was evaluated. This is a backend outage — it is not a result for this candidate.`
    case SERVICE_TIMEOUT:
      return `The ${label} timed out before responding. Nothing was evaluated, so this is not a result for this candidate.`
    case SERVICE_EMPTY:
      return `The ${label} returned an empty response. Please try again.`
    case SERVICE_BAD_PAYLOAD:
      return `The ${label} returned a response this app could not read. Please try again.`
    default:
      return httpStatus
        ? `The ${label} returned an error (HTTP ${httpStatus}). Nothing was evaluated.`
        : `The ${label} could not complete the request. Nothing was evaluated.`
  }
}
