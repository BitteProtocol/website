import { NextRequest, NextResponse } from 'next/server';
import {
  WalletConnectionState,
  WalletConnectionResponse,
} from '@/lib/types/wallet.types';

// In-memory store for demo purposes. In production, use a database
let walletState: WalletConnectionState = {
  isEvmConnected: false,
  isNearConnected: false,
  isSuiConnected: false,
  lastUpdated: new Date().toISOString(),
};

export async function GET(request: NextRequest) {
  // Try to get state from cookie first
  const cookieState = request.cookies.get('wallet_state')?.value;
  if (cookieState) {
    try {
      const state = JSON.parse(cookieState);
      return NextResponse.json<WalletConnectionResponse>({
        success: true,
        state,
      });
    } catch (error) {
      console.error('Error parsing cookie state:', error);
    }
  }

  return NextResponse.json<WalletConnectionResponse>({
    success: true,
    state: walletState,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newState: WalletConnectionState = {
      ...body,
      lastUpdated: new Date().toISOString(),
    };

    walletState = newState;

    const response = NextResponse.json<WalletConnectionResponse>({
      success: true,
      state: walletState,
    });

    // Set cookie with wallet state
    response.cookies.set('wallet_state', JSON.stringify(walletState), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
      domain:
        process.env.NODE_ENV === 'production'
          ? process.env.NEXT_PUBLIC_DOMAIN
          : 'localhost',
    });

    return response;
  } catch (error) {
    return NextResponse.json<WalletConnectionResponse>(
      {
        success: false,
        state: walletState,
        error: 'Failed to update wallet state',
      },
      { status: 400 }
    );
  }
}
