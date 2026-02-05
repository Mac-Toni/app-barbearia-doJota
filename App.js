import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, StatusBar, TextInput, Alert, Linking, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const SERVICOS = [
  { id: '1', nome: 'Corte Social', preco: 'R$ 30,00' },
  { id: '2', nome: 'Barba Completa', preco: 'R$ 25,00' },
  { id: '3', nome: 'Corte + Barba', preco: 'R$ 50,00' },
  { id: '4', nome: 'Corte com máquina', preco: 'R$ 20,00' },
  { id: '5', nome: 'Degradê com máquina', preco: 'R$ 35,00' },
];

export default function App() {
  const [nomeCliente, setNomeCliente] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataPretendida, setDataPretendida] = useState('');
  const [horaPretendida, setHoraPretendida] = useState('');
  const [periodo, setPeriodo] = useState('AM');

  const handleDataChange = (text) => {
    let cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length > 2) formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    if (cleaned.length > 4) formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    setDataPretendida(formatted);
  };

  const handleHoraChange = (text) => {
    let cleaned = text.replace(/\D/g, '');
    if (cleaned.length <= 2) {
      let valor = parseInt(cleaned);
      if (valor > 12) {
        Alert.alert("Formato 12h", "Use horários de 1 a 12.");
        return;
      }
    }
    let formatted = cleaned;
    if (cleaned.length > 2) formatted = `${cleaned.slice(0, 2)}:${cleaned.slice(2, 4)}`;
    if (cleaned.length <= 4) setHoraPretendida(formatted);
  };

  const realizarAgendamento = async (servicoNome) => {
    if (!nomeCliente || !telefone || dataPretendida.length < 10 || !horaPretendida) {
      Alert.alert("Erro", "Preencha todos os campos corretamente.");
      return;
    }

    const horaLimpa = parseInt(horaPretendida.split(':')[0]);
    const ehInvalidoAM = periodo === 'AM' && (horaLimpa < 6 || horaLimpa === 12);
    const ehInvalidoPM = periodo === 'PM' && (horaLimpa > 10 && horaLimpa !== 12);

    if (ehInvalidoAM || ehInvalidoPM) {
      Alert.alert("Fora de Horário", "Atendemos das 6:00 AM às 10:00 PM.");
      return;
    }

    const horarioFinal = `${horaPretendida} ${periodo}`;
    const seuNumero = "551199999999"; 
    const mensagem = `*BARBEARIA DO JOTA*\n\n✅ *Novo Agendamento*\n👤 Cliente: *${nomeCliente}*\n📱 Contato: ${telefone}\n✂️ Serviço: *${servicoNome}*\n📅 Data: *${dataPretendida}*\n⏰ Hora: *${horarioFinal}*`;
    const urlZap = `https://wa.me/${seuNumero}?text=${encodeURIComponent(mensagem)}`;

    try {
      const path = FileSystem.documentDirectory + 'agendamentos.csv';
      const novaLinha = `${nomeCliente};${telefone};${servicoNome};${dataPretendida};${horarioFinal}\n`;
      const arquivoExiste = await FileSystem.getInfoAsync(path);
      if (!arquivoExiste.exists) {
        await FileSystem.writeAsStringAsync(path, "Nome;Telefone;Serviço;Data;Horário\n" + novaLinha);
      } else {
        const conteudo = await FileSystem.readAsStringAsync(path);
        await FileSystem.writeAsStringAsync(path, conteudo + novaLinha);
      }
      Alert.alert("Sucesso!", "Agendamento registrado!", [{ text: "Abrir WhatsApp", onPress: () => Linking.openURL(urlZap) }]);
    } catch (e) { Linking.openURL(urlZap); }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.title}>BARBEARIA DO JOTA</Text>
        <TouchableOpacity style={styles.exportBtn} onPress={async () => {
           const path = FileSystem.documentDirectory + 'agendamentos.csv';
           const info = await FileSystem.getInfoAsync(path);
           if (info.exists) await Sharing.shareAsync(path);
           else Alert.alert("Aviso", "Sem agendamentos.");
        }}>
          <Text style={styles.exportText}>📥 ÁREA DO DONO</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.inputFull} 
          placeholder="Seu Nome" 
          placeholderTextColor="#888" 
          value={nomeCliente} 
          onChangeText={setNomeCliente} 
        />
        <TextInput 
          style={styles.inputFull} 
          placeholder="Seu Celular" 
          placeholderTextColor="#888" 
          keyboardType="numeric" 
          value={telefone} 
          onChangeText={setTelefone} 
        />
        
        <View style={styles.row}>
          <TextInput 
            style={[styles.inputField, { flex: 2, marginRight: 5 }]} 
            placeholder="Data (DD/MM/AAAA)" 
            placeholderTextColor="#888"
            keyboardType="numeric"
            maxLength={10}
            value={dataPretendida}
            onChangeText={handleDataChange}
          />
          <TextInput 
            style={[styles.inputField, { flex: 1, marginHorizontal: 5 }]} 
            placeholder="00:00" 
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={horaPretendida}
            onChangeText={handleHoraChange}
          />
          <TouchableOpacity style={styles.ampmButton} onPress={() => setPeriodo(periodo === 'AM' ? 'PM' : 'AM')}>
            <Text style={styles.ampmText}>{periodo}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Escolha o Serviço:</Text>
      <FlatList
        data={SERVICOS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.serviceName}>{item.nome}</Text>
              <Text style={styles.servicePrice}>{item.preco}</Text>
            </View>
            <TouchableOpacity style={styles.miniButton} onPress={() => realizarAgendamento(item.nome)}>
              <Text style={styles.miniButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', paddingTop: 60 },
  header: { alignItems: 'center', marginBottom: 15 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFD700', letterSpacing: 2 },
  exportBtn: { marginTop: 10, backgroundColor: '#222', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, borderWidth: 1, borderColor: '#FFD700' },
  exportText: { color: '#FFD700', fontSize: 10, fontWeight: 'bold' },
  inputContainer: { paddingHorizontal: 20, marginBottom: 5 },
  inputFull: { backgroundColor: '#1E1E1E', color: '#FFFFFF', padding: 12, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#333', fontSize: 16 },
  row: { flexDirection: 'row', alignItems: 'center' },
  inputField: { backgroundColor: '#1E1E1E', color: '#FFFFFF', padding: 12, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#333', fontSize: 16 },
  ampmButton: { backgroundColor: '#FFD700', padding: 12, borderRadius: 8, marginBottom: 10, width: 55, alignItems: 'center' },
  ampmText: { color: '#121212', fontWeight: 'bold' },
  sectionTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginLeft: 20, marginBottom: 10 },
  listContainer: { paddingHorizontal: 20, paddingBottom: 50 },
  card: { backgroundColor: '#1E1E1E', padding: 18, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, borderLeftWidth: 6, borderLeftColor: '#FFD700' },
  serviceName: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  servicePrice: { color: '#FFD700', fontSize: 16, marginTop: 4 },
  miniButton: { backgroundColor: '#FFD700', width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  miniButtonText: { color: '#121212', fontSize: 30, fontWeight: 'bold' },
});