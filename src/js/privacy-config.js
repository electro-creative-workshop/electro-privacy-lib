const PRODUCTION_URL = 'https://privacyportal.onetrust.com/request/v1/consentreceipts';
const STAGING_URL = 'https://privacyportaluat.onetrust.com/request/v1/consentreceipts';

const NON_PRODUCTION_HOST_PATTERNS = [
    'lndo.site',
    'pantheonsite',
    'staging',
    'dev',
    'qa',
    'local',
];

const PRODUCTION_TOKEN =
    '"eyJhbGciOiJSUzUxMiJ9.eyJvdEp3dFZlcnNpb24iOjEsInByb2Nlc3NJZCI6ImUxNDMwZTBkLWUzNTgtNGQ4NC1hNGViLTVmMjI3OTRmZGQwZCIsInByb2Nlc3NWZXJzaW9uIjoxLCJpYXQiOiIyMDIyLTEyLTA5VDE3OjQxOjAxLjg4IiwibW9jIjoiQVBJIiwicG9saWN5X3VyaSI6bnVsbCwic3ViIjoiRW1haWwiLCJpc3MiOm51bGwsInRlbmFudElkIjoiNjVjYTZiNDYtNzBiMS00ZWUxLTkwNzQtN2E2M2U4MDBlYTRjIiwiZGVzY3JpcHRpb24iOiJFbmRwb2ludCBmb3Igd2ViIG1vZGFscyIsImNvbnNlbnRUeXBlIjoiQ09ORElUSU9OQUxUUklHR0VSIiwiYWxsb3dOb3RHaXZlbkNvbnNlbnRzIjpmYWxzZSwiZG91YmxlT3B0SW4iOmZhbHNlLCJwdXJwb3NlcyI6W3siaWQiOiI1MjhkZTE1MC1iNWYzLTQ2N2QtYmUxMS03NTc3NTY2MDEyMjQiLCJ2ZXJzaW9uIjoxLCJwYXJlbnRJZCI6bnVsbCwidG9waWNzIjpbXSwiY3VzdG9tUHJlZmVyZW5jZXMiOltdLCJlbmFibGVHZW9sb2NhdGlvbiI6ZmFsc2V9XSwibm90aWNlcyI6W10sImRzRGF0YUVsZW1lbnRzIjpbXSwiYXV0aGVudGljYXRpb25SZXF1aXJlZCI6ZmFsc2UsInJlY29uZmlybUFjdGl2ZVB1cnBvc2UiOmZhbHNlLCJvdmVycmlkZUFjdGl2ZVB1cnBvc2UiOnRydWUsImR5bmFtaWNDb2xsZWN0aW9uUG9pbnQiOmZhbHNlLCJhZGRpdGlvbmFsSWRlbnRpZmllcnMiOltdLCJtdWx0aXBsZUlkZW50aWZpZXJUeXBlcyI6ZmFsc2UsImVuYWJsZVBhcmVudFByaW1hcnlJZGVudGlmaWVycyI6ZmFsc2UsInBhcmVudFByaW1hcnlJZGVudGlmaWVyc1R5cGUiOm51bGwsImFkZGl0aW9uYWxQYXJlbnRJZGVudGlmaWVyVHlwZXMiOltdLCJlbmFibGVHZW9sb2NhdGlvbiI6ZmFsc2V9.g2zafM0cd3qCeVZEXR1AzZfFL6n277n8xPRxGaIUi5oIRoyeDH5ESKvbXT1b4wN1pVzTXZJIl2TKXfHOxzhszfA7oX0gUoYsV6xw_GQIUkF4m8Qly_Pv8r_A0XK4QgvH5iCKcfTmNxOBXRF8vcPj8kT5Rh8G7RsuR6o1rfWBg4IaLPfG3ip7xMo8p2Z4elL3hcTi8dsEJkdSbxyugVOyqydo7Djibq5AtX4l4tI5cWRlf1eG5F1Gr9yBcCzeHl3O-mPx3j344PGgz-AYixQpWhztFUJa13NaD4gycCqNiDbeHqQ16U-696E8lM7uUJ3921qDQQoSAqV6uDnELYHuCi27VDYM8RCzaq9zloWs8G5bSRPSbHIP-YvJUKdHrzjT8_B7ZDBG1efnqMcrqMrQHErG2yDVD_DhlDBLwpokkWpmt3ryYvn9jd4Tk615J73Mxpxu2NpaXnuaothZSXRXIxL7BYUP-PS5y2edp18SKS7eXOWrU0ahEPXKKWhIfXVE7t_PSER8ZO-E-8oLtzMHfbK2bRIS44N37yUGEpmd8Th6ovZiQvTtxBkC0dJbd0FGM4su7NRXyoNY_8dHbXGc9GC1M9P54Ke4pyFfVKrcD4spavrSj2wxiqToTPFpaeFxK8XJn9xENM3_ATJhGpW19CayJm2sesiqaambsymutsk"';
const STAGING_TOKEN =
    '"eyJhbGciOiJSUzUxMiJ9.eyJvdEp3dFZlcnNpb24iOjEsInByb2Nlc3NJZCI6IjBkZjc2NTAwLWRmNWEtNGQzMC1hOTFhLWFjZmMyMzAyZTFhNyIsInByb2Nlc3NWZXJzaW9uIjoxLCJpYXQiOiIyMDIyLTA5LTI2VDAzOjMyOjIxLjE2NyIsIm1vYyI6IkFQSSIsInBvbGljeV91cmkiOm51bGwsInN1YiI6IkVtYWlsIiwiaXNzIjpudWxsLCJ0ZW5hbnRJZCI6ImM1NzQ2ZTQzLWQyMjItNGI3ZS04ZjRkLTJiNzkzYjViZmFjZiIsImRlc2NyaXB0aW9uIjoiTi9BIiwiY29uc2VudFR5cGUiOiJDT05ESVRJT05BTFRSSUdHRVIiLCJhbGxvd05vdEdpdmVuQ29uc2VudHMiOmZhbHNlLCJkb3VibGVPcHRJbiI6ZmFsc2UsInB1cnBvc2VzIjpbeyJpZCI6IjljYjc2Yjk0LTY3NjYtNGY1MS04ZjRiLTFmNTE4YWNkZDE2NSIsInZlcnNpb24iOjIsInBhcmVudElkIjpudWxsLCJ0b3BpY3MiOltdLCJjdXN0b21QcmVmZXJlbmNlcyI6W10sImVuYWJsZUdlb2xvY2F0aW9uIjpmYWxzZX1dLCJub3RpY2VzIjpbXSwiZHNEYXRhRWxlbWVudHMiOltdLCJhdXRoZW50aWNhdGlvblJlcXVpcmVkIjpmYWxzZSwicmVjb25maXJtQWN0aXZlUHVycG9zZSI6ZmFsc2UsIm92ZXJyaWRlQWN0aXZlUHVycG9zZSI6dHJ1ZSwiZHluYW1pY0NvbGxlY3Rpb25Qb2ludCI6ZmFsc2UsImFkZGl0aW9uYWxJZGVudGlmaWVycyI6W10sIm11bHRpcGxlSWRlbnRpZmllclR5cGVzIjpmYWxzZSwiZW5hYmxlUGFyZW50UHJpbWFyeUlkZW50aWZpZXJzIjpmYWxzZSwicGFyZW50UHJpbWFyeUlkZW50aWZpZXJzVHlwZSI6bnVsbCwiYWRkaXRpb25hbFBhcmVudElkZW50aWZpZXJUeXBlcyI6W10sImVuYWJsZUdlb2xvY2F0aW9uIjpmYWxzZX0.MsM-CdCqBswZHRwR4N_E-RxcHlu368mLb9hIMUJTZ3U5FJMtdIQGr_AmqR5ik6Bx9RedlEZ87Kq8P9-dvPprz0OlHRPZeq-I56khj-C6lvB348mdM_Zr0V-nsBiX72wv6piNWqDJ6cogQRO_92QXZgjrbZYTHKrN5g2VxXqkJrKTQP9OfbIwfnTuK8W37jeLVcWh5KFVGtSC0Wgq64B1VnzwUpn3OGDmWLPp0rjqbE57kqy6eY6fX4d8mulZUpFH8lEqZ8i-xACXmze8lMBuijN26UI2PY6CL1KKfksNIXa9I4I43NBj5AIiaWDioUaQzAZZrqkxKRJGyY7mYbEcxFji5w8kPSfbMBnoRDHF9djVQdQ-gIcFwD_xn1m6NvgmWqeo-vZABn5s7Kg24nS_2Bb7TKk-b5-mrydpE5jMt85kawRCH7tue4F94Y--84ug64FU0cHafB9Byobw-ZCDQQ7Ua8AZVHIIqxDVzK-QZQSSF3OgBoDfhu1-1cM0yTGFDAkCXC7z1aEg2dTyQkG1jF-JEE2pF-jpDSi9hN9A5BRtG8Wh42E4MEj3Xo97y-8Xdnd0V61WDWaLSgVPUclMYdOyTBp_6_QESXqwEraMP6MGubqV_-Br4lbUVkkggvBARx6k46wPke-0u3NrWwgks627GS1DoO349dlVw2YT-YA"';

const PRODUCTION_PREFERENCES =
    '"purposes": [{"Id": "528de150-b5f3-467d-be11-757756601224","TransactionType": "WITHDRAWN"}]';
const STAGING_PREFERENCES =
    '"purposes": [{"Id": "9cb76b94-6766-4f51-8f4b-1f518acdd165","TransactionType": "WITHDRAWN"}]';

export function isNonProductionEnvironment(host, vercelEnv) {
    const normalizedHost = String(host || '').toLowerCase();
    const normalizedVercelEnv = String(vercelEnv || '').toLowerCase();

    if (NON_PRODUCTION_HOST_PATTERNS.some((testString) => normalizedHost.includes(testString))) {
        return true;
    }

    if (normalizedHost.includes('vercel.app')) {
        return true;
    }

    if (normalizedVercelEnv === 'preview' || normalizedVercelEnv === 'development') {
        return true;
    }

    return false;
}

export function getPrivacyRequestConfig({ host, electroPrivacyStaging, vercelEnv } = {}) {
    const useStaging = Boolean(electroPrivacyStaging) || isNonProductionEnvironment(host, vercelEnv);

    if (useStaging) {
        return {
            url: STAGING_URL,
            token: STAGING_TOKEN,
            preferences: STAGING_PREFERENCES,
            environment: 'STAGING',
        };
    }

    return {
        url: PRODUCTION_URL,
        token: PRODUCTION_TOKEN,
        preferences: PRODUCTION_PREFERENCES,
        environment: 'PRODUCTION',
    };
}

export function getRuntimePrivacyRequestConfig() {
    const win = typeof window !== 'undefined' ? window : undefined;
    const loc = typeof location !== 'undefined' ? location : undefined;

    return getPrivacyRequestConfig({
        host: loc ? loc.host : '',
        electroPrivacyStaging: win ? win.electroPrivacyStaging : false,
        vercelEnv: win ? win.VERCEL_ENV : undefined,
    });
}
