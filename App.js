import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, StatusBar, TextInput, Alert, Linking } from 'react-native';
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

  const realizarAgendamento = async (servicoNome) => {
    if (!nomeCliente || !telefone) {
      Alert.alert("Erro", "Por favor, preencha Nome e Telefone!");
      return;
    }

    const data = new Date().toLocaleDateString();
    const hora = new Date().toLocaleTimeString();
    
    // CONFIGURAÇÃO DO WHATSAPP (AQUI ESTÁ A MUDANÇA)
    const seuNumero = "5511999999999"; // <-- COLOQUE SEU NÚMERO AQUI
    const mensagem = `Olá! Me chamo *${nomeCliente}*.\nQuero agendar um serviço na *Barbearia do Jota*.\nServiço: *${servicoNome}*\nData: ${data} às ${hora}`;
    const urlZap = `https://wa.me/${seuNumero}?text=${encodeURIComponent(mensagem)}`;

    const path = FileSystem.documentDirectory + 'agendamentos.csv';
    const novaLinha = `${nomeCliente};${telefone};${servicoNome};${data};${hora}\n`;

    try {
      const arquivoExiste = await FileSystem.getInfoAsync(path);
      if (!arquivoExiste.exists) {
        const cabecalho = "Nome;Telefone;Serviço;Data;Horário\n";
        await FileSystem.writeAsStringAsync(path, cabecalho + novaLinha);
      } else {
        const conteudoAntigo = await FileSystem.readAsStringAsync(path);
        await FileSystem.writeAsStringAsync(path, conteudoAntigo + novaLinha);
      }

      Alert.alert("Sucesso", "Registrado! Abrindo WhatsApp...");
      Linking.openURL(urlZap);
    } catch (error) {
      // Se a planilha falhar, o WhatsApp abre do mesmo jeito para não perder a venda!
      Linking.openURL(urlZap);
    }
  };

  const exportarPlanilha = async () => {
    const path = FileSystem.documentDirectory + 'agendamentos.csv';
    const info = await FileSystem.getInfoAsync(path);
    if (info.exists) {
      await Sharing.shareAsync(path);
    } else {
      Alert.alert("Aviso", "Nenhum agendamento registrado ainda.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.title}>BARBEARIA DO JOTA</Text>
        <TouchableOpacity style={styles.exportBtn} onPress={exportarPlanilha}>
          <Text style={styles.exportText}>📥 BAIXAR PLANILHA (DONO)</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input} 
          placeholder="Seu Nome" 
          placeholderTextColor="#888"
          value={nomeCliente}
          onChangeText={setNomeCliente}
        />
        <TextInput 
          style={styles.input} 
          placeholder="Seu Celular" 
          placeholderTextColor="#888"
          keyboardType="phone-pad"
          value={telefone}
          onChangeText={setTelefone}
        />
      </View>

      <FlatList
        data={SERVICOS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.serviceName}>{item.nome}</Text>
              <Text style={styles.servicePrice}>{item.preco}</Text>
            </View>
            <TouchableOpacity 
              style={styles.miniButton} 
              onPress={() => realizarAgendamento(item.nome)}
            >
              <Text style={styles.miniButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', paddingTop: 50 },
  header: { alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#FFD700', letterSpacing: 1 },
  exportBtn: { marginTop: 10, backgroundColor: '#333', padding: 10, borderRadius: 5 },
  exportText: { color: '#FFD700', fontSize: 12, fontWeight: 'bold' },
  inputContainer: { padding: 20 },
  input: { 
    backgroundColor: '#1E1E1E', 
    color: '#FFF', 
    padding: 15, 
    borderRadius: 8, 
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333'
  },
  listContainer: { paddingHorizontal: 20, paddingBottom: 50 },
  card: {
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#FFD700',
  },
  serviceName: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  servicePrice: { color: '#FFD700', fontSize: 16, marginTop: 4 },
  miniButton: { backgroundColor: '#FFD700', width: 45, height: 45, borderRadius: 22.5, alignItems: 'center', justifyContent: 'center' },
  miniButtonText: { color: '#121212', fontSize: 28, fontWeight: 'bold' },
});