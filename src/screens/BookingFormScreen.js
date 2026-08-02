import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Linking } from 'react-native';
import { Calendar } from 'react-native-calendars';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { fetchBookedDates, submitBooking } from '../api';
import { Upload } from 'lucide-react-native';
import { colors } from '../theme/colors';

export default function BookingFormScreen({ route, navigation }) {
  const { room } = route.params;
  const [loadingDates, setLoadingDates] = useState(true);
  const [bookedDates, setBookedDates] = useState([]);
  
  const [checkin, setCheckin] = useState(null);
  const [checkout, setCheckout] = useState(null);
  const [guests, setGuests] = useState('1');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  
  const [idPhotoName, setIdPhotoName] = useState('');
  const [idPhotoBase64, setIdPhotoBase64] = useState('');
  const [idPhotoMimeType, setIdPhotoMimeType] = useState('');

  const [customerPhotoName, setCustomerPhotoName] = useState('');
  const [customerPhotoBase64, setCustomerPhotoBase64] = useState('');
  const [customerPhotoMimeType, setCustomerPhotoMimeType] = useState('');
  
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBookedDates(room.name).then(dates => {
      setBookedDates(dates);
      setLoadingDates(false);
    });
  }, [room.name]);

  const handleDayPress = (day) => {
    if (!checkin || (checkin && checkout)) {
      setCheckin(day.dateString);
      setCheckout(null);
    } else if (checkin && !checkout) {
      if (day.dateString > checkin) {
        setCheckout(day.dateString);
      } else {
        setCheckin(day.dateString);
      }
    }
  };

  const getMarkedDates = () => {
    let marked = {};
    bookedDates.forEach(date => {
      marked[date] = { disabled: true, disableTouchEvent: true, color: colors.border, textColor: colors.textPlaceholder };
    });
    
    if (checkin) marked[checkin] = { startingDay: true, color: colors.primary, textColor: 'white', marked: true };
    if (checkout) marked[checkout] = { endingDay: true, color: colors.primary, textColor: 'white', marked: true };
    
    if (checkin && checkout) {
      let currentDate = new Date(checkin);
      currentDate.setDate(currentDate.getDate() + 1);
      let end = new Date(checkout);
      
      while(currentDate < end) {
        let dateStr = currentDate.toISOString().split('T')[0];
        marked[dateStr] = { color: 'rgba(239, 68, 68, 0.2)', textColor: 'white' };
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    return marked;
  };

  const pickDocument = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setIdPhotoName(asset.name);
        setIdPhotoMimeType(asset.mimeType || 'application/octet-stream');
        
        const base64 = await FileSystem.readAsStringAsync(asset.uri, { encoding: FileSystem.EncodingType.Base64 });
        setIdPhotoBase64(base64);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const pickCustomerPhoto = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({
        type: ['image/*'],
        copyToCacheDirectory: true
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setCustomerPhotoName(asset.name);
        setCustomerPhotoMimeType(asset.mimeType || 'image/jpeg');
        
        const base64 = await FileSystem.readAsStringAsync(asset.uri, { encoding: FileSystem.EncodingType.Base64 });
        setCustomerPhotoBase64(base64);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async () => {
    if (!checkin || !checkout) return Alert.alert("Error", "Please select check-in and check-out dates.");
    if (!fullName || !phone || !email) return Alert.alert("Error", "Name, phone, and email are required.");
    if (!idPhotoBase64) return Alert.alert("Error", "Please upload your ID Photo/PDF.");
    if (!customerPhotoBase64) return Alert.alert("Error", "Please upload your Customer Photo/Selfie.");

    setSubmitting(true);
    
    const nights = Math.ceil((new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24));
    const totalAmount = nights * room.price;
    const advance30 = Math.round(totalAmount * 0.3);

    const payload = {
      room: room.name,
      pricePerNight: room.price,
      checkin: checkin,
      checkout: checkout,
      nights: nights,
      guests: parseInt(guests) || 1,
      totalAmount: totalAmount,
      advance30: advance30,
      fullName: fullName,
      phone: phone,
      email: email,
      idCard: 'N/A',
      idPhotoBase64: idPhotoBase64,
      idPhotoMimeType: idPhotoMimeType,
      idPhotoName: idPhotoName,
      customerPhotoBase64: customerPhotoBase64,
      customerPhotoMimeType: customerPhotoMimeType,
      customerPhotoName: customerPhotoName,
      ipAddress: 'App Booking'
    };

    const result = await submitBooking(payload);
    setSubmitting(false);

    if (result && result.success) {
      Alert.alert("Success", "Booking submitted! You will now be redirected to bKash to complete your 30% advance payment.", [
        { text: "Pay Now", onPress: () => {
          const checkoutUrl = `https://mermaid.trionine.xyz/api/bkash/initiate?bookingId=${result.bookingId}`;
          Linking.openURL(checkoutUrl);
          navigation.navigate('Home');
        }}
      ]);
    } else {
      Alert.alert("Error", result?.error || "Failed to submit booking.");
    }
  };

  let totalNights = 0;
  if (checkin && checkout) {
    totalNights = Math.ceil((new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24));
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, paddingBottom: 50 }}>
      <Text style={styles.roomName}>{room.name}</Text>
      <Text style={styles.price}>৳{room.price.toLocaleString()} / night</Text>

      <Text style={styles.label}>Select Dates</Text>
      {loadingDates ? (
        <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 20 }} />
      ) : (
        <Calendar
          onDayPress={handleDayPress}
          markedDates={getMarkedDates()}
          markingType={'period'}
          minDate={new Date().toISOString().split('T')[0]}
          theme={{
            calendarBackground: colors.surface,
            textSectionTitleColor: colors.textSecondary,
            dayTextColor: colors.text,
            todayTextColor: colors.primary,
            selectedDayTextColor: colors.text,
            monthTextColor: colors.text,
            indicatorColor: colors.primary,
            arrowColor: colors.primary,
          }}
          style={styles.calendar}
        />
      )}

      {checkin && checkout && (
        <View style={styles.summaryBox}>
          <Text style={styles.summaryText}>{totalNights} Nights x ৳{room.price.toLocaleString()}</Text>
          <Text style={styles.summaryTotal}>Total: ৳{(totalNights * room.price).toLocaleString()}</Text>
        </View>
      )}

      <Text style={styles.label}>Full Name</Text>
      <TextInput style={styles.input} placeholderTextColor={colors.textSubtle} placeholder="John Doe" value={fullName} onChangeText={setFullName} />

      <Text style={styles.label}>Phone Number</Text>
      <TextInput style={styles.input} placeholderTextColor={colors.textSubtle} placeholder="+880 1..." keyboardType="phone-pad" value={phone} onChangeText={setPhone} />

      <Text style={styles.label}>Email Address</Text>
      <TextInput style={styles.input} placeholderTextColor={colors.textSubtle} placeholder="john@example.com" keyboardType="email-address" value={email} onChangeText={setEmail} />

      <Text style={styles.label}>Number of Guests</Text>
      <TextInput style={styles.input} placeholderTextColor={colors.textSubtle} placeholder="2" keyboardType="numeric" value={guests} onChangeText={setGuests} />

      <Text style={styles.label}>Upload ID / Passport</Text>
      <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
        <Upload color={colors.textSecondary} size={20} style={{ marginRight: 10 }} />
        <Text style={styles.uploadText}>{idPhotoName || "Select Photo or PDF"}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Upload Customer Photo (Selfie)</Text>
      <TouchableOpacity style={styles.uploadButton} onPress={pickCustomerPhoto}>
        <Upload color={colors.textSecondary} size={20} style={{ marginRight: 10 }} />
        <Text style={styles.uploadText}>{customerPhotoName || "Select Selfie/Photo"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={submitting}>
        {submitting ? <ActivityIndicator color={colors.text} /> : <Text style={styles.submitButtonText}>SUBMIT & PAY WITH bKASH</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  roomName: { fontSize: 22, fontWeight: 'bold', color: colors.text },
  price: { fontSize: 16, color: colors.primary, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 14, fontWeight: 'bold', color: colors.textMuted, textTransform: 'uppercase', marginBottom: 8, marginTop: 15 },
  calendar: { borderRadius: 8, overflow: 'hidden', marginBottom: 10 },
  input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 4, color: colors.text, padding: 12, fontSize: 16 },
  uploadButton: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 4, padding: 12, flexDirection: 'row', alignItems: 'center' },
  uploadText: { color: colors.textSecondary, fontSize: 16, flex: 1 },
  summaryBox: { backgroundColor: colors.surfaceAlt, padding: 15, borderRadius: 8, marginTop: 10, borderLeftWidth: 4, borderLeftColor: colors.primary },
  summaryText: { color: colors.textSecondary, fontSize: 14 },
  summaryTotal: { color: colors.text, fontSize: 18, fontWeight: 'bold', marginTop: 5 },
  submitButton: { backgroundColor: colors.primary, padding: 16, borderRadius: 4, alignItems: 'center', marginTop: 30 },
  submitButtonText: { color: colors.text, fontWeight: 'bold', fontSize: 16, letterSpacing: 1 }
});
