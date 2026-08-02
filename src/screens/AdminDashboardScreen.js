import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, TextInput, TouchableOpacity, Alert, Modal, Image, ScrollView, Linking } from 'react-native';
import { fetchAllBookings, deleteBooking, API_BASE_URL } from '../api';
import { Eye, Trash2, LogOut, RefreshCw, X, FileText, User, Calendar, CreditCard, Shield } from 'lucide-react-native';
import { colors } from '../theme/colors';

export default function AdminDashboardScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState('');

  // Details Modal State
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Username and password are required.");
      return;
    }
    setLoginLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (data.success && data.token) {
        setToken(data.token);
        loadBookings(data.token);
      } else {
        setError(data.error || "Invalid username or password.");
      }
    } catch (err) {
      setError("Network error. Please make sure the backend is running.");
      console.error(err);
    } finally {
      setLoginLoading(false);
    }
  };

  const loadBookings = (authToken = token) => {
    if (!authToken) return;
    setLoading(true);
    fetchAllBookings(authToken).then(data => {
      setBookings(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete Booking #${id}? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            setLoading(true);
            const res = await deleteBooking(id, token);
            setLoading(false);
            if (res.success) {
              Alert.alert("Success", "Booking deleted successfully.");
              setBookings(prev => prev.filter(b => b.id !== id));
            } else {
              Alert.alert("Error", res.error || "Failed to delete booking.");
            }
          }
        }
      ]
    );
  };

  const handleLogout = () => {
    setToken(null);
    setBookings([]);
    setPassword('');
  };

  const getStats = () => {
    const totalBookings = bookings.length;
    let totalRevenue = 0;
    let totalAdvance = 0;
    bookings.forEach(b => {
      totalRevenue += parseInt(b.total_amount) || 0;
      totalAdvance += parseInt(b.advance_amount) || 0;
    });
    return { totalBookings, totalRevenue, totalAdvance };
  };

  const renderPaymentBadge = (status) => {
    status = (status || 'pending').toLowerCase();
    let bgColor = colors.primarySoft;
    let textColor = colors.primary;
    let label = 'Unpaid';

    if (status === 'paid') {
      bgColor = 'rgba(16, 185, 129, 0.1)';
      textColor = colors.success;
      label = 'Paid';
    } else if (status === 'pending') {
      bgColor = 'rgba(245, 158, 11, 0.1)';
      textColor = colors.warning;
      label = 'Pending';
    } else if (status === 'cancelled') {
      bgColor = 'rgba(156, 163, 175, 0.1)';
      textColor = colors.neutral;
      label = 'Cancelled';
    }

    return (
      <View style={[styles.badge, { backgroundColor: bgColor, borderColor: textColor + '40' }]}>
        <Text style={[styles.badgeText, { color: textColor }]}>{label}</Text>
      </View>
    );
  };

  const renderBookingItem = ({ item }) => {
    const fullName = item.full_name || item.fullName;
    const totalAmount = item.total_amount || item.totalAmount;
    const advanceAmount = item.advance_amount || item.advance30;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.roomName}>{item.room}</Text>
            <Text style={styles.bookingId}>ID: #{item.id}</Text>
          </View>
          {renderPaymentBadge(item.payment_status)}
        </View>

        <View style={styles.cardContent}>
          <View style={styles.infoRow}>
            <User size={14} color={colors.textMuted} style={{ marginRight: 6 }} />
            <Text style={styles.infoText}>{fullName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Calendar size={14} color={colors.textMuted} style={{ marginRight: 6 }} />
            <Text style={styles.infoText}>{item.checkin} to {item.checkout} ({item.nights} {item.nights === 1 ? 'night' : 'nights'})</Text>
          </View>
          <View style={styles.infoRow}>
            <CreditCard size={14} color={colors.textMuted} style={{ marginRight: 6 }} />
            <Text style={styles.infoText}>Total: ৳{totalAmount.toLocaleString()} • Adv: ৳{advanceAmount.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity 
            style={[styles.actionBtn, styles.viewBtn]} 
            onPress={() => {
              setSelectedBooking(item);
              setModalVisible(true);
            }}
          >
            <Eye size={16} color={colors.text} style={{ marginRight: 6 }} />
            <Text style={styles.actionBtnText}>Details</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionBtn, styles.deleteBtn]} 
            onPress={() => handleDelete(item.id)}
          >
            <Trash2 size={16} color={colors.primary} style={{ marginRight: 6 }} />
            <Text style={[styles.actionBtnText, { color: colors.primary }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (!token) {
    return (
      <View style={styles.loginContainer}>
        <View style={styles.loginBox}>
          <View style={styles.logoWrapper}>
            <Shield size={40} color={colors.primary} />
          </View>
          <Text style={styles.loginTitle}>ADMIN PORTAL</Text>
          <Text style={styles.loginSubtitle}>Access control database</Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TextInput 
            style={styles.input} 
            placeholder="Username" 
            placeholderTextColor={colors.textPlaceholder}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <TextInput 
            style={styles.input} 
            placeholder="Password" 
            placeholderTextColor={colors.textPlaceholder}
            secureTextEntry 
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
          />

          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loginLoading}>
            {loginLoading ? <ActivityIndicator color={colors.text} /> : <Text style={styles.loginBtnText}>LOGIN</Text>}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const { totalBookings, totalRevenue, totalAdvance } = getStats();

  return (
    <View style={styles.container}>
      {/* Header Controls */}
      <View style={styles.headerControls}>
        <View>
          <Text style={styles.adminTitle}>Reservations Database</Text>
          <Text style={styles.adminSubtitle}>Live sync with Neon PG</Text>
        </View>
        <View style={styles.headerBtnGroup}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => loadBookings()}>
            <RefreshCw size={18} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.headerBtn, { marginLeft: 10 }]} onPress={handleLogout}>
            <LogOut size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Board */}
      <View style={styles.statsBoard}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>BOOKINGS</Text>
          <Text style={styles.statVal}>{totalBookings}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>REVENUE</Text>
          <Text style={[styles.statVal, { color: colors.success }]}>৳{totalRevenue.toLocaleString()}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>ADVANCE</Text>
          <Text style={[styles.statVal, { color: colors.primary }]}>৳{totalAdvance.toLocaleString()}</Text>
        </View>
      </View>

      {loading && bookings.length === 0 ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderBookingItem}
          contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 30 }}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={() => loadBookings()} tintColor={colors.primary} />}
          ListEmptyComponent={<Text style={styles.emptyText}>No bookings found.</Text>}
        />
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>{selectedBooking.room}</Text>
                  <Text style={styles.modalSub}>Booking #{selectedBooking.id}</Text>
                </View>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                  <X size={20} color={colors.text} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody} contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Guest Details */}
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Guest Information</Text>
                  <View style={styles.gridRow}>
                    <Text style={styles.gridLabel}>Full Name:</Text>
                    <Text style={styles.gridValue}>{selectedBooking.full_name || selectedBooking.fullName}</Text>
                  </View>
                  <View style={styles.gridRow}>
                    <Text style={styles.gridLabel}>Phone:</Text>
                    <Text style={[styles.gridValue, { color: colors.primary }]} onPress={() => Linking.openURL(`tel:${selectedBooking.phone}`)}>
                      {selectedBooking.phone}
                    </Text>
                  </View>
                  <View style={styles.gridRow}>
                    <Text style={styles.gridLabel}>Email:</Text>
                    <Text style={styles.gridValue}>{selectedBooking.email}</Text>
                  </View>
                  <View style={styles.gridRow}>
                    <Text style={styles.gridLabel}>IP Address:</Text>
                    <Text style={[styles.gridValue, { color: colors.textPlaceholder }]}>{selectedBooking.ip_address || "N/A"}</Text>
                  </View>
                </View>

                {/* Booking Info */}
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Reservation Info</Text>
                  <View style={styles.gridRow}>
                    <Text style={styles.gridLabel}>Check-in:</Text>
                    <Text style={styles.gridValue}>{selectedBooking.checkin}</Text>
                  </View>
                  <View style={styles.gridRow}>
                    <Text style={styles.gridLabel}>Check-out:</Text>
                    <Text style={styles.gridValue}>{selectedBooking.checkout}</Text>
                  </View>
                  <View style={styles.gridRow}>
                    <Text style={styles.gridLabel}>Nights / Guests:</Text>
                    <Text style={styles.gridValue}>{selectedBooking.nights} nights, {selectedBooking.guests} guests</Text>
                  </View>
                  <View style={styles.gridRow}>
                    <Text style={styles.gridLabel}>Created On:</Text>
                    <Text style={[styles.gridValue, { color: colors.textPlaceholder }]}>{selectedBooking.created_at || "N/A"}</Text>
                  </View>
                </View>

                {/* Financial Summary */}
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Financials</Text>
                  <View style={styles.gridRow}>
                    <Text style={styles.gridLabel}>Total Amount:</Text>
                    <Text style={styles.gridValue}>৳{(selectedBooking.total_amount || selectedBooking.totalAmount).toLocaleString()}</Text>
                  </View>
                  <View style={styles.gridRow}>
                    <Text style={styles.gridLabel}>Advance Due (30%):</Text>
                    <Text style={styles.gridValue}>৳{(selectedBooking.advance_amount || selectedBooking.advance30).toLocaleString()}</Text>
                  </View>
                  <View style={styles.gridRow}>
                    <Text style={styles.gridLabel}>Payment Status:</Text>
                    <Text style={styles.gridValue}>{(selectedBooking.payment_status || 'Pending').toUpperCase()}</Text>
                  </View>
                  {(selectedBooking.bkash_trx_id || selectedBooking.bkashTrxId) ? (
                    <View style={styles.gridRow}>
                      <Text style={styles.gridLabel}>bKash TrxID:</Text>
                      <Text style={[styles.gridValue, { fontFamily: 'monospace', color: colors.success }]}>
                        {selectedBooking.bkash_trx_id || selectedBooking.bkashTrxId}
                      </Text>
                    </View>
                  ) : null}
                </View>

                {/* Documents / Uploads */}
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Attachments</Text>

                  {/* ID Card */}
                  <View style={styles.attachmentBox}>
                    <Text style={styles.attachmentTitle}>NID / Passport Doc</Text>
                    {selectedBooking.id_photo_name ? (
                      selectedBooking.id_photo_mime_type === 'application/pdf' || selectedBooking.id_photo_name.toLowerCase().endsWith('.pdf') ? (
                        <TouchableOpacity 
                          style={styles.pdfBtn}
                          onPress={() => Linking.openURL(`${API_BASE_URL}/api/admin/bookings/attachments/${selectedBooking.id}/idPhoto?token=${token}`)}
                        >
                          <FileText size={24} color={colors.primary} />
                          <Text style={styles.pdfBtnText}>Open ID PDF Document</Text>
                        </TouchableOpacity>
                      ) : (
                        <Image 
                          source={{ 
                            uri: `${API_BASE_URL}/api/admin/bookings/attachments/${selectedBooking.id}/idPhoto?token=${token}`,
                            headers: { 'Authorization': `Bearer ${token}` }
                          }} 
                          style={styles.attachmentImg}
                          resizeMode="contain"
                        />
                      )
                    ) : (
                      <Text style={styles.noFile}>No NID copy uploaded.</Text>
                    )}
                  </View>

                  {/* Customer Selfie */}
                  <View style={styles.attachmentBox}>
                    <Text style={styles.attachmentTitle}>Customer Photo / Selfie</Text>
                    {selectedBooking.customer_photo_name ? (
                      <Image 
                        source={{ 
                          uri: `${API_BASE_URL}/api/admin/bookings/attachments/${selectedBooking.id}/customerPhoto?token=${token}`,
                          headers: { 'Authorization': `Bearer ${token}` }
                        }} 
                        style={styles.attachmentImg}
                        resizeMode="contain"
                      />
                    ) : (
                      <Text style={styles.noFile}>No photo uploaded.</Text>
                    )}
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loginContainer: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loginBox: { width: '100%', maxWidth: 360, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 25 },
  logoWrapper: { alignSelf: 'center', marginBottom: 15, padding: 12, backgroundColor: colors.primarySoft, borderRadius: 50 },
  loginTitle: { color: colors.text, fontSize: 20, fontWeight: 'bold', textAlign: 'center', letterSpacing: 2 },
  loginSubtitle: { color: colors.textSubtle, fontSize: 12, textAlign: 'center', marginBottom: 25 },
  errorText: { color: colors.primary, backgroundColor: colors.primarySoft, borderWidth: 1, borderColor: colors.primaryBorderSubtle, borderRadius: 4, padding: 10, fontSize: 13, marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: colors.surfaceDeep, borderWidth: 1, borderColor: colors.border, borderRadius: 4, color: colors.text, padding: 12, fontSize: 16, marginBottom: 15 },
  loginBtn: { backgroundColor: colors.primary, padding: 14, borderRadius: 4, alignItems: 'center', marginTop: 10 },
  loginBtnText: { color: colors.text, fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },

  // Dashboard Styles
  headerControls: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: colors.border },
  adminTitle: { color: colors.text, fontSize: 18, fontWeight: 'bold' },
  adminSubtitle: { color: colors.textSubtle, fontSize: 12 },
  headerBtnGroup: { flexDirection: 'row' },
  headerBtn: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, padding: 10, borderRadius: 4 },
  
  statsBoard: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: colors.surface, margin: 15, borderRadius: 6, borderWidth: 1, borderColor: colors.border },
  statBox: { flex: 1, alignItems: 'center' },
  statLabel: { color: colors.textSubtle, fontSize: 10, fontWeight: 'bold', marginBottom: 4 },
  statVal: { color: colors.text, fontSize: 16, fontWeight: 'bold', fontFamily: 'monospace' },

  card: { backgroundColor: colors.surface, borderRadius: 6, borderWidth: 1, borderColor: colors.border, padding: 15, marginHorizontal: 15, marginBottom: 15 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 10, marginBottom: 10 },
  roomName: { color: colors.text, fontSize: 16, fontWeight: 'bold' },
  bookingId: { color: colors.textSubtle, fontSize: 11, fontFamily: 'monospace' },
  badge: { borderWidth: 1, borderRadius: 4, paddingVertical: 2, paddingHorizontal: 6, alignSelf: 'flex-start' },
  badgeText: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  
  cardContent: { marginBottom: 15 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  infoText: { color: colors.textStrong, fontSize: 13 },
  
  cardActions: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 10, justifyContent: 'flex-end' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 4 },
  viewBtn: { backgroundColor: colors.border, marginRight: 10 },
  deleteBtn: { backgroundColor: 'rgba(239, 68, 68, 0.05)', borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.2)' },
  actionBtnText: { color: colors.text, fontSize: 12, fontWeight: 'bold' },
  
  emptyText: { color: colors.textPlaceholder, textAlign: 'center', marginTop: 50, fontSize: 16 },

  // Details Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.85)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.background, borderTopLeftRadius: 15, borderTopRightRadius: 15, height: '90%', borderTopWidth: 1, borderTopColor: colors.border },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: colors.border },
  modalTitle: { color: colors.text, fontSize: 18, fontWeight: 'bold' },
  modalSub: { color: colors.textSubtle, fontSize: 12 },
  closeBtn: { padding: 8, backgroundColor: colors.surface, borderRadius: 20 },
  
  modalBody: { padding: 20 },
  detailSection: { marginBottom: 25, borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 15 },
  sectionTitle: { color: colors.primary, fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  gridRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  gridLabel: { color: colors.textSubtle, fontSize: 13 },
  gridValue: { color: colors.text, fontSize: 13, fontWeight: '500', maxWidth: '60%', textAlign: 'right' },
  
  attachmentBox: { backgroundColor: colors.surface, borderRadius: 6, borderWidth: 1, borderColor: colors.border, padding: 12, marginBottom: 15 },
  attachmentTitle: { color: colors.textSecondary, fontSize: 12, fontWeight: 'bold', marginBottom: 8 },
  attachmentImg: { width: '100%', height: 180, borderRadius: 4, backgroundColor: colors.surfaceDeep },
  pdfBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.border, padding: 15, borderRadius: 4, borderStyle: 'dashed', borderWidth: 1, borderColor: colors.textDisabled },
  pdfBtnText: { color: colors.text, fontWeight: 'bold', marginLeft: 10, fontSize: 14 },
  noFile: { color: colors.textDisabled, fontSize: 12, fontStyle: 'italic' }
});
