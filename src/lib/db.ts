import { neonConfig } from "@neondatabase/serverless";
import { sql } from "@vercel/postgres";

// ローカル開発環境の場合の設定
if (process.env.NODE_ENV === "development") {
  neonConfig.wsProxy = (host) => `${host}:5433/v1`;
  neonConfig.useSecureWebSocket = false;
  neonConfig.pipelineTLS = false;
  neonConfig.pipelineConnect = false;
}

export { sql }; 