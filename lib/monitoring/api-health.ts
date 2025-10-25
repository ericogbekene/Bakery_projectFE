import externalApiClient from '@/lib/api/external-client';
import { externalApiCircuitBreaker } from '@/lib/circuit-breaker';

export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  external_api: {
    status: string;
    response_time: number;
    timestamp: string;
  };
  circuit_breaker: {
    state: string;
    is_healthy: boolean;
    failure_count: number;
  };
  overall_status: string;
  response_time: number;
  timestamp: string;
}

/**
 * Check the health of the external API
 */
export async function checkExternalApiHealth(): Promise<HealthCheckResult> {
  const startTime = Date.now();
  
  try {
    // Check circuit breaker state
    const circuitBreakerState = externalApiCircuitBreaker.getState();
    const isCircuitBreakerHealthy = externalApiCircuitBreaker.isHealthy();
    
    // Perform health check on external API
    const healthCheck = await externalApiClient.healthCheck();
    
    const responseTime = Date.now() - startTime;
    
    return {
      status: healthCheck.status === 'healthy' && isCircuitBreakerHealthy ? 'healthy' : 'degraded',
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
    };
  } catch {
    return {
      status: 'unhealthy',
      external_api: {
        status: 'unhealthy',
        response_time: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      },
      circuit_breaker: {
        state: externalApiCircuitBreaker.getState(),
        is_healthy: externalApiCircuitBreaker.isHealthy(),
        failure_count: externalApiCircuitBreaker.getFailureCount(),
      },
      overall_status: 'unhealthy',
      response_time: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Get detailed health metrics
 */
export async function getHealthMetrics() {
  const healthCheck = await checkExternalApiHealth();
  
  return {
    ...healthCheck,
    metrics: {
      circuit_breaker_failure_count: externalApiCircuitBreaker.getFailureCount(),
      circuit_breaker_state: externalApiCircuitBreaker.getState(),
      time_until_next_attempt: externalApiCircuitBreaker.getTimeUntilNextAttempt(),
      is_authenticated: externalApiClient.getAuthStatus(),
    }
  };
}
