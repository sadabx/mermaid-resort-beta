import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, FlatList } from 'react-native';
import { Utensils, Flame, Salad, Coffee, MessageSquare } from 'lucide-react-native';

const menuData = [
  {
    category: "Fresh Seafood BBQ",
    icon: Flame,
    items: [
      { name: "Grilled Coral Fish", price: 850, desc: "Freshly caught local coral fish, marinated with island spices and perfectly grilled over open fire." },
      { name: "St. Martin Lobster BBQ", price: 2500, desc: "Premium large lobster grilled with garlic butter and a hint of local chili.", badge: "Premium" },
      { name: "Tiger Prawn Skewers", price: 1200, desc: "Four jumbo tiger prawns marinated in our signature tangy coastal sauce." },
      { name: "Fried Pomfret (Rupchanda)", price: 750, desc: "Crispy fried whole pomfret fish served with a side of spicy onion salad." },
      { name: "Squid Rings", price: 650, desc: "Tender squid rings lightly battered and fried golden, served with garlic aioli dipping sauce." },
      { name: "Mixed Seafood Platter", price: 3200, desc: "Chef's selection of lobster, prawns, fish, and squid grilled together. Perfect for two.", badge: "Chef's Pick" }
    ]
  },
  {
    category: "Local Specialties",
    icon: Utensils,
    items: [
      { name: "Island Coconut Rice", price: 350, desc: "Aromatic rice cooked with fresh coconut milk harvested right from the island." },
      { name: "Spicy Crab Curry", price: 900, desc: "Local mud crabs slow-cooked in a rich, fiery coconut gravy." },
      { name: "Hilsa Fish Curry", price: 950, desc: "Traditional Bangladeshi hilsa cooked in a mustard and turmeric gravy with green chilies." },
      { name: "Steamed Rice & Dal", price: 200, desc: "Simple and hearty — plain steamed rice served with lentil dal and seasonal vegetables." }
    ]
  },
  {
    category: "Snacks & Starters",
    icon: Salad,
    items: [
      { name: "Fish Cutlet", price: 300, desc: "Spiced fish patties, lightly pan-fried. Served with mint chutney." },
      { name: "Prawn Pakora", price: 450, desc: "Crunchy battered prawns with island herbs, served piping hot." },
      { name: "Coconut Prawn Salad", price: 520, desc: "Chilled prawn salad tossed with fresh coconut slivers, lime juice, and coriander." },
      { name: "Island Vegetable Soup", price: 220, desc: "A light, aromatic broth with seasonal local vegetables and a hint of ginger." }
    ]
  },
  {
    category: "Beverages",
    icon: Coffee,
    items: [
      { name: "Fresh Green Coconut (Daab)", price: 150 },
      { name: "Watermelon Juice", price: 200 },
      { name: "Mint Lemonade", price: 180 },
      { name: "Premium Coffee", price: 250 },
      { name: "Mango Lassi", price: 220 },
      { name: "Island Iced Tea", price: 160 }
    ]
  }
];

export default function RestaurantScreen() {
  const handleOrder = () => {
    const phoneNumber = '8801819077914';
    const message = encodeURIComponent("Hi Mermaid Resort Restaurant! I would like to place a food order from the menu.");
    Linking.openURL(`https://wa.me/${phoneNumber}?text=${message}`);
  };

  const renderMenuItem = (item) => (
    <View key={item.name} style={styles.menuItem}>
      <View style={styles.itemHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <Text style={styles.itemName}>{item.name}</Text>
          {item.badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.badge}</Text>
            </View>
          )}
        </View>
        <Text style={styles.itemPrice}>৳{item.price.toLocaleString()}</Text>
      </View>
      {item.desc ? <Text style={styles.itemDesc}>{item.desc}</Text> : null}
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
      {/* Hero Banner */}
      <View style={styles.hero}>
        <View style={styles.heroOverlay} />
        <Text style={styles.heroSubtitle}>Taste the Ocean</Text>
        <Text style={styles.heroTitle}>RESTAURANT MENU</Text>
        <Text style={styles.heroDesc}>Authentic Island Flavors & Fresh Seafood BBQ</Text>
      </View>

      {/* Menu Categories */}
      {menuData.map((cat) => {
        const CategoryIcon = cat.icon;
        return (
          <View key={cat.category} style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <CategoryIcon size={18} color="#ef4444" style={{ marginRight: 8 }} />
              <Text style={styles.categoryTitle}>{cat.category}</Text>
            </View>
            <View style={styles.menuList}>
              {cat.items.map(renderMenuItem)}
            </View>
          </View>
        );
      })}

      {/* CTA Box */}
      <View style={styles.ctaBox}>
        <Text style={styles.ctaTitle}>Ready to Order?</Text>
        <Text style={styles.ctaText}>
          Please inform our restaurant staff or contact the front desk to place your order. Room service is available for all suites.
        </Text>
        <TouchableOpacity style={styles.whatsappBtn} onPress={handleOrder}>
          <MessageSquare size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.whatsappBtnText}>ORDER VIA WHATSAPP</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  hero: { padding: 30, paddingVertical: 45, backgroundColor: '#111', borderBottomWidth: 1, borderBottomColor: '#222', alignItems: 'center', position: 'relative' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  heroSubtitle: { color: '#ef4444', fontSize: 12, letterSpacing: 4, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 6, zIndex: 1 },
  heroTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold', letterSpacing: 2, zIndex: 1 },
  heroDesc: { color: '#888', fontSize: 13, marginTop: 8, zIndex: 1, textAlign: 'center' },

  categorySection: { marginTop: 25, paddingHorizontal: 15 },
  categoryHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#222', paddingBottom: 8 },
  categoryTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
  menuList: { backgroundColor: '#111', borderRadius: 6, borderHorizontalWidth: 1, borderColor: '#222', overflow: 'hidden' },

  menuItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#1a1a1a' },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemName: { color: '#fff', fontSize: 14, fontWeight: 'bold', flexShrink: 1 },
  itemPrice: { color: '#ef4444', fontSize: 14, fontWeight: 'bold', fontFamily: 'monospace', marginLeft: 10 },
  itemDesc: { color: '#888', fontSize: 12, marginTop: 5, lineHeight: 17 },
  
  badge: { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderWidth: 1, borderColor: '#ef444440', borderRadius: 3, paddingVertical: 1, paddingHorizontal: 5, marginLeft: 8 },
  badgeText: { color: '#ef4444', fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase' },

  ctaBox: { margin: 15, marginTop: 30, padding: 20, backgroundColor: '#111', borderWidth: 1, borderColor: '#222', borderRadius: 6, alignItems: 'center' },
  ctaTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  ctaText: { color: '#888', fontSize: 12, textAlign: 'center', lineHeight: 18, marginBottom: 20 },
  whatsappBtn: { backgroundColor: '#25D366', flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 4 },
  whatsappBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 13, letterSpacing: 1 }
});
