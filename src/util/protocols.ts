import { Protocol } from '@pollum-io/router-sdk';

export const TO_PROTOCOL = (protocol: string): Protocol => {
  switch (protocol.toLowerCase()) {
    case 'v2':
      return Protocol.V2;
    case 'v1':
      return Protocol.V1;
    case 'mixed':
      return Protocol.MIXED;
    default:
      throw new Error(`Unknown protocol: {id}`);
  }
};
