import { createClient } from '@vercel/kv';

const kv = createClient({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export const getTotalPingsByAgentId = async (
  agentId: string
): Promise<number | null> => {
  return await kv.get<number>(`smart-action:v1.0:agent:${agentId}:pings`);
};

export const getTotalPingsByAgentIds = async (
  agentIds: string[]
): Promise<Record<string, number | null>> => {
  const pipeline = kv.pipeline();
  agentIds.forEach((id) => {
    pipeline.get<number>(`smart-action:v1.0:agent:${id}:pings`);
  });

  const values = await pipeline.exec<number[]>();

  return agentIds.reduce(
    (acc, id, index) => {
      acc[id] = values[index];
      return acc;
    },
    {} as Record<string, number | null>
  );
};

export const getDailyPingsByAgentId = async (
  agentId: string,
  date: string
): Promise<number | null> => {
  return await kv.get<number>(
    `smart-action:v1.0:agent:${agentId}:pings:${date}`
  );
};

export const getAllDailyPingsByAgentId = async (
  agentId: string
): Promise<Record<string, number>> => {
  const keys = await kv.keys(`smart-action:v1.0:agent:${agentId}:pings:*`);

  if (keys.length === 0) {
    return {};
  }

  const pipeline = kv.pipeline();
  keys.forEach((key) => {
    pipeline.get<number>(key);
  });
  const values = await pipeline.exec<number[]>();

  const dailyPings: Record<string, number> = {};
  keys.forEach((key, index) => {
    const date = key.split(':').pop();
    if (date && values[index]) {
      dailyPings[date] = values[index];
    }
  });

  return dailyPings;
};

export const getAllDailyPings = async (
  agentIds: string[]
): Promise<Record<string, number>> => {
  // Manually generate all possible keys
  const keys: string[] = [];
  const dates: string[] = datesUntilToday();
  const pipeline = kv.pipeline();
  agentIds.forEach((agentId) => {
    dates.forEach(async (date) => {
      const k = `smart-action:v1.0:agent:${agentId}:pings:${date}`;
      keys.push(k);
      pipeline.get<number>(k);
    });
  });

  const values = await pipeline.exec<number[]>();

  const dailyPings: Record<string, number> = {};
  keys.forEach((k, i) => {
    const v = values[i];
    // Do nothing if null
    if (!v) return;

    const d = k.split(':')[5];
    if (dailyPings[d]) {
      // Add if it exists
      dailyPings[d] += v;
    } else {
      // Create otherwise
      dailyPings[d] = v;
    }
  });

  return dailyPings;
};

const datesUntilToday = () => {
  const start = new Date('2025-01-01');
  const end = new Date();
  const dates: string[] = [];

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(d.toISOString().split('T')[0]);
  }

  return dates;
};
