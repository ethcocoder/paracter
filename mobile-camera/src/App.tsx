import React, { useEffect, useRef, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';

type Status = 'idle' | 'starting' | 'ready' | 'streaming' | 'error';

export default function App() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const timerRef = useRef<number | null>(null);
  const [endpoint, setEndpoint] = useState('ws://192.168.1.100:8765/frames');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('Enter the desktop WebSocket endpoint.');
  const [fps, setFps] = useState(5);
  const [sent, setSent] = useState(0);

  useEffect(() => () => stop(), []);

  async function start() {
    try {
      setStatus('starting');
      setMessage('Requesting camera permission…');
      const media = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false });
      streamRef.current = media;
      if (videoRef.current) { videoRef.current.srcObject = media; await videoRef.current.play(); }
      setStatus('ready');
      setMessage('Camera ready. Press Connect to stream frames.');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Camera permission failed.');
    }
  }

  function connect() {
    if (!streamRef.current) { setMessage('Start the camera before connecting.'); return; }
    try {
      const socket = new WebSocket(endpoint);
      socketRef.current = socket;
      socket.onopen = () => { setStatus('streaming'); setMessage('Connected — streaming local camera frames.'); startSending(); };
      socket.onclose = () => { if (status === 'streaming') setStatus('ready'); setMessage('Desktop connection closed.'); stopSending(); };
      socket.onerror = () => { setStatus('error'); setMessage('Could not connect to the desktop endpoint.'); };
    } catch { setStatus('error'); setMessage('Invalid WebSocket endpoint.'); }
  }

  function startSending() {
    stopSending();
    timerRef.current = window.setInterval(() => {
      const video = videoRef.current, canvas = canvasRef.current, socket = socketRef.current;
      if (!video || !canvas || !socket || socket.readyState !== WebSocket.OPEN || video.videoWidth === 0) return;
      canvas.width = video.videoWidth; canvas.height = video.videoHeight;
      canvas.getContext('2d')?.drawImage(video, 0, 0);
      canvas.toBlob(blob => { if (!blob || socket.readyState !== WebSocket.OPEN) return; socket.send(blob); setSent(value => value + 1); }, 'image/jpeg', 0.72);
    }, Math.max(100, 1000 / fps));
  }

  function stopSending() { if (timerRef.current !== null) { window.clearInterval(timerRef.current); timerRef.current = null; } }
  function stop() { stopSending(); socketRef.current?.close(); streamRef.current?.getTracks().forEach(track => track.stop()); streamRef.current = null; setStatus('idle'); setMessage('Camera stopped.'); }

  return <SafeAreaView style={styles.safe}>
    <View style={styles.header}><Text style={styles.eyebrow}>PROJECTED AI INTERFACE</Text><Text style={styles.title}>Phone Camera</Text><Text style={styles.subtitle}>Phase 3 • local Wi-Fi transport</Text></View>
    <View style={styles.preview}><video ref={videoRef} playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} /><canvas ref={canvasRef} style={{ display: 'none' }} /><View style={styles.badge}><Text style={styles.badgeText}>{status.toUpperCase()}</Text></View></View>
    <View style={styles.panel}><Text style={styles.label}>Desktop WebSocket endpoint</Text><TextInput value={endpoint} onChangeText={setEndpoint} autoCapitalize="none" autoCorrect={false} style={styles.input} placeholder="ws://desktop-ip:8765/frames" placeholderTextColor="#71809a" /><View style={styles.row}><Text style={styles.label}>Capture rate: {fps} FPS</Text><View style={styles.rateRow}>{[2, 5, 10].map(rate => <Pressable key={rate} onPress={() => setFps(rate)} style={[styles.rate, fps === rate && styles.rateActive]}><Text style={styles.rateText}>{rate}</Text></Pressable>)}</View></View><Text style={styles.message}>{message}</Text><View style={styles.actions}><Pressable onPress={start} style={styles.secondary}><Text style={styles.secondaryText}>Start camera</Text></Pressable><Pressable onPress={connect} style={styles.primary}><Text style={styles.primaryText}>Connect</Text></Pressable><Pressable onPress={stop} style={styles.danger}><Text style={styles.dangerText}>Stop</Text></Pressable></View><Text style={styles.stats}>Frames sent: {sent}  •  Keep this connection on your local network.</Text></View>
  </SafeAreaView>;
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: '#0b1220', padding: 20 }, header: { paddingTop: 12, paddingBottom: 18 }, eyebrow: { color: '#55d6be', fontSize: 12, fontWeight: '700', letterSpacing: 1.5 }, title: { color: '#f5f7fb', fontSize: 32, fontWeight: '800', marginTop: 6 }, subtitle: { color: '#8ea6c7', fontSize: 14, marginTop: 4 }, preview: { height: 300, backgroundColor: '#162238', borderRadius: 22, overflow: 'hidden', borderWidth: 1, borderColor: '#2b3d59', position: 'relative' }, badge: { position: 'absolute', top: 14, left: 14, backgroundColor: '#0b1220cc', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7 }, badgeText: { color: '#55d6be', fontSize: 11, fontWeight: '800' }, panel: { paddingTop: 22 }, label: { color: '#a8b9cf', fontSize: 13, fontWeight: '600', marginBottom: 8 }, input: { backgroundColor: '#162238', borderColor: '#2b3d59', borderWidth: 1, borderRadius: 12, padding: 14, color: '#f5f7fb', fontSize: 14 }, row: { marginTop: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, rateRow: { flexDirection: 'row', gap: 8 }, rate: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8, backgroundColor: '#162238' }, rateActive: { backgroundColor: '#28527d' }, rateText: { color: '#f5f7fb', fontWeight: '700' }, message: { color: '#55d6be', marginTop: 18, minHeight: 20 }, actions: { flexDirection: 'row', gap: 10, marginTop: 18 }, primary: { backgroundColor: '#4d83d1', borderRadius: 12, paddingVertical: 14, paddingHorizontal: 20 }, primaryText: { color: 'white', fontWeight: '800' }, secondary: { borderColor: '#52769d', borderWidth: 1, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 16 }, secondaryText: { color: '#c6d5e8', fontWeight: '700' }, danger: { borderColor: '#744b59', borderWidth: 1, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 16 }, dangerText: { color: '#ff9caa', fontWeight: '700' }, stats: { color: '#71809a', fontSize: 12, marginTop: 16 }
});
