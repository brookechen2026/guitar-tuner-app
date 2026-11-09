import { NextResponse } from 'next/server';

// Function to handle POST requests
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Forward the request to your Flask back-end
    const flaskResponse = await fetch('http://127.0.0.1:5000/check_pitch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // Handle the response from the Flask server
    const flaskData = await flaskResponse.json();

    // Return the response back to the client
    return NextResponse.json(flaskData);
  } catch (error) {
    console.error('Error forwarding request to Flask:', error);
    return new Response('Failed to fetch pitch data', { status: 500 });
  }
}
