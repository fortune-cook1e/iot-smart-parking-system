import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSocket } from '@/hooks/use-socket';
import { useEffect, useState } from 'react';

export default function SocketDebugger() {
  const { socket, isConnected } = useSocket();
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev.slice(-10), `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  useEffect(() => {
    if (!socket) {
      addLog('Socket not initialized');
      return;
    }

    const onConnect = () => addLog('✅ Connected');
    const onDisconnect = (reason: string) => addLog(`❌ Disconnected: ${reason}`);
    const onConnectError = (error: any) => addLog(`❌ Error: ${error.message}`);
    const onError = (error: any) => addLog(`❌ Socket error: ${error}`);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);
    socket.on('error', onError);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      socket.off('error', onError);
    };
  }, [socket]);

  const handleReconnect = () => {
    if (socket) {
      addLog('Attempting to reconnect...');
      socket.connect();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.indicator, isConnected ? styles.connected : styles.disconnected]} />
        <Text style={styles.status}>{isConnected ? 'Connected' : 'Disconnected'}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleReconnect}>
        <Text style={styles.buttonText}>Reconnect</Text>
      </TouchableOpacity>

      <View style={styles.logs}>
        <Text style={styles.logsTitle}>Socket Logs:</Text>
        {logs.map((log, index) => (
          <Text key={index} style={styles.logText}>
            {log}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 10,
    borderRadius: 8,
    width: 250,
    zIndex: 9999,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  connected: {
    backgroundColor: '#4caf50',
  },
  disconnected: {
    backgroundColor: '#f44336',
  },
  status: {
    color: 'white',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#667eea',
    padding: 8,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  logs: {
    maxHeight: 200,
  },
  logsTitle: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  logText: {
    color: '#ccc',
    fontSize: 10,
    marginBottom: 2,
  },
});
