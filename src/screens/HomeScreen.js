import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { roomsData } from '../data/rooms';
import { colors } from '../theme/colors';

export default function HomeScreen({ navigation }) {
  const [adminTapCount, setAdminTapCount] = React.useState(0);

  const handleAdminTap = () => {
    const newCount = adminTapCount + 1;
    setAdminTapCount(newCount);
    if (newCount >= 5) {
      setAdminTapCount(0);
      navigation.navigate('AdminDashboard');
    }
  };

  React.useEffect(() => {
    if (adminTapCount > 0) {
      const timer = setTimeout(() => setAdminTapCount(0), 3000);
      return () => clearTimeout(timer);
    }
  }, [adminTapCount]);

  const renderRoom = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => navigation.navigate('RoomDetails', { room: item })}
    >
      <Image source={item.images[0]} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.roomName}>{item.name}</Text>
        <Text style={styles.price}>৳{item.price.toLocaleString()} <Text style={styles.perNight}>/ night</Text></Text>
        <Text style={styles.features} numberOfLines={1}>{item.features.join(' • ')}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Pressable onPress={handleAdminTap} style={styles.header}>
        <Text style={styles.headerSubtitle}>WELCOME TO</Text>
        <Text style={styles.headerTitle}>MERMAID RESORT</Text>
      </Pressable>
      
      <FlatList
        data={roomsData}
        keyExtractor={(item) => item.name}
        renderItem={renderRoom}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: 20, paddingTop: 10, alignItems: 'center', marginBottom: 10 },
  headerSubtitle: { fontSize: 12, color: colors.primary, letterSpacing: 4, fontWeight: 'bold', marginBottom: 4 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: colors.text, letterSpacing: 2 },
  listContainer: { paddingHorizontal: 15, paddingBottom: 30 },
  card: { backgroundColor: colors.surface, borderRadius: 4, marginBottom: 20, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  image: { width: '100%', height: 220, resizeMode: 'cover' },
  cardContent: { padding: 15 },
  roomName: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginBottom: 6 },
  price: { fontSize: 18, color: colors.primary, fontWeight: 'bold', marginBottom: 8, fontFamily: 'monospace' },
  perNight: { fontSize: 14, color: colors.textSubtle, fontWeight: 'normal' },
  features: { fontSize: 12, color: colors.textMuted }
});
