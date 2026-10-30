export const validateBody = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: err.errors ? err.errors.map(e => ({ field: e.path.join('.'), message: e.message })) : err.message
    });
  }
};

