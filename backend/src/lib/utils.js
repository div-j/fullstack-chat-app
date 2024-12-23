import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  // Ensure JWT secret is configured
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("JWT_SECRET_KEY is not defined in environment variables");
  }

  try {
    // Generate token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d", // Token expiration
    });

    // Set cookie options
    const isDevelopment = process.env.MODE === "dev";
    const cookieOptions = {
      httpOnly: true, // Prevent access via JavaScript
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      sameSite: "strict", // Ensure cookies only work in same-site requests
      secure: !isDevelopment, // HTTPS only in production
    };

    // Set the cookie
    res.cookie("jwt", token, cookieOptions);

    // Return the token for other use cases (optional)
    return token;
  } catch (error) {
    console.error("Error generating token:", error.message);
    throw new Error("Token generation failed");
  }
};
