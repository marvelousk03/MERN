import jwt from "jsonwebtoken";

export default function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1]; // Bearer token
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      console.log("Invalid token");
    }
  }
  next();
}
