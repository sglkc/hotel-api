/**
 * This function tries to get a method from the specified controller
 * @function c
 * @param  {String}   path Controller and method, ex: "auth@login"
 * @return {function}      Function extracted from controller
 */
function c(path) {
  const [ controllerName, method ] = path.split('@');

  try {
    const controller = require('../controllers/' + controllerName);

    if (!(method in controller)) {
      throw new Error(
        `\x1b[31mMethod ${method} doesn't exist in ${controllerName}\x1b[0m`
      );
    }

    return controller[method];
  } catch (error) {
    throw error;
  }
}

module.exports = { c };
