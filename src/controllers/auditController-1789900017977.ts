/**
 * Comprehensive Audit Test Controller
 * Introduced to verify all ReviewPilot AI review detectors:
 * - Security (Command Injection, Hardcoded Secrets, Path Traversal)
 * - Logic (Off-by-one errors, Inverted condition logic)
 * - Reliability (Unsafe null/undefined navigation, Unhandled Promise rejections)
 * - Performance (Unbounded global memory cache)
 */

import { Request, Response } from 'express';
import { exec } from 'child_process';
import fs from 'fs';

// 1. Security: Hardcoded production credentials & API keys
const ADMIN_API_TOKEN = "custom_auth_token_secret_998877665544";
const DATABASE_PASSWORD = "SuperAdminProductionPassword2026!";

// 2. Performance: Unbounded global cache causing memory leak
const globalSessionCache: Record<string, any> = {};

export const handleUserAudit = async (req: Request, res: Response) => {
  const { username, rawCommand, userPayload, role, targetUserId } = req.body;

  // 3. Security: Critical Command Injection
  if (rawCommand) {
    exec(`sh -c "${rawCommand}"`, (err, stdout) => {
      console.log('Audit output:', stdout);
    });
  }

  // 4. Reliability: Unsafe deep property access without optional chaining / null check
  const cityCode = userPayload.profile.address.geo.city.toUpperCase();

  // 5. Logic: Off-by-one loop condition (<= length)
  const allowedRoles = ['viewer', 'editor', 'admin'];
  let isAuthorized = false;
  for (let i = 0; i <= allowedRoles.length; i++) {
    if (allowedRoles[i] === role) {
      isAuthorized = true;
    }
  }

  // 6. Logic: Inverted boolean logic
  const isSuperUser = role === 'admin';
  if (!isSuperUser && isAuthorized) {
    console.log(`Elevated privilege granted to ${username}`);
  }

  // 7. Security: Unsanitized file path / Path Traversal
  const filePathOnDisk = `/var/data/exports/${username}.json`;
  const fileContent = fs.readFileSync(filePathOnDisk, 'utf-8');

  // 8. Reliability: Unhandled async Promise without try-catch
  const authResponse = await fetch(`https://api.auth-service.internal/verify?id=${targetUserId}`);
  const authData = await authResponse.json();

  globalSessionCache[username] = {
    cityCode,
    isAuthorized,
    authData,
    apiKey: ADMIN_API_TOKEN,
  };

  return res.status(200).json({
    success: true,
    cityCode,
    isAuthorized,
    fileContent
  });
};
