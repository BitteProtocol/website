import { prismaClient } from '@bitte-ai/data';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
  // // FIXME: make use of these params
  // const { searchParams } = new URL(request.url);
  // const functionName = searchParams.get('function');
  // const verifiedOnly = searchParams.get('verifiedOnly') !== 'false';
  // const offset = parseInt(searchParams.get('offset') || '0');
  // const chainId = searchParams.get('chainId');

  try {
    const res = await prismaClient.$queryRaw`
      SELECT
        t.*,
        COALESCE(c.pings, 0) AS pings,
        COALESCE(a.chain_ids, ARRAY[]::bigint[]) AS chain_ids,
        COALESCE(a.image, '/bitte-symbol-black.svg') AS image
      FROM tool t
      LEFT JOIN (
        SELECT tool_id, count(*) AS pings
        FROM tool_call
        GROUP BY tool_id
      ) c ON t.id = c.tool_id
      LEFT JOIN agent a ON t.agent_id = a.id;
    `;

    console.log(res);

    // FIXME: add primitives

    // Response shape
    // {
    //   pings: number;
    //   isPrimitive: boolean;
    //   image: any;
    //   function: JsonValue;
    //   id: string;
    //   agentId: string | null;
    //   execution: JsonValue;
    //   type: string;
    //   verified: boolean;
    // }[]

    return NextResponse.json(res);
  } catch (error) {
    console.error('Error fetching tools:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tools' },
      { status: 500 }
    );
  }
}
