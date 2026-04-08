import User from "../models/User.js";
import { signToken } from "../utils/jwt.js";

const authResponse = (user) => ({
  token: signToken({ id: user._id, role: user.role }),
  user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    preferredLanguage: user.preferredLanguage,
    verifiedDoctor: user.verifiedDoctor,
    specialization: user.specialization,
    location: user.location
  }
});

export const register = async (req, res, next) => {
  try {
    const existing = await User.findOne({ email: req.body.email });
    if (existing) {
      res.status(400);
      throw new Error("Email already in use");
    }

    const user = await User.create(req.body);
    res.status(201).json({ success: true, ...authResponse(user) });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await user.comparePassword(req.body.password))) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    if (user.role === "doctor" && !user.verifiedDoctor) {
      res.status(403);
      throw new Error("Doctor account pending admin verification");
    }

    res.json({ success: true, ...authResponse(user) });
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res) => {
  res.json({ success: true, user: req.user });
};
