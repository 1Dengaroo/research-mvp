export { streamEmailGeneration } from './generation';
export { sendAndRecordEmail } from './sending';
export { emailGenerateBodySchema, emailSendBodySchema } from './schemas';
export type {
  GeneratedEmail,
  GeneratedEmailSequence,
  SentEmail,
  SendEmailRequest,
  ComposeEmailParams
} from './types';
