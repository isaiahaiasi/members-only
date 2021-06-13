const { validationResult } = require("express-validator");

// * GENERIC VALIDATION HANDLER
// function that creates a middleware function for rendering the form rejection.
// takes the typical res.render arguments, then calls res.render with those + errors
// or calls next() if validation passes
const handleValidationErrors = (view, locals) => {
  return (req, res, next) => {
    const errorsArray = validationResult(req).array();

    // create a Map where [err.param]: [err]
    // ? Can't find built-in for making Map from Array? :hmm:
    // the downside of this approach is I'm creating a more burdensome dependency
    // for my Views, since Maps aren't really the assumed interface
    const errors = errorsArray.reduce(
      (acc, err) => acc.set(err.param, { msg: err.msg }),
      new Map()
    );

    if (errors.size > 0) {
      // create a copy of req.body with everything but entries containing "password"
      const filteredBody = Object.fromEntries(
        Object.entries(req.body).filter(([key]) => !key.includes("password"))
      );

      const allLocals = {
        ...locals,
        ...filteredBody,
        errors,
      };

      res.status(400).render(view, allLocals);
    } else {
      next();
    }
  };
};

module.exports = { handleValidationErrors };
