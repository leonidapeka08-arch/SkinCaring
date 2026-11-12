const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authRepository = require("../repositories/auth.repository");

async function register(emri, email, password, telefon) {
  const ekzistues = await authRepository.findUserByEmail(email);

  if (ekzistues) {
    throw new Error("Ky email është përdorur tashmë");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await authRepository.createUser({
    emri,
    email,
    passwordHash,
    telefon,
  });

  const token = jwt.sign(
    { userId: user.id, roli: user.roli },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  return {
    token,
    user: {
      id: user.id,
      emri: user.emri,
      email: user.email,
      roli: user.roli,
    },
  };
}

async function login(email, password) {
  const user = await authRepository.findUserByEmail(email);

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new Error("Email ose password gabim");
  }

  const token = jwt.sign(
    { userId: user.id, roli: user.roli },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  return {
    token,
    user: {
      id: user.id,
      emri: user.emri,
      email: user.email,
      roli: user.roli,
    },
  };
}

module.exports = { register, login };
