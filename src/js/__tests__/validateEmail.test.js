import { describe, it, expect } from 'vitest';
import { validateEmail } from '../validateEmail.js';

describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
        expect(validateEmail('test@example.com')).toBe(true);
        expect(validateEmail('user.name@domain.co')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
        expect(validateEmail('invalid')).toBe(false);
        expect(validateEmail('missing@')).toBe(false);
        expect(validateEmail('@nodomain.com')).toBe(false);
    });

    it('should handle empty strings', () => {
        expect(validateEmail('')).toBe(false);
    });

    it('should handle null/undefined', () => {
        expect(validateEmail(null)).toBe(false);
        expect(validateEmail(undefined)).toBe(false);
    });

    it('should trim whitespace', () => {
        expect(validateEmail('  test@example.com  ')).toBe(true);
    });

    it('should enforce maximum email length (254 chars)', () => {
        const longLocal = 'a'.repeat(255) + '@example.com';
        expect(validateEmail(longLocal)).toBe(false);
        const atLimit = 'a'.repeat(244) + '@test.co';
        expect(validateEmail(atLimit)).toBe(true);
    });
});
