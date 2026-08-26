import { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Phase 0 (scope-v1.md) : un seul écran jetable, un seul personnage, pour valider
// la qualité et la sûreté des réponses avant toute UI définitive.
// À pointer vers le proxy Scaleway une fois déployé.
// IP LAN du poste de dev (pas "localhost" : sur un téléphone physique, ça pointerait vers le téléphone lui-même).
const PROXY_URL = 'http://192.168.1.14:8787/chat';
const CHARACTER_ID = 'cleopatre';
const CHILD_AGE = 8;

type Source = { label: string; url: string };
type Message = { role: 'user' | 'assistant'; content: string; sources?: Source[] };

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function sendMessage() {
    const question = input.trim();
    if (!question || isLoading) return;

    const nextMessages: Message[] = [...messages, { role: 'user', content: question }];
    setMessages(nextMessages);
    setInput('');
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const response = await fetch(PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterId: CHARACTER_ID,
          childAge: CHILD_AGE,
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur serveur (${response.status})`);
      }

      const data: { reply: string; sources: Source[] } = await response.json();
      setMessages((current) => [
        ...current,
        { role: 'assistant', content: data.reply, sources: data.sources },
      ]);
    } catch (error) {
      setErrorMessage(
        "Cléopâtre ne répond pas pour l'instant. Vérifie que le serveur local tourne (npm run dev dans server/)."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text style={styles.header}>Cléopâtre 👑</Text>

        <FlatList
          style={styles.flex}
          contentContainerStyle={styles.messageList}
          data={messages}
          keyExtractor={(_, index) => String(index)}
          renderItem={({ item }) => (
            <View
              style={[
                styles.bubble,
                item.role === 'user' ? styles.bubbleUser : styles.bubbleAssistant,
              ]}
            >
              <Text style={styles.bubbleText}>{item.content}</Text>
              {item.sources && item.sources.length > 0 && (
                <View style={styles.sources}>
                  <Text style={styles.sourcesLabel}>Sources vérifiées :</Text>
                  {item.sources.map((source) => (
                    <Text key={source.url} style={styles.sourceItem}>
                      • {source.label}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          )}
        />

        {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Pose ta question à Cléopâtre..."
            editable={!isLoading}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />
          <Pressable
            style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={isLoading}
          >
            <Text style={styles.sendButtonText}>{isLoading ? '…' : 'Envoyer'}</Text>
          </Pressable>
        </View>

        <StatusBar style="auto" />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fdf6e3' },
  flex: { flex: 1 },
  header: { fontSize: 22, fontWeight: '700', textAlign: 'center', paddingVertical: 12 },
  messageList: { padding: 12, gap: 8 },
  bubble: { maxWidth: '85%', borderRadius: 16, padding: 12 },
  bubbleUser: { alignSelf: 'flex-end', backgroundColor: '#cdeac0' },
  bubbleAssistant: { alignSelf: 'flex-start', backgroundColor: '#ffffff' },
  bubbleText: { fontSize: 16 },
  sources: { marginTop: 8, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 6 },
  sourcesLabel: { fontSize: 11, fontWeight: '600', color: '#888' },
  sourceItem: { fontSize: 11, color: '#888' },
  error: { color: '#b00020', textAlign: 'center', paddingHorizontal: 12, paddingBottom: 4 },
  inputRow: { flexDirection: 'row', padding: 12, gap: 8 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  sendButton: {
    backgroundColor: '#c99b3a',
    borderRadius: 20,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  sendButtonDisabled: { opacity: 0.5 },
  sendButtonText: { color: '#fff', fontWeight: '600' },
});
