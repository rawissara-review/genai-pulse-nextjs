import { NextRequest, NextResponse } from 'next/server';

const GAS_URL =
  process.env.SHEETS_URL ||
  'https://script.google.com/macros/s/AKfycbysL2I7fTQsyqQJscCQi6nL2Y2YvO5uo0kzM-AU58V3u0nRK0omIP-TSyAK6TwIncEl/exec';

export async function GET() {
  try {
    const res = await fetch(`${GAS_URL}?_t=${Date.now()}`, { cache: 'no-store' });
    const text = await res.text();
    try {
      return NextResponse.json(JSON.parse(text));
    } catch {
      return NextResponse.json(
        { ok: false, error: 'GAS returned non-JSON — deploy the Apps Script and set Who has access: Anyone.' },
        { status: 500 }
      );
    }
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const params = new URLSearchParams({ action: 'write', data: JSON.stringify(data) });
    const res = await fetch(`${GAS_URL}?${params.toString()}`);
    const text = await res.text();
    try {
      return NextResponse.json(JSON.parse(text));
    } catch {
      return NextResponse.json({ ok: true });
    }
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await fetch(`${GAS_URL}?${new URLSearchParams({ action: 'clearAll' }).toString()}`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
