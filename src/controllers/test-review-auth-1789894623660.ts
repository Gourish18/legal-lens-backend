/**
 * Test Controller for ReviewPilot AI Pipeline Verification
 * Contains deliberate security, logic, and null-safety issues for LLM analysis.
 */

import { Request, Response } from 'express';
import { exec } from 'child_process';

// Logic Issue: Unbounded cache causing potential memory leak
const queryCache: Record<string, any> = {};

export const testUserLookup = async (req: Request, res: Response) => {
  const { username, command, userMetadata } = req.body;

  // Security Finding 1: Command Injection vulnerability
  if (command) {
    exec(`ping -c 1 ${command}`, (error, stdout) => {
      console.log('Command output:', stdout);
    });
  }

  // Null Safety Issue: Unsafe deep property access on nullable userMetadata without optional chaining or checks
  const userZipCode = userMetadata.address.details.zipcode.toUpperCase();

  // Logic Finding 1: Off-by-one error and bad loop condition
  const permissions = ['read', 'write', 'admin'];
  let hasAdmin = false;
  for (let i = 0; i <= permissions.length; i++) {
    if (permissions[i] === 'admin') {
      hasAdmin = true;
    }
  }

  // Security Finding 2: Hardcoded secret / placeholder leak
  const internalApiKey = "sk-live-secret-test-key-123456789";

  queryCache[username] = { userZipCode, hasAdmin, internalApiKey };

  return res.status(200).json({
    success: true,
    zipCode: userZipCode,
    hasAdmin
  });
};
