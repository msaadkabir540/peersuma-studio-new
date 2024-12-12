const schemaValidation = (schema) => {
  return async (req, res, next) => {
    try {
      const { error } = schema.validate(req.body);
      const valid = error == null;

      if (valid) {
        next();
      } else {
        const { details } = error;
        const message = details.map((i) => i.message).join(',');

        res.status(422).json({ error: message });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  };
};

module.exports = schemaValidation;
