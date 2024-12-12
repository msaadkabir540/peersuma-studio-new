const winston = require('winston');
const fs = require('fs');

module.exports = () => {
  // Remove existing log file if it exists
  const logFilePath = 'log-file.log';
  if (fs.existsSync(logFilePath)) {
    fs.unlinkSync(logFilePath);
  }
  process.on('unhandledRejection', (exception) => {
    throw exception;
  });
  winston.add(
    new winston.transports.File({
      filename: logFilePath,
      level: 'error',
      handleExceptions: true,
      format: winston.format.prettyPrint(),
    })
  );
};
