/**
 * Raw model from API
 */

export interface PagedView<T> {
  paging: Paging
  elements: T[]
}

export interface Paging {
  start: number
  count: number
  total: number
  links: any[]
}
/**
 * Parsed model
 */
export interface PagedList<T> {
  paging: PagingResponse
  elements: T[]
}

export interface PagingResponse {
  offset: number
  count: number
  total: number
}

