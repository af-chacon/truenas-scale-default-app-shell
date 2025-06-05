import { Shell } from "./shells";

// Message type definitions
interface GetShellPreferenceMessage {
  action: 'getShellPreference';
}

interface SetShellPreferenceMessage {
  action: 'setShellPreference';
  shell: Shell;
}

interface LogActivityMessage {
  action: 'logActivity';
  data: string;
}

type Message = 
  | GetShellPreferenceMessage 
  | SetShellPreferenceMessage
  | LogActivityMessage;

export type {Message};