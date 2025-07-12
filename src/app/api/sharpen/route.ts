
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as Blob | null;
    const strength = formData.get('strength') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    const oyyiApiUrl = 'https://oyyi.xyz/api/image/sharpen';
    const apiFormData = new FormData();
    apiFormData.append('file', file);
    if (strength) {
      apiFormData.append('strength', strength);
    }
    
    const response = await fetch(oyyiApiUrl, {
      method: 'POST',
      body: apiFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Oyyi API Error:', errorText);
      return NextResponse.json({ error: 'Failed to sharpen image with Oyyi API.', details: errorText }, { status: response.status });
    }

    const imageBlob = await response.blob();
    
    return new NextResponse(imageBlob, {
      status: 200,
      headers: {
        'Content-Type': imageBlob.type,
      },
    });

  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'An internal server error occurred.', details: error.message }, { status: 500 });
  }
}
