import { PublicChainData, isPublicChainId } from '../config';

/**
 * Returs the explorer url (e.g. Aergoscan) for a public chainId and path
 * @param chainId 
 * @param path 
 */
export function getExplorerUrl(chainId: string, path: string): string {
  if (!isPublicChainId(chainId)) {
    return '';
  }
  const base = PublicChainData[chainId].explorerUrl;
  return `${base}/${path}`;
}

/**
 * Returs the API url (e.g. Aergoscan API) for a public chainId and path
 * @param chainId 
 * @param path 
 */
export function getApiUrl(chainId: string, path: string): string {
  if (!isPublicChainId(chainId)) {
    return '';
  }
  const base = PublicChainData[chainId].apiUrl;
  return `${base}/${path}`;
}