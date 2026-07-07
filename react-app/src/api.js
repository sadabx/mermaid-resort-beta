export const API_BASE_URL = 'https://mermaid.trionine.xyz';

export const fetchBookedDates = async (room) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/booked-dates?room=${encodeURIComponent(room)}`);
    const data = await response.json();
    return data.dates || [];
  } catch (error) {
    console.error("Error fetching dates:", error);
    return [];
  }
};

export const submitBooking = async (payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error submitting booking:", error);
    return { success: false, error: error.message };
  }
};

export const fetchAllBookings = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/bookings`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error("Unauthorized or server error");
    }
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error("Error fetching all bookings:", error);
    return [];
  }
};

export const deleteBooking = async (id, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/bookings/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error("Failed to delete booking");
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error deleting booking:", error);
    return { success: false, error: error.message };
  }
};
