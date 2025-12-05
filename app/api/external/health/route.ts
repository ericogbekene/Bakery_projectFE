import { NextResponse } from 'next/server';
import externalApiClient from '@/lib/api/external-client';
import { externalApiCircuitBreaker } from '@/lib/circuit-breaker';

/**
 * GET /api/external/health
 * 
 * Health check endpoint for external API connectivity
 * Returns status, response time, and circuit breaker state
 */
export async function GET() {
  try {
    const startTime = Date.now();
    
    // Check circuit breaker state
    const circuitBreakerState = externalApiCircuitBreaker.getState();
    const isCircuitBreakerHealthy = externalApiCircuitBreaker.isHealthy();
    
    // Perform health check on external API
    const healthCheck = await externalApiClient.healthCheck();
    
    const responseTime = Date.now() - startTime;
    
    const response = {
      success: true,
      data: {
        external_api: {
          status: healthCheck.status,
          response_time: healthCheck.responseTime,
          timestamp: healthCheck.timestamp,
        },
        circuit_breaker: {
          state: circuitBreakerState,
          is_healthy: isCircuitBreakerHealthy,
          failure_count: externalApiCircuitBreaker.getFailureCount(),
        },
        overall_status: healthCheck.status === 'healthy' && isCircuitBreakerHealthy ? 'healthy' : 'degraded',
        response_time: responseTime,
        timestamp: new Date().toISOString(),
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error checking external API health:', error);
    
    const response = {
      success: false,
      error: 'Failed to check external API health',
      data: {
        external_api: {
          status: 'unhealthy',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        circuit_breaker: {
          state: externalApiCircuitBreaker.getState(),
          is_healthy: externalApiCircuitBreaker.isHealthy(),
          failure_count: externalApiCircuitBreaker.getFailureCount(),
        },
        overall_status: 'unhealthy',
        timestamp: new Date().toISOString(),
      }
    };

    return NextResponse.json(response, { status: 500 });
  }
}
