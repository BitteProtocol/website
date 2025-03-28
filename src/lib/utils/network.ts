import { RegistryData } from '../types/agent.types';
import { getNetworkMapping } from './chainIds';

export const networkMapping = getNetworkMapping(true);

export const filterLocalAndTunnelUrls = (assistant: RegistryData) => {
  const id = assistant.id || '';
  const excludedDomains = [
    'loca.lt',
    'ngrok',
    'serveo',
    'local',
    'ngrok.io',
    '1ebf1221fc9232ac89c9507dbc981a20.serveo.net',
  ];
  return !excludedDomains.some((domain) => id.includes(domain));
};
