import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, SafeAreaView, Pressable } from 'react-native';
import { roomsData } from '../data/rooms';

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
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  header: { padding: 20, paddingTop: 10, alignItems: 'center', marginBottom: 10 },
  headerSubtitle: { fontSize: 12, color: '#ef4444', letterSpacing: 4, fontWeight: 'bold', marginBottom: 4 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', letterSpacing: 2 },
  listContainer: { paddingHorizontal: 15, paddingBottom: 30 },
  card: { backgroundColor: '#111', borderRadius: 4, marginBottom: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#222' },
  image: { width: '100%', height: 220, resizeMode: 'cover' },
  cardContent: { padding: 15 },
  roomName: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 6 },
  price: { fontSize: 18, color: '#ef4444', fontWeight: 'bold', marginBottom: 8, fontFamily: 'monospace' },
  perNight: { fontSize: 14, color: '#666', fontWeight: 'normal' },
  features: { fontSize: 12, color: '#888' }
});
