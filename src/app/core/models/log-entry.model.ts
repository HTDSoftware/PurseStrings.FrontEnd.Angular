export interface LogEntry {
  level: string; // Log level (e.g., 'INFO', 'ERROR', 'WARN')
  component: string; // Component or service name
  message: string; // Log message
}
