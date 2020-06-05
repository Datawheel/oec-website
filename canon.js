import {olapMiddleware, permalinkMiddleware} from "@datawheel/tesseract-explorer";

export default {
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
  },
  reduxMiddleware(applyMiddleware, middleware) {
    return applyMiddleware(...middleware, olapMiddleware, permalinkMiddleware);
  }
};
