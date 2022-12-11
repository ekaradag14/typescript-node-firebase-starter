'use strict';
// const Errors = require('../enums/errors.js');
// const functions = require('firebase-functions');
// note: if we need better error detection: https://stackoverflow.com/questions/14172455/get-name-and-line-of-calling-function-in-node-js/14172822
// note: res.send vs res.json are basically same, only different coming when non-object is passed as parameter. But here we send object to res.send

// System functioned normally, request had no problems
export const successful = (res: any, data: any) => {
  res.status(200).json({
    success: true,
    data,
  });
};
/**
// System functioned normally, request had a problem
const unsuccessful = (req, res, error, reason, code, status = 404) => {
  functions.logger.log('USER REQ ERRORX7++//', {
    req,
    res,
    error,
    reason,
    code,
  });

  res.status(status).send({
    success: false,
    error: error.toString(),
    reason: reason.toString() || '',
    code: code || Errors.code.Unknown,
  });
};

// System failed to function, could be internal or due to request
const failure = (req, res, error, reason, code, status = 500) => {
  functions.logger.warn('System error //&4$', { req, error, reason, code });
  res.status(status).send({
    success: false,
    error: error.toString(),
    reason: reason.toString() || '',
    code: code || Errors.code.Unknown,
  });
};

const criticalFailure = (req, res, error, reason, code, status = 500) => {
  Logger.critical.error({ req, error, reason, code });
  res.status(500).send({
    success: false,
    error: error.toString(),
    reason: reason.toString() || '',
    code: code || Errors.code.Unknown,
  });
};

/*
 * processes the error and calls the appropriate response function
 * err: {
 *     type: critical|criticalFailure|unsuccessful
 *     err, reason, code: these fields correspond to the params expected by response functions
 * }
 */

/**
const processError = (req, res, err) => {
  let params = [];
  if (err.type.toLowerCase().includes('failure')) params.push(req);
  params = [...params, ...[res, err.err, err.reason, err.code]];
  module.exports[err.type].apply(null, params);
};
*/
