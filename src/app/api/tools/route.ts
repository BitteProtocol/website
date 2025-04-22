import { prismaClient } from '@bitte-ai/data';
import { NextRequest, NextResponse } from 'next/server';

const { BITTE_API_URL = 'https://wallet.bitte.ai/api/v1' } = process.env;

type SqlTool = {
  pings: number;
  isPrimitive: boolean;
  image: string;
  function: object;
  id: string;
  agentId: string | null;
  execution: object | null;
  type: string;
  verified: boolean;
  chainIds: string[];
};

type PrimitiveResponse = {
  id: string;
  function: object;
  chainIds: string[];
  pings: number;
};

export async function GET(request: NextRequest) {
  // Get search parameters
  const { searchParams } = new URL(request.url);
  const functionName = searchParams.get('function');
  const verifiedOnly = searchParams.get('verifiedOnly') !== 'false';
  const offset = parseInt(searchParams.get('offset') || '0');
  const limit = parseInt(searchParams.get('limit') || '10000');
  const chainId = searchParams.get('chainId');

  try {
    let whereConditions = [];
    let params = [];

    if (verifiedOnly) {
      whereConditions.push(`a.verified = true`);
    }

    if (functionName) {
      whereConditions.push(`t.function->>'name' = $${functionName}`);
      params.push(functionName);
    }

    if (chainId) {
      whereConditions.push(`$${params.length + 1} IN a.chain_ids`);
      params.push(chainId);
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(' AND ')}`
        : '';

    // TODO: Change once chain IDs are be migrated to text[]
    const query = `
      SELECT
        t.id,
        t.agent_id as "agentId",
        t.execution,
        t.function,
        t.type,
        t.verified,
        COALESCE(c.pings::int, 0) AS pings,
        COALESCE(array(select x::text from unnest(a.chain_ids) as x), ARRAY[]::text[]) AS "chainIds",
        COALESCE(a.image, '/bitte-symbol-black.svg') AS image,
        FALSE as "isPrimitive"
      FROM tool t
      LEFT JOIN (
        SELECT tool_id, count(*) AS pings
        FROM tool_call
        GROUP BY tool_id
      ) c ON t.id = c.tool_id
      LEFT JOIN agent a ON t.agent_id = a.id
      ${whereClause}
      LIMIT ${limit} OFFSET ${offset}
    `;

    const tools: SqlTool[] = await prismaClient.$queryRawUnsafe(
      query,
      ...params
    );

    const primitivesRes = await fetch(`${BITTE_API_URL}/primitives`);
    if (!primitivesRes.ok) throw await primitivesRes.json();
    const primitives: SqlTool[] = (
      (await primitivesRes.json()) as PrimitiveResponse[]
    ).map((p) => ({
      ...p,
      isPrimitive: true,
      image: '/bitte-symbol-black.svg',
      agentId: null,
      execution: null,
      type: 'function',
      verified: true,
    }));

    const res = [...primitives, ...tools];
    res.sort((a, b) => b.pings - a.pings);

    return new NextResponse(
      JSON.stringify([...primitives, ...tools], (_, value) =>
        typeof value === 'bigint' ? value.toString() : value
      ),
      {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching tools:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tools' },
      { status: 500 }
    );
  }
}
