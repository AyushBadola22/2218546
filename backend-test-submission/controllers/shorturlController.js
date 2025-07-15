import Log from "../../loggingMiddleware/logger.js";

const shortlinks = new Map();
const validUniqueCodeRegex = /^[a-zA-Z0-9]{1,10}$/;
function generateShortcode(length = 6) {
  const validChars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let uniqueCode = "";

  for (let i = 0; i < length; i++) {
    let randomIndex = Math.floor(Math.random() * validChars.length);
    uniqueCode += validChars.charAt(randomIndex);
  }

  return uniqueCode;
}

function isValidShortcode(code) {
  return validUniqueCodeRegex.test(code);
}

export async function createShortUrl(req, res) {
  const { url, validity, shortcode } = req.body;

  if (!url) {
    await Log("backend", "error", "route", "URL was not provided");
    return res.status(400).json({ error: "URL was not provided" });
  }

  if (validity && parseInt(validity) <= 0) {
    await Log(
      "backend",
      "error",
      "route",
      "Validity must be a positive integer representing minutes."
    );
    return res
      .status(400)
      .json({
        error: "Validity must be a positive integer representing minutes.",
      });
  }

  let code = shortcode;
  if (code) {
    if (!isValidShortcode(code)) {
      await Log("backend", "error", "route", "Invalid shortcode provided.");
      return res.status(400).json({
        error:
          "Invalid shortcode. Use alphanumeric characters and at least 1 character and at max 10 characters.",
      });
    }
    if (shortlinks.has(code)) {
      await Log(
        "backend",
        "error",
        "route",
        `Shortcode '${code}' already in use.`
      );
      return res.status(409).json({ error: "Shortcode already in use." });
    }
  } else {
    do {
      code = generateShortcode();
    } while (shortlinks.has(code));
  }

  const now = Date.now();
  const minutes = validity || 30;
  const expiry = now + minutes * 60 * 1000;

  shortlinks.set(code, { url, expiry });

  const host = req.protocol + "://" + req.get("host");
  const shortlink = `${host}/shorturls/${code}`;

  await Log(
    "backend",
    "info",
    "route",
    `Shortlink created: ${shortlink} (expires in ${minutes} min)`
  );
  res.json({ shortlink, expiry });
}

export async function redirectShortUrl(req, res) {
  const { shortcode } = req.params;
  const link = shortlinks.get(shortcode);

  if (!link) {
    await Log(
      "backend",
      "error",
      "route",
      `Shortlink '${shortcode}' not found`
    );
    return res.status(404).json({ error: "Shortlink not found" });
  }

  if (Date.now() > link.expiry) {
    shortlinks.delete(shortcode);
    await Log(
      "backend",
      "error",
      "route",
      `Shortlink '${shortcode}' expired`
    );
    return res.status(410).json({ error: "Shortlink expired" });
  }

  await Log(
    "backend",
    "info",
    "route",
    `Redirected shortlink '${shortcode}' to ${link.url}`
  );
  res.redirect(link.url);
}
