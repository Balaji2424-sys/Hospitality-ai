import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["user", "doctor", "admin"], default: "user" },
    preferredLanguage: { type: String, enum: ["en", "hi", "ta"], default: "en" },
    phone: String,
    age: Number,
    gender: String,
    address: String,
    location: {
      lat: { type: Number, default: 12.9716 },
      lng: { type: Number, default: 77.5946 },
      area: { type: String, default: "Default Health Zone" }
    },
    licenseNumber: String,
    specialization: String,
    verifiedDoctor: { type: Boolean, default: false },
    availability: [
      {
        day: String,
        slots: [String]
      }
    ]
  },
  { timestamps: true }
);

userSchema.pre("save", async function save(next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
