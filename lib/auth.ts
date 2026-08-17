import { jwtVerify, SignJWT } from "jose";

function getSecretKey() {
  const secretKey = process.env.SESSION_SECRET;
  if (!secretKey) {
    throw new Error(
      "SESSION_SECRET environment variable is not defined. " +
      "Admin authentication cannot function without it."
    );
  }
  return new TextEncoder().encode(secretKey);
}

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h") // Oturum 24 saat geçerli
    .sign(getSecretKey());
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, getSecretKey(), {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    return null; // Token geçersizse veya süresi dolmuşsa
  }
}
