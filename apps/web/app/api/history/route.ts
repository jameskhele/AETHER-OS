import { NextResponse } from 'next/server';
import { prisma } from '@aether/database';

export async function GET() {
  try {
    // Query the latest 10 distinct operational directives from SQL!
    const missions = await prisma.mission.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { logs: true }
        }
      }
    });

    return NextResponse.json({ success: true, data: missions });
  } catch (error: any) {
    console.error("API FETCH ERROR:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
