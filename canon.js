/**
    The object that this file exports is used to set configurations for canon
    and it's sub-modules.
*/
module.exports = {
  express: {
    bodyParser: {
      json: {
        verify: (req, red, buf) => {
          const url = req.originalUrl;
          if (url.startsWith("/auth/stripe/hooks")) {
            req.rawBody = buf.toString();
          }
        }
      }
    }
  }
};
