export enum Status {
  ok = 'OK',
  error = 'ERROR',
}

export interface StatusMessage {
  status: Status;
  message: string;
}

export enum LogMessage {
  error = 'Ooops, something went wrong. Please try again.',
  updateSuccess = 'Successfully updated!',
  success = 'Success!',
  saved = 'Successfully saved!',
  notFound = 'Not Found',
}

export enum NotificationType {
  info = 'info',
  warning = 'warning',
  success = 'success',
  failure = 'error',
}

export enum PasswordRecoveryStep {
  initiate = 'initiate',
  emailSent = 'email-sent',
}
