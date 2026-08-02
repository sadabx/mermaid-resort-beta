class Room {
  final String name;
  final int price;
  final String description;
  final List<String> features;
  final List<String> images;

  const Room({
    required this.name,
    required this.price,
    required this.description,
    required this.features,
    required this.images,
  });
}

const List<Room> roomsData = [
  Room(
    name: "Premium Double Bed",
    price: 8000,
    description: "Our finest family suite, offering premium comfort, high-end amenities, and ample space for groups.",
    features: ["Seaview", "2 Large Beds", "AC", "Max: 4 Guests"],
    images: [
      "assets/photo_2026_02_28_19_49_48.jpg",
      "assets/photo_2026_02_28_19_48_17.jpg",
      "assets/photo_2026_02_28_19_44_12.jpg",
      "assets/photo_2026_02_28_19_44_29.jpg"
    ],
  ),
  Room(
    name: "Premium Couple",
    price: 7500,
    description: "An upgraded, luxurious retreat for couples featuring high-end furnishings and maximum comfort.",
    features: ["Seaview", "1 King Bed", "AC", "Max: 2 Guests"],
    images: [
      "assets/photo-2026-02-28-19-51-03.jpg"
    ],
  ),
  Room(
    name: "Premium Seaview Couple",
    price: 6000,
    description: "Enjoy luxury and romance with uninterrupted, breathtaking views of the ocean from your premium suite.",
    features: ["Seaview", "1 King Bed", "AC", "Max: 2 Guests"],
    images: [
      "assets/photo_2026_02_28_19_43_26.jpg",
      "assets/photo_2026_02_28_19_44_12.jpg",
      "assets/photo_2026_02_28_19_44_29.jpg"
    ],
  ),
  Room(
    name: "1st Floor Seaview Double",
    price: 4500,
    description: "The best of both worlds for families—stunning elevated ocean views combined with spacious bedding for four.",
    features: ["Seaview", "2 Large Beds", "Max: 4 Guests"],
    images: [
      "assets/photo_2026_02_28_19_54_40.jpg",
      "assets/photo_2026_02_28_19_54_33.jpg",
      "assets/photo_2026_02_28_19_55_06.jpg"
    ],
  ),
  Room(
    name: "1st Floor Seaview Couple",
    price: 4000,
    description: "Wake up to the sound of the waves. A beautiful first-floor room offering lovely sea views for couples.",
    features: ["Seaview", "1 King Bed", "Max: 2 Guests"],
    images: [
      "assets/photo_2026_02_28_19_53_50.jpg",
      "assets/photo_2026_02_28_19_53_44.jpg",
      "assets/photo_2026_02_28_19_53_56.jpg"
    ],
  ),
  Room(
    name: "1st Floor Double",
    price: 4000,
    description: "Comfortable first-floor accommodation with extra bedding space, perfect for friend groups or families.",
    features: ["Non-Seaview", "2 Large Beds", "Max: 4 Guests"],
    images: [
      "assets/photo_2026_02_28_19_53_03.jpg"
    ],
  ),
  Room(
    name: "1st Floor Couple",
    price: 3500,
    description: "A cozy and budget-friendly room on the first floor, ideal for couples or small families wanting a peaceful stay.",
    features: ["Non-Seaview", "1 King Bed", "Max: 3 Guests"],
    images: [
      "assets/photo_2026_02_28_19_51_49.jpg",
      "assets/photo_2026_02_28_19_51_55.jpg"
    ],
  ),
  Room(
    name: "Ground Floor Double",
    price: 3500,
    description: "Convenient and spacious ground-floor accommodation, offering easy access to the beach and resort amenities.",
    features: ["Non-Seaview", "2 Large Beds", "Max: 4 Guests"],
    images: [
      "assets/photo_2026_02_28_19_45_46.jpg",
      "assets/photo_2026_02_28_19_46_10.jpg",
      "assets/photo_2026_02_28_19_46_25.jpg",
      "assets/photo_2026_02_28_19_46_52.jpg",
      "assets/photo-2026-02-28-19-47-05.jpg"
    ],
  ),
];
