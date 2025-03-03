import { neonConfig, Pool } from "@neondatabase/serverless";
import { sql } from "@vercel/postgres";

// ローカル開発環境の場合の設定
if (process.env.NODE_ENV === "development") {
  neonConfig.wsProxy = (host) => `${host}:5433/v1`;
  neonConfig.useSecureWebSocket = false;
  neonConfig.pipelineTLS = false;
  neonConfig.pipelineConnect = false;
}

// 本番環境用のプールを設定
const pool = process.env.NODE_ENV === "production"
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : null;

// SQLクエリ実行関数をエクスポート
export const dbsql = async (strings: TemplateStringsArray, ...values: any[]) => {
  if (process.env.NODE_ENV === "production" && pool) {
    const query = strings.reduce((acc, str, i) => 
      acc + str + (i < values.length ? `$${i + 1}` : ''), 
    '');
    return pool.query(query, values);
  }
  return sql(strings, ...values);
};

export { sql }; 