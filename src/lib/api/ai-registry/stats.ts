import { prismaClient } from '@bitte-ai/data';
import { getAllDailyPings, getTotalPingsByAgentIds } from '../kv';

export const getStats = async () => {
  const start = Date.now();
  console.log('Getting stats');
  const agentIds = (
    (await prismaClient.$queryRaw`SELECT id FROM agent`) as { id: string }[]
  ).map((a) => a.id);
  console.log(`Got agents (${agentIds.length}) - ${Date.now() - start}ms`);

  const pingCounts = await getTotalPingsByAgentIds(agentIds);
  const totalPings = Object.values(pingCounts).reduce<number>(
    (sum: number, count: number | null) => sum + (count || 0),
    0
  );
  console.log(`Got total pings (${totalPings}) - ${Date.now() - start}ms`);

  const allDailyPings = await getAllDailyPings(agentIds);
  console.log(
    `Got daily pings (${allDailyPings.length}) - ${Date.now() - start}ms`
  );

  // Convert to chart data format
  const chartData = Object.entries(allDailyPings)
    .map(([date, pings]) => ({
      date,
      pings,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
  console.log(`Created chart - ${Date.now() - start}ms`);

  return {
    totalAgents: agentIds.length,
    totalPings: totalPings,
    chartData,
  };
};
