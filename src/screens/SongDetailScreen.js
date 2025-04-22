import React, { useState, useEffect } from 'react';
import { View, ScrollView, TextInput, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Card, CardTitle } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';

const SongDetailScreen = ({ route, navigation }) => {
  const { isDarkMode } = useTheme();
  const { song: initialSong } = route.params;
  const [song, setSong] = useState(initialSong || {
    title: '',
    artist: '',
    bpm: '',
    key: '',
    lyrics: '',
    notes: '',
  });

  const handleSave = () => {
    if (!song.title.trim()) {
      Alert.alert('Error', 'El título es requerido');
      return;
    }

    // Aquí iría la lógica para guardar la canción
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Canción',
      '¿Estás seguro de que deseas eliminar esta canción?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            // Aquí iría la lógica para eliminar la canción
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: isDarkMode ? COLORS.background.dark : COLORS.background.light }]}
      contentContainerStyle={styles.content}
    >
      <Card isDarkMode={isDarkMode} style={styles.card}>
        <TextInput
          style={[
            styles.input,
            { color: isDarkMode ? COLORS.text.dark : COLORS.text.light },
          ]}
          placeholder="Título"
          placeholderTextColor={isDarkMode ? COLORS.gray.dark : COLORS.gray.light}
          value={song.title}
          onChangeText={(text) => setSong({ ...song, title: text })}
        />
        
        <TextInput
          style={[
            styles.input,
            { color: isDarkMode ? COLORS.text.dark : COLORS.text.light },
          ]}
          placeholder="Artista"
          placeholderTextColor={isDarkMode ? COLORS.gray.dark : COLORS.gray.light}
          value={song.artist}
          onChangeText={(text) => setSong({ ...song, artist: text })}
        />
        
        <View style={styles.row}>
          <TextInput
            style={[
              styles.input,
              styles.halfInput,
              { color: isDarkMode ? COLORS.text.dark : COLORS.text.light },
            ]}
            placeholder="BPM"
            placeholderTextColor={isDarkMode ? COLORS.gray.dark : COLORS.gray.light}
            value={song.bpm}
            onChangeText={(text) => setSong({ ...song, bpm: text })}
            keyboardType="numeric"
          />
          
          <TextInput
            style={[
              styles.input,
              styles.halfInput,
              { color: isDarkMode ? COLORS.text.dark : COLORS.text.light },
            ]}
            placeholder="Tonalidad"
            placeholderTextColor={isDarkMode ? COLORS.gray.dark : COLORS.gray.light}
            value={song.key}
            onChangeText={(text) => setSong({ ...song, key: text })}
          />
        </View>
        
        <TextInput
          style={[
            styles.input,
            styles.textArea,
            { color: isDarkMode ? COLORS.text.dark : COLORS.text.light },
          ]}
          placeholder="Letra"
          placeholderTextColor={isDarkMode ? COLORS.gray.dark : COLORS.gray.light}
          value={song.lyrics}
          onChangeText={(text) => setSong({ ...song, lyrics: text })}
          multiline
          numberOfLines={6}
        />
        
        <TextInput
          style={[
            styles.input,
            styles.textArea,
            { color: isDarkMode ? COLORS.text.dark : COLORS.text.light },
          ]}
          placeholder="Notas"
          placeholderTextColor={isDarkMode ? COLORS.gray.dark : COLORS.gray.light}
          value={song.notes}
          onChangeText={(text) => setSong({ ...song, notes: text })}
          multiline
          numberOfLines={4}
        />
      </Card>
      
      <View style={styles.buttons}>
        <Button
          title="Guardar"
          onPress={handleSave}
          variant="primary"
          size="large"
          style={styles.button}
        />
        
        {initialSong && (
          <Button
            title="Eliminar"
            onPress={handleDelete}
            variant="secondary"
            size="large"
            style={styles.button}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: SPACING.md,
  },
  card: {
    marginBottom: SPACING.lg,
  },
  input: {
    fontSize: FONT_SIZES.md,
    marginBottom: SPACING.md,
    padding: SPACING.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray.light,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  buttons: {
    gap: SPACING.md,
  },
  button: {
    width: '100%',
  },
});

export default SongDetailScreen; 