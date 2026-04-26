import { createClient } from "@supabase/supabase-js";
const url = process.env.TEST_URL;
const key = process.env.TEST_KEY;
try {
  const client = createClient(url, key);
  console.log('ok', Boolean(client));
} catch (e) {
  console.error('err', e?.message || e);
  process.exit(1);
}
