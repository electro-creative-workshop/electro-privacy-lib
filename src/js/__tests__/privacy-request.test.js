import { describe, it, expect } from 'vitest';
import {
    sanitizeEmailIdentifier,
    isValidEmailIdentifier,
    buildConsentRequestBody,
} from '../privacy-request.js';

describe('privacy-request', () => {
    it('sanitizes email identifier by trimming whitespace', () => {
        expect(sanitizeEmailIdentifier('  test@example.com  ')).toBe('test@example.com');
    });

    it('validates sanitized email identifiers', () => {
        expect(isValidEmailIdentifier('  test@example.com  ')).toBe(true);
        expect(isValidEmailIdentifier('not-an-email')).toBe(false);
        expect(isValidEmailIdentifier('   ')).toBe(false);
    });

    it('returns invalid-identifier for bad emails', () => {
        const result = buildConsentRequestBody('invalid', '"token"', '"purposes": []');

        expect(result.ok).toBe(false);
        expect(result.error).toBe('invalid-identifier');
    });

    it('builds valid JSON body for valid email and payload parts', () => {
        const result = buildConsentRequestBody('  test@example.com  ', '"token"', '"purposes": []');

        expect(result.ok).toBe(true);
        expect(result.identifier).toBe('test@example.com');
        expect(JSON.parse(result.body)).toEqual({
            identifier: 'test@example.com',
            requestInformation: 'token',
            purposes: [],
        });
    });

    it('returns invalid-json when token/preference parts cannot form JSON', () => {
        const result = buildConsentRequestBody('test@example.com', 'not-json', '"purposes": []');

        expect(result.ok).toBe(false);
        expect(result.error).toBe('invalid-json');
    });
});
