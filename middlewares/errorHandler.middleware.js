import { UniqueConstraintError, ValidationError } from "sequelize";

const errorHandler = (err, req, res, next) => {
  // Sequelize unique constraint(duplicate)
  if (err instanceof UniqueConstraintError) {
    return res.status(409).json({
      success: false,
      message: `${err.errors[0].value} already exists`,
      // field: err.errors[0].path,
    });
  }
  // Sequelize validation error
  if (err instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      mesage: err.errors[0].message,
      // field: err.errors[0].path,
    });
  }

  // custom error
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  return res.status(statusCode).json({ success: false, message });
};

export default errorHandler;
