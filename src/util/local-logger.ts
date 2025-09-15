import winston from "winston";
import path from "path";

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
  },
  colors: {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    verbose: "cyan",
    debug: "blue",
    silly: "grey",
  },
};

const LocalLogger = winston.createLogger({
  level: "info",
  levels: customLevels.levels,
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(
      (info) => `${info.timestamp} - ${info.level}: ${info.message}\n`,
    ),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(__dirname, "logs", "combined.log"),
    }),
    new winston.transports.File({
      level: "error",
      filename: path.join(__dirname, "logs", "errors.log"),
    }),
  ],
});

export default LocalLogger;
