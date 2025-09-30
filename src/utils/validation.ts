import { FormField } from '@/types/form';

export interface ValidationError {
  fieldId: string;
  message: string;
}

// Helper functions for cleaner code
const getMessage = (field: FormField, defaultMsg: string) => field.validation?.message || defaultMsg;
const isEmpty = (value: unknown) => !value || (Array.isArray(value) && value.length === 0) || value === '';

const validateRequired = (field: FormField, value: unknown): string | null => {
  if (!field.required) return null;

  if (isEmpty(value)) return getMessage(field, `${field.label} is required`);

  // Special cases for different field types
  if (field.type === 'radio' && (!value || value === '')) return getMessage(field, `${field.label} is required`);
  if (field.type === 'select' && (!value || value === '' || (Array.isArray(value) && value.length === 0))) {
    return getMessage(field, `${field.label} is required`);
  }

  return null;
};

const validateString = (field: FormField, value: string): string | null => {
  const { validation } = field;

  if (validation?.min !== undefined && value.length < validation.min) {
    return getMessage(field, `Text must be at least ${validation.min} characters`);
  }
  if (validation?.max !== undefined && value.length > validation.max) {
    return getMessage(field, `Text must be at most ${validation.max} characters`);
  }
  if (validation?.pattern && !new RegExp(validation.pattern).test(value)) {
    return getMessage(field, 'Please enter a valid format');
  }

  return null;
};

const validateEmail = (field: FormField, value: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value) ? null : getMessage(field, 'Please enter a valid email address');
};

const validateNumber = (field: FormField, value: unknown): string | null => {
  const numValue = Number(value);
  const { validation } = field;

  if (isNaN(numValue)) return getMessage(field, 'Please enter a valid number');
  if (validation?.min !== undefined && numValue < validation.min) {
    return getMessage(field, `Value must be at least ${validation.min}`);
  }
  if (validation?.max !== undefined && numValue > validation.max) {
    return getMessage(field, `Value must be at most ${validation.max}`);
  }

  return null;
};

const validateDate = (field: FormField, value: string): string | null => {
  const dateValue = new Date(value);
  const { validation } = field;

  if (isNaN(dateValue.getTime())) return getMessage(field, 'Please enter a valid date');

  if (validation?.min && dateValue < new Date(validation.min)) {
    return getMessage(field, `Date must be after ${new Date(validation.min).toLocaleDateString()}`);
  }
  if (validation?.max && dateValue > new Date(validation.max)) {
    return getMessage(field, `Date must be before ${new Date(validation.max).toLocaleDateString()}`);
  }

  return null;
};

const validateFile = (field: FormField, value: File): string | null => {
  if (!field.accept) return null;

  const acceptedTypes = field.accept.split(',').map(type => type.trim());
  const fileExtension = '.' + value.name.split('.').pop()?.toLowerCase();
  const mimeType = value.type;

  const isAccepted = acceptedTypes.some(acceptedType => {
    if (acceptedType.startsWith('.')) return fileExtension === acceptedType;
    if (acceptedType.includes('/')) return mimeType === acceptedType || mimeType.startsWith(acceptedType.replace('*', ''));
    return false;
  });

  return isAccepted ? null : `File type not accepted. Accepted types: ${field.accept}`;
};

const validateTypeSpecific = (field: FormField, value: unknown): string | null => {
  if (isEmpty(value)) return null;

  switch (field.type) {
    case 'email':
      return typeof value === 'string' ? validateEmail(field, value) : null;

    case 'password':
    case 'text':
    case 'textarea':
      return typeof value === 'string' ? validateString(field, value) : null;

    case 'number':
      return validateNumber(field, value);

    case 'date':
      return typeof value === 'string' ? validateDate(field, value) : null;

    case 'file':
      return value instanceof File ? validateFile(field, value) : null;

    default:
      return null;
  }
};

export const validateField = (field: FormField, value: unknown): string | null => {
  return validateRequired(field, value) || validateTypeSpecific(field, value);
};

export const validateForm = (fields: FormField[], formData: Record<string, unknown>): ValidationError[] => {
  return fields.reduce((errors, field) => {
    const error = validateField(field, formData[field.id]);
    return error ? [...errors, { fieldId: field.id, message: error }] : errors;
  }, [] as ValidationError[]);
};

export const getFieldError = (fieldId: string, errors: ValidationError[]): string | null => {
  return errors.find(e => e.fieldId === fieldId)?.message || null;
};
