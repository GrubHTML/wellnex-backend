import jwt from "jsonwebtoken";

const authGuard = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      const err = new error("No token provided");
      err.statusCode = 401;
      return next(err);
    }

    if (!authorization.startsWith("Bearer ")) {
      const err = new Error("Invalid token");
      err.statusCode = 401;
      return next(err);
    }

    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.id = decoded.id; // attach user to request
    next();
  } catch (error) {
    const err = new Error("Invalid or expired token");
    err.statusCode(401);
    return next(err);
  }
};
export { authGuard };
