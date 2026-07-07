import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { Check } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function RoomDetailsScreen({ route, navigation }) {
  const { room } = route.params;

  const renderImage = ({ item }) => (
    <Image source={item} style={styles.carouselImage} />
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <FlatList
          data={room.images}
          renderItem={renderImage}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.carousel}
        />
        
        <View style={styles.content}>
          <Text style={styles.title}>{room.name}</Text>
          <Text style={styles.price}>৳{room.price.toLocaleString()} <Text style={styles.perNight}>/ night</Text></Text>
          
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{room.description}</Text>

          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featuresList}>
            {room.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Check color="#ef4444" size={16} style={styles.featureIcon} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.bookButton}
          onPress={() => navigation.navigate('BookingForm', { room })}
        >
          <Text style={styles.bookButtonText}>BOOK THIS ROOM</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  carousel: { height: 280 },
  carouselImage: { width: width, height: 280, resizeMode: 'cover' },
  content: { padding: 20, paddingBottom: 100 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  price: { fontSize: 20, color: '#ef4444', fontWeight: 'bold', fontFamily: 'monospace', marginBottom: 20 },
  perNight: { fontSize: 14, color: '#666', fontWeight: 'normal' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff', textTransform: 'uppercase', tracking: 1, marginTop: 20, marginBottom: 10 },
  description: { fontSize: 14, color: '#aaa', lineHeight: 22 },
  featuresList: { marginTop: 5 },
  featureItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  featureIcon: { marginRight: 10 },
  featureText: { color: '#ccc', fontSize: 14 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: '#0a0a0a', borderTopWidth: 1, borderTopColor: '#222' },
  bookButton: { backgroundColor: '#ef4444', padding: 16, borderRadius: 4, alignItems: 'center' },
  bookButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 }
});
