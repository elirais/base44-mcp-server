import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import createServer from "../src/index.js";
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  runtime: 'nodejs',
  maxDuration: 300, // 5 minutes max (requires Pro plan, 10s on free tier)
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    // Create MCP server instance
    const server = createServer();
    
    // Create SSE transport
    const transport = new SSEServerTransport('/message', res);
    
    // Connect server to transport
    await server.connect(transport);
    
    // Handle the incoming message
    const message = req.body;
    await transport.handlePostMessage(message, res);
    
  } catch (error: any) {
    console.error('MCP Server Error:', error);
    
    // Don't send response if headers already sent
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Internal server error',
        message: error?.message || 'Unknown error'
      });
    }
  }
}

// Made with Bob
