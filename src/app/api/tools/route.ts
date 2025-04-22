import { prismaClient } from '@bitte-ai/data';
import { NextRequest, NextResponse } from 'next/server';

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

    const query = `
      SELECT
        t.id,
        t.agent_id as "agentId",
        t.execution,
        t.function,
        t.type,
        t.verified,
        COALESCE(c.pings, 0) AS pings,
        COALESCE(a.chain_ids, ARRAY[]::bigint[]) AS "chainIds",
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

    const tools = await prismaClient.$queryRawUnsafe(query, ...params);

    console.log(tools);

    // FIXME: add primitives

    // Response shape
    // {
    //   [x][] pings: number;
    //   [x][] isPrimitive: boolean;
    //   [x][] image: any;
    //   [x][] function: JsonValue;
    //   [x][] id: string;
    //   [x][] agentId: string | null;
    //   [x][] execution: JsonValue;
    //   [x][] type: string;
    //   [x][] verified: boolean;
    // }[]

    // Convert any BigInt values to strings to avoid JSON serialization issues
    const sanitizedRes = JSON.parse(
      JSON.stringify(tools, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    );

    return NextResponse.json(sanitizedRes);
  } catch (error) {
    console.error('Error fetching tools:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tools' },
      { status: 500 }
    );
  }
}
