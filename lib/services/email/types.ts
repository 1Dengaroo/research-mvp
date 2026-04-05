import type { CompanyResult, TargetContact } from '../research/types';
import type { ICPCriteria } from '../icp/types';

export interface GeneratedEmail {
  subject: string;
  body: string;
}

export interface GeneratedEmailSequence {
  emails: [GeneratedEmail, GeneratedEmail, GeneratedEmail];
}

export interface SentEmail {
  id: string;
  user_id: string;
  recipient_email: string;
  recipient_name: string;
  subject: string;
  body: string;
  company_name: string;
  contact_name: string;
  status: 'sent' | 'failed';
  error_message: string | null;
  gmail_message_id: string | null;
  session_id: string | null;
  created_at: string;
}

export interface SendEmailRequest {
  to: string;
  subject: string;
  body: string;
  companyName: string;
  contactName: string;
  sessionId?: string;
}

export interface ComposeEmailParams {
  company: CompanyResult;
  contact: TargetContact;
  icp: ICPCriteria;
}
