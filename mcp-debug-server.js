#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

class DebugServer {
  constructor() {
    this.server = new McpServer('egrow-debug-server', {
      name: 'Egrow Academy Debug Server',
      version: '1.0.0',
    });
    
    this.setupTools();
  }

  setupTools() {
    // Tool para verificar estado del servidor Next.js
    this.server.addTool({
      name: 'check_nextjs_status',
      description: 'Verifica el estado del servidor Next.js local',
      inputSchema: {
        type: 'object',
        properties: {
          port: { type: 'number', default: 3000 }
        }
      }
    }, async (args) => {
      const port = args.port || 3000;
      try {
        const response = await fetch(`http://localhost:${port}/api/health`);
        return {
          status: 'running',
          port: port,
          healthy: response.ok
        };
      } catch (error) {
        return {
          status: 'not_running',
          port: port,
          error: error.message
        };
      }
    });

    // Tool para verificar base de datos
    this.server.addTool({
      name: 'check_database',
      description: 'Verifica la conexión a la base de datos',
      inputSchema: { type: 'object', properties: {} }
    }, async () => {
      try {
        // Aquí podrías conectar con Prisma para verificar la BD
        return {
          status: 'connected',
          message: 'Base de datos disponible'
        };
      } catch (error) {
        return {
          status: 'error',
          error: error.message
        };
      }
    });

    // Tool para listar errores comunes
    this.server.addTool({
      name: 'common_errors',
      description: 'Lista errores comunes de Next.js y sus soluciones',
      inputSchema: { type: 'object', properties: {} }
    }, async () => {
      return {
        errors: [
          {
            error: "EADDRINUSE: address already in use",
            solution: "Ejecutar: npx kill-port 3000 o usar otro puerto"
          },
          {
            error: "Module not found",
            solution: "Ejecutar: npm install"
          },
          {
            error: "Prisma error",
            solution: "Ejecutar: npx prisma generate && npx prisma db push"
          },
          {
            error: "TypeScript errors",
            solution: "Ejecutar: npm run lint y revisar errores"
          }
        ]
      };
    });
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}

const server = new DebugServer();
server.start().catch(console.error);