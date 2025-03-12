import { generateId } from 'ai';

/**
 * Determines the appropriate cover image URL for an agent.
 * @param {string | undefined} imageUrl - The image URL or path provided by the agent.
 * @returns {string} The processed image URL.
 */
export const getCoverImageUrl = (imageUrl: string | undefined): string => {
  if (!imageUrl) return '/logo.svg';
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  return `/${imageUrl.replace(/^\//, '')}`;
};

/**
 * Constructs the URL to run an agent, appending debug mode if necessary.
 * @param {string} agentId - The ID of the agent.
 * @param {boolean} isVerified - Whether the agent is verified.
 * @returns {string} The constructed URL.
 */
export const getRunAgentUrl = (
  agentId: string,
  isVerified: boolean
): string => {
  return `/chat${generateId()}?agentid=${agentId}${isVerified ? '' : '&mode=debug'}`;
};
