import { PluginToolSpec, RegistryData } from '@/lib/types/agent.types';
import { NextRequest, NextResponse } from 'next/server';
import { listAgentsFiltered } from '@bitte-ai/data';
import { createAgent, Prisma } from '@bitte-ai/data';
import { kv } from '@vercel/kv';

const { BITTE_API_URL = 'https://wallet.bitte.ai/api/v1' } = process.env;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const chainIds = searchParams.get('chainIds')?.split(',');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const verifiedOnly = searchParams.get('verifiedOnly') !== 'false';
    const category = searchParams.get('category') || undefined;

    const agents = await listAgentsFiltered({
      verified: verifiedOnly,
      chainIds,
      offset,
      limit,
      categories: category ? [category] : undefined,
    });

    const agentIds = agents.map((agent) => agent.id);
    const pingsByAgent = await getTotalPingsByAgentIds(agentIds);

    const agentsWithPings = agents.map((agent) => ({
      ...agent,
      pings: pingsByAgent[agent.id] || 0,
    }));

    const sortedAgents = agentsWithPings.sort(
      (a, b) => (b.pings as number) - (a.pings as number)
    );

    return NextResponse.json(sortedAgents);
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agents' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const input: RegistryData = {
      ...body,
      verified: false,
      id: crypto.randomUUID(),
    };

    const newAgent: Prisma.AgentCreateInput = {
      id: input.id,
      description: input.description || input.generatedDescription || '',
      instructions: input.instructions || '',
      name: input.name,
      image: input.image,
      categories: input.category ? [input.category] : [],
      accountId: input.accountId,
      repo: input.repo,
      verified: false,
      chainIds: input.chainIds,
      tools: [],
      primitives: [],
    };

    const primitiveNames: string[] = (
      (await (await fetch(`${BITTE_API_URL}/primitives`)).json()) as {
        id: string;
      }[]
    ).map((primitive) => primitive.id);

    if (input.tools)
      input.tools.forEach((tool) => {
        if (primitiveNames.includes(tool.function.name)) {
          (newAgent.primitives as string[]).push(tool.function.name);
        } else {
          if (!(tool as PluginToolSpec).id)
            throw new Error(`Tool without ID: ${JSON.stringify(tool)}`);
          (newAgent.tools as string[]).push((tool as PluginToolSpec).id);
        }
      });

    const requiredFields = [
      'name',
      'accountId',
      'description',
      'instructions',
      'tools',
      'image',
      'description',
    ];
    const missingFields = requiredFields.filter(
      (field) => !(field in newAgent)
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    await createAgent(newAgent);

    return NextResponse.json(newAgent, { status: 201 });
  } catch (error) {
    console.error('Error creating agent:', error);
    return NextResponse.json(
      { error: 'Failed to create agent' },
      { status: 500 }
    );
  }
}

const getTotalPingsByAgentIds = async (
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
