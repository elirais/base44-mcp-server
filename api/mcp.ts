import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import createServer from "../src/index.js";
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  runtime: 'nodejs',
  maxDuration: 60, // 60 seconds for Hobby plan
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    // Create MCP server instance
    const server = createServer();
    
    // Create SSE transport with the response object
    const transport = new SSEServerTransport('/message', res);
    
    // Connect server to transport
    await server.connect(transport);
    
    // Handle GET request for SSE endpoint
    if (req.method === 'GET') {
      // SSE connection established, keep alive
      return;
    }
    
    // Handle POST request with MCP message
    if (req.method === 'POST') {
      const message = req.body;
      await transport.handlePostMessage(message, res);
      return;
    }
    
    // Method not allowed
    res.status(405).json({ error: 'Method not allowed' });
    
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
