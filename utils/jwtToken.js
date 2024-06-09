// jwtToken.js
export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateWebToken();

  // Ensure token is a string
  if (typeof token !== "string") {
    throw new Error("Token generation failed: token is not a string");
  }

  res
    .status(statusCode)
    .cookie("token", token, {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),

      httpOnly: true,
      sameSite: "None",
      secure: true,
    })
    .json({
      success: true,
      message,
      user,
      token,
    });
};