const Validator = (schema, params) => {
  return async (req, res, next) => {
    const { error } = schema.validate(
      params === 'body'
        ? req.body
        : params === 'params'
          ? req.params
          : req.query,
      { abortEarly: false }
    );
    if (error)
      return res
        .status(422)
        .send({ msg: 'Invalid data', errors: error?.details });
    next();
  };
};

module.exports = {
  Validator,
};
