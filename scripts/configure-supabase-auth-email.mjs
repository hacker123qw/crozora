import fs from 'node:fs/promises';
import path from 'node:path';

const rootDir = process.cwd();
const localEnvFiles = ['.env.local', '.env.supabase-email.local'];

function parseEnvText(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .reduce((acc, line) => {
      const separatorIndex = line.indexOf('=');
      if (separatorIndex === -1) {
        return acc;
      }

      const key = line.slice(0, separatorIndex).trim();
      let value = line.slice(separatorIndex + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      acc[key] = value;
      return acc;
    }, {});
}

async function loadFileEnv(fileName) {
  try {
    const content = await fs.readFile(path.join(rootDir, fileName), 'utf8');
    return parseEnvText(content);
  } catch {
    return {};
  }
}

function parseProjectRef(url) {
  try {
    const { hostname } = new URL(url);
    return hostname.split('.')[0] || '';
  } catch {
    return '';
  }
}

async function readTemplate(fileName) {
  const filePath = path.join(rootDir, 'supabase-email-templates', fileName);
  return fs.readFile(filePath, 'utf8');
}

async function main() {
  const fileEnvEntries = await Promise.all(localEnvFiles.map(loadFileEnv));
  const env = Object.assign({}, ...fileEnvEntries, process.env);

  const projectRef = env.SUPABASE_PROJECT_REF || parseProjectRef(env.VITE_SUPABASE_URL || '');
  const accessToken = env.SUPABASE_ACCESS_TOKEN || '';
  const resendApiKey = env.RESEND_API_KEY || '';
  const senderEmail = env.SUPABASE_SMTP_SENDER_EMAIL || 'support@crozora.com';
  const senderName = env.SUPABASE_SMTP_SENDER_NAME || 'Crozora Support';
  const dryRun = process.argv.includes('--dry-run');

  if (!projectRef) {
    throw new Error('Missing SUPABASE_PROJECT_REF. Set it directly or provide VITE_SUPABASE_URL in .env.local.');
  }

  if (!resendApiKey) {
    throw new Error('Missing RESEND_API_KEY. Set it in .env.supabase-email.local or the shell environment.');
  }

  const [confirmationTemplate, recoveryTemplate, magicLinkTemplate] = await Promise.all([
    readTemplate('confirm-signup.html'),
    readTemplate('reset-password.html'),
    readTemplate('magic-link.html'),
  ]);

  const payload = {
    external_email_enabled: true,
    mailer_secure_email_change_enabled: true,
    mailer_autoconfirm: false,
    smtp_admin_email: senderEmail,
    smtp_host: 'smtp.resend.com',
    smtp_port: '465',
    smtp_user: 'resend',
    smtp_pass: resendApiKey,
    smtp_sender_name: senderName,
    mailer_subjects_confirmation: 'Confirm your Crozora account',
    mailer_subjects_recovery: 'Reset your Crozora password',
    mailer_subjects_magic_link: 'Your Crozora sign-in link',
    mailer_templates_confirmation_content: confirmationTemplate,
    mailer_templates_recovery_content: recoveryTemplate,
    mailer_templates_magic_link_content: magicLinkTemplate,
  };

  if (dryRun) {
    console.log(`Dry run ready for project ${projectRef}.`);
    console.log(`Sender: ${senderName} <${senderEmail}>`);
    console.log('SMTP host: smtp.resend.com');
    console.log('Templates: confirmation, recovery, magic link');
    return;
  }

  if (!accessToken) {
    throw new Error('Missing SUPABASE_ACCESS_TOKEN. Create a personal access token in Supabase and add it locally.');
  }

  const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/config/auth`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase auth email configuration failed (${response.status}): ${errorText}`);
  }

  console.log(`Supabase Auth email configuration updated for project ${projectRef}.`);
  console.log(`Sender configured as ${senderName} <${senderEmail}>.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
