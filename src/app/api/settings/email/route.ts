import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Here you would save the email to the database
    // For now, we'll just simulate a successful save

    // TODO: Add database integration
    // Example: await db.user.update({
    //   where: { id: userId },
    //   data: { email },
    // });

    // Simulate a slight delay to make it feel more realistic
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json(
      { message: 'Email saved successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to save email:', error);
    return NextResponse.json(
      { error: 'Failed to save email' },
      { status: 500 }
    );
  }
}
