import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Servir arquivos estáticos da pasta attached_assets
  app.use('/attached_assets', express.static('attached_assets'));

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Force production mode check
  const isProduction = process.env.NODE_ENV === "production" || app.get("env") === "production";
  
  if (isProduction) {
    try {
      // Try to serve static files from dist/public
      serveStatic(app);
      log("✅ Production mode: serving static files from dist/public");
    } catch (error) {
      // If dist/public doesn't exist, fall back to development mode
      log("⚠️ dist/public not found, falling back to development mode");
      await setupVite(app, server);
    }
  } else {
    // Development mode: use Vite dev server
    await setupVite(app, server);
    log("🔧 Development mode: using Vite dev server");
  }
  
  console.log(`🔧 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔧 App env: ${app.get("env")}`);
  console.log(`🔧 Production mode: ${isProduction}`);
  
  // Setup vite only in development, serve static in production
  if (!isProduction && app.get("env") === "development") {
    console.log("🔧 Setting up Vite dev server");
    await setupVite(app, server);
  } else {
    console.log("🔧 Serving static files from dist/public");
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
