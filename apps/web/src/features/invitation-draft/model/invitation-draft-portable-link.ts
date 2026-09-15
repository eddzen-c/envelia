import type { InvitationDraft } from './invitation-draft';
import { isInvitationDraft } from './invitation-draft-persistence';

export const portableInvitationPayloadVersion = 1 as const;

export const portableInvitationPath = '/invitation';

export const portableInvitationMaxPayloadBytes = 4096;

export const portableInvitationMaxEncodedLength = Math.ceil(
  (portableInvitationMaxPayloadBytes * 4) / 3,
);

export type PortableInvitationEncodeResult =
  | Readonly<{
      status: 'encoded';
      payload: string;
    }>
  | Readonly<{
      status: 'invalid-draft' | 'too-large';
      payload: null;
    }>;

export type PortableInvitationParseResult =
  | Readonly<{
      status: 'decoded';
      draft: InvitationDraft;
    }>
  | Readonly<{
      status: 'empty' | 'invalid' | 'unsupported' | 'too-large';
      draft: null;
    }>;

type UnknownRecord = Record<string, unknown>;

type PortableInvitationEnvelope = Readonly<{
  version: typeof portableInvitationPayloadVersion;
  draft: InvitationDraft;
}>;

const portableInvitationEnvelopeKeys = ['version', 'draft'] as const;

const base64UrlPattern = /^[A-Za-z0-9_-]+$/u;

const textEncoder = new TextEncoder();

const textDecoder = new TextDecoder('utf-8', {
  fatal: true,
});

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const hasExactKeys = (value: UnknownRecord, expectedKeys: readonly string[]) => {
  const actualKeys = Object.keys(value);

  return (
    actualKeys.length === expectedKeys.length &&
    expectedKeys.every((key) => Object.prototype.hasOwnProperty.call(value, key))
  );
};

const encodeBase64Url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes))
    .replace(/\+/gu, '-')
    .replace(/\//gu, '_')
    .replace(/=+$/u, '');

const decodeBase64Url = (payload: string) => {
  if (!base64UrlPattern.test(payload) || payload.length % 4 === 1) {
    return null;
  }

  const paddingLength = (4 - (payload.length % 4)) % 4;
  const base64Value = payload.replace(/-/gu, '+').replace(/_/gu, '/');
  const paddedValue = `${base64Value}${'='.repeat(paddingLength)}`;

  try {
    const binaryValue = atob(paddedValue);

    return Uint8Array.from(binaryValue, (character) => character.charCodeAt(0));
  } catch {
    return null;
  }
};

const createPortableEnvelope = (draft: InvitationDraft): PortableInvitationEnvelope => ({
  version: portableInvitationPayloadVersion,
  draft: {
    eventTitle: draft.eventTitle,
    eventDate: draft.eventDate,
    location: draft.location,
    message: draft.message,
    theme: draft.theme,
  },
});

export const encodePortableInvitationDraft = (
  draft: InvitationDraft,
): PortableInvitationEncodeResult => {
  if (!isInvitationDraft(draft)) {
    return {
      status: 'invalid-draft',
      payload: null,
    };
  }

  const serializedEnvelope = JSON.stringify(createPortableEnvelope(draft));
  const payloadBytes = textEncoder.encode(serializedEnvelope);

  if (payloadBytes.byteLength > portableInvitationMaxPayloadBytes) {
    return {
      status: 'too-large',
      payload: null,
    };
  }

  return {
    status: 'encoded',
    payload: encodeBase64Url(payloadBytes),
  };
};

export const parsePortableInvitationPayload = (
  fragmentOrPayload: string,
): PortableInvitationParseResult => {
  const payload = fragmentOrPayload.startsWith('#')
    ? fragmentOrPayload.slice(1)
    : fragmentOrPayload;

  if (payload.length === 0) {
    return {
      status: 'empty',
      draft: null,
    };
  }

  if (payload.length > portableInvitationMaxEncodedLength) {
    return {
      status: 'too-large',
      draft: null,
    };
  }

  const payloadBytes = decodeBase64Url(payload);

  if (!payloadBytes) {
    return {
      status: 'invalid',
      draft: null,
    };
  }

  if (payloadBytes.byteLength > portableInvitationMaxPayloadBytes) {
    return {
      status: 'too-large',
      draft: null,
    };
  }

  let parsedValue: unknown;

  try {
    const serializedEnvelope = textDecoder.decode(payloadBytes);
    parsedValue = JSON.parse(serializedEnvelope) as unknown;
  } catch {
    return {
      status: 'invalid',
      draft: null,
    };
  }

  if (!isRecord(parsedValue) || !hasExactKeys(parsedValue, portableInvitationEnvelopeKeys)) {
    return {
      status: 'invalid',
      draft: null,
    };
  }

  if (parsedValue.version !== portableInvitationPayloadVersion) {
    return {
      status: 'unsupported',
      draft: null,
    };
  }

  if (!isInvitationDraft(parsedValue.draft)) {
    return {
      status: 'invalid',
      draft: null,
    };
  }

  return {
    status: 'decoded',
    draft: {
      ...parsedValue.draft,
    },
  };
};
