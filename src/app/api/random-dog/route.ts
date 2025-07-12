
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://dog.ceo/api/breeds/image/random');
    if (!response.ok) {
      throw new Error(`Failed to fetch from dog.ceo API: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.status === 'success') {
      return NextResponse.json({ imageUrl: data.message });
    } else {
      return NextResponse.json({ error: 'Failed to get image URL from dog.ceo' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
