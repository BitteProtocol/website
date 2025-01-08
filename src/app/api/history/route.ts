import type { NextRequest } from 'next/server';

const { BITTE_API_KEY } = process.env;

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export const GET = async (req: NextRequest): Promise<Response> => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const url = `http://wallet.bitte.ai/api/v1/history?id=${id}`;
  const requestInit: RequestInit = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${BITTE_API_KEY}`,
    },
  };

  const upstreamResponse = await fetch(url, requestInit);

  const headers = new Headers(upstreamResponse.headers);
  headers.delete('Content-Encoding');

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers,
  });
};
