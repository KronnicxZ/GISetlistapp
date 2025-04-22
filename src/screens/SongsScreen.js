import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Card, CardTitle, CardSubtitle } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { COLORS, SPACING } from '../constants/theme';
import { mockSongs } from '../mock/data';

const SongsScreen = ({ navigation }) => {
  const { isDarkMode } = useTheme();
  const [songs, setSongs] = useState(mockSongs);

  const renderSongItem = ({ item }) => (
    <Card
      isDarkMode={isDarkMode}
      variant="elevated"
      style={styles.songCard}
      onPress={() => navigation.navigate('SongDetail', { song: item })}
    >
      <CardTitle isDarkMode={isDarkMode}>{item.title}</CardTitle>
      <CardSubtitle isDarkMode={isDarkMode}>
        {item.artist} • {item.bpm} BPM • {item.key}
      </CardSubtitle>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? COLORS.background.dark : COLORS.background.light }]}>
      <View style={styles.header}>
        <Button
          title="Nueva Canción"
          onPress={() => navigation.navigate('SongDetail', { song: null })}
          variant="primary"
          size="medium"
        />
      </View>
      
      <FlatList
        data={songs}
        renderItem={renderSongItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  list: {
    padding: SPACING.md,
  },
  songCard: {
    marginBottom: SPACING.md,
  },
});

export default SongsScreen; 