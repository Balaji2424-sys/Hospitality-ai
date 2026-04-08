import User from "../models/User.js";

const staticDoctors = [
  {
    name: "Dr. Meera Srinivasan",
    email: "meera.cardiology@ruralcare.local",
    password: "Doctor@123",
    role: "doctor",
    verifiedDoctor: true,
    specialization: "Cardiology",
    licenseNumber: "RC-CARD-001",
    preferredLanguage: "en",
    location: { lat: 12.9716, lng: 77.5946, area: "City Heart Block" },
    availability: [
      { day: "Monday", slots: ["09:00", "11:00", "16:00"] },
      { day: "Wednesday", slots: ["10:00", "14:00"] }
    ]
  },
  {
    name: "Dr. Arjun Patel",
    email: "arjun.general@ruralcare.local",
    password: "Doctor@123",
    role: "doctor",
    verifiedDoctor: true,
    specialization: "General Medicine",
    licenseNumber: "RC-GEN-002",
    preferredLanguage: "hi",
    location: { lat: 12.9816, lng: 77.5846, area: "Community Health Centre" },
    availability: [
      { day: "Tuesday", slots: ["09:30", "13:00", "17:00"] },
      { day: "Thursday", slots: ["11:00", "15:30"] }
    ]
  },
  {
    name: "Dr. Kavya Raman",
    email: "kavya.pulmo@ruralcare.local",
    password: "Doctor@123",
    role: "doctor",
    verifiedDoctor: true,
    specialization: "Pulmonology",
    licenseNumber: "RC-PUL-003",
    preferredLanguage: "ta",
    location: { lat: 12.9616, lng: 77.6046, area: "Respiratory Care Wing" },
    availability: [
      { day: "Monday", slots: ["10:30", "12:30"] },
      { day: "Friday", slots: ["09:00", "14:30"] }
    ]
  },
  {
    name: "Dr. Nisha Verma",
    email: "nisha.derma@ruralcare.local",
    password: "Doctor@123",
    role: "doctor",
    verifiedDoctor: true,
    specialization: "Dermatology",
    licenseNumber: "RC-DER-004",
    preferredLanguage: "hi",
    location: { lat: 12.9516, lng: 77.5746, area: "Skin and Allergy Clinic" },
    availability: [
      { day: "Wednesday", slots: ["09:00", "12:00"] },
      { day: "Saturday", slots: ["10:00", "13:30"] }
    ]
  },
  {
    name: "Dr. Vivek Iyer",
    email: "vivek.neuro@ruralcare.local",
    password: "Doctor@123",
    role: "doctor",
    verifiedDoctor: true,
    specialization: "Neurology",
    licenseNumber: "RC-NEU-005",
    preferredLanguage: "en",
    location: { lat: 12.9416, lng: 77.6146, area: "Neuro Diagnostics Hub" },
    availability: [
      { day: "Tuesday", slots: ["10:00", "12:00", "16:00"] },
      { day: "Friday", slots: ["11:30", "15:00"] }
    ]
  },
  {
    name: "Dr. Farah Khan",
    email: "farah.gastro@ruralcare.local",
    password: "Doctor@123",
    role: "doctor",
    verifiedDoctor: true,
    specialization: "Gastroenterology",
    licenseNumber: "RC-GAS-006",
    preferredLanguage: "en",
    location: { lat: 12.9916, lng: 77.6246, area: "Digestive Care Centre" },
    availability: [
      { day: "Monday", slots: ["08:30", "13:00"] },
      { day: "Thursday", slots: ["10:30", "17:00"] }
    ]
  },
  {
    name: "Dr. Senthil Kumar",
    email: "senthil.ortho@ruralcare.local",
    password: "Doctor@123",
    role: "doctor",
    verifiedDoctor: true,
    specialization: "Orthopedics",
    licenseNumber: "RC-ORT-007",
    preferredLanguage: "ta",
    location: { lat: 12.9711, lng: 77.6346, area: "Bone and Joint Unit" },
    availability: [
      { day: "Wednesday", slots: ["08:00", "10:00", "15:00"] },
      { day: "Saturday", slots: ["09:30", "12:30"] }
    ]
  },
  {
    name: "Dr. Priya Narayanan",
    email: "priya.endo@ruralcare.local",
    password: "Doctor@123",
    role: "doctor",
    verifiedDoctor: true,
    specialization: "Endocrinology",
    licenseNumber: "RC-END-008",
    preferredLanguage: "en",
    location: { lat: 12.9866, lng: 77.6016, area: "Metabolic Health Desk" },
    availability: [
      { day: "Tuesday", slots: ["09:00", "11:30"] },
      { day: "Friday", slots: ["13:00", "16:30"] }
    ]
  }
];

const diseaseToSpecialization = {
  Flu: "General Medicine",
  "Viral Fever": "General Medicine",
  "Common Cold": "General Medicine",
  Malaria: "General Medicine",
  Dengue: "General Medicine",
  "Heart Disease": "Cardiology",
  Diabetes: "Endocrinology",
  Migraine: "Neurology",
  "Food Poisoning": "Gastroenterology",
  "Throat Infection": "General Medicine",
  Tuberculosis: "Pulmonology",
  "COVID-19": "Pulmonology",
  Allergy: "Dermatology",
  Arthritis: "Orthopedics",
  Gastroenteritis: "Gastroenterology",
  Sciatica: "Orthopedics",
  "Urinary Tract Infection": "General Medicine",
  Cholera: "Gastroenterology",
  Hypertension: "Cardiology",
  "Thyroid Disorder": "Endocrinology",
  Asthma: "Pulmonology",
  Acidity: "Gastroenterology",
  Stroke: "Neurology",
  Lupus: "General Medicine",
  Eczema: "Dermatology",
  Typhoid: "General Medicine",
  Hypothyroidism: "Endocrinology",
  Hyperthyroidism: "Endocrinology",
  "Lung Cancer": "Pulmonology",
  "Liver Disease": "Gastroenterology"
};

const getTargetSpecialization = ({ specialization, diagnosis }) =>
  specialization || diseaseToSpecialization[diagnosis] || "General Medicine";

const mapDoctorForClient = (doctor, targetSpecialization, diagnosis) => ({
  _id: doctor._id,
  name: doctor.name,
  specialization: doctor.specialization,
  area: doctor.location?.area,
  availability: doctor.availability,
  location: doctor.location,
  recommended: doctor.specialization === targetSpecialization,
  matchReason:
    doctor.specialization === targetSpecialization
      ? `Recommended for ${diagnosis || targetSpecialization}`
      : `Available nearby in ${doctor.location?.area || "your area"}`
});

const ensureStaticDoctors = async () => {
  for (const staticDoctor of staticDoctors) {
    const existingDoctor = await User.findOne({ email: staticDoctor.email });

    if (!existingDoctor) {
      await User.create(staticDoctor);
      continue;
    }

    const needsUpdate =
      existingDoctor.role !== "doctor" ||
      !existingDoctor.verifiedDoctor ||
      existingDoctor.specialization !== staticDoctor.specialization ||
      existingDoctor.licenseNumber !== staticDoctor.licenseNumber;

    if (needsUpdate) {
      existingDoctor.role = "doctor";
      existingDoctor.verifiedDoctor = true;
      existingDoctor.specialization = staticDoctor.specialization;
      existingDoctor.licenseNumber = staticDoctor.licenseNumber;
      existingDoctor.location = staticDoctor.location;
      existingDoctor.availability = staticDoctor.availability;
      existingDoctor.preferredLanguage = staticDoctor.preferredLanguage;
      await existingDoctor.save();
    }
  }
};

export const getNearbyDoctors = async ({ specialization, diagnosis }) => {
  await ensureStaticDoctors();

  const targetSpecialization = getTargetSpecialization({ specialization, diagnosis });
  const query = { role: "doctor", verifiedDoctor: true };

  if (specialization) {
    query.specialization = specialization;
  }

  const doctors = await User.find(query).select("-password").limit(20);

  return doctors
    .map((doctor) => mapDoctorForClient(doctor, targetSpecialization, diagnosis))
    .sort((left, right) => Number(right.recommended) - Number(left.recommended));
};

export const getNearbyHospitals = () => [
  { name: "RuralCare Community Hospital", distanceKm: 3.2, address: "Main Road Health Block" },
  { name: "District Medical Centre", distanceKm: 7.4, address: "Collector Office Junction" },
  { name: "24x7 Emergency Clinic", distanceKm: 9.1, address: "Bus Stand Road" }
];
