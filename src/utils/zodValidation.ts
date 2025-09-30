import { z } from 'zod';
import { FormField } from '@/types/form';

export interface ValidationError {
    fieldId: string;
    message: string;
}

// Helper functions for cleaner code
const getMessage = (field: FormField, defaultMsg: string) => field.validation?.message || defaultMsg;

const createStringSchema = (field: FormField) => {
    let schema = z.string();
    const { validation } = field;

    if (validation?.min !== undefined) schema = schema.min(validation.min, getMessage(field, `Text must be at least ${validation.min} characters`));
    if (validation?.max !== undefined) schema = schema.max(validation.max, getMessage(field, `Text must be at most ${validation.max} characters`));
    if (validation?.pattern) schema = z.string().regex(new RegExp(validation.pattern), getMessage(field, 'Please enter a valid format'));

    return schema;
};

const createNumberSchema = (field: FormField) => {
    let schema = z.number({ message: 'Please enter a valid number' });
    const { validation } = field;

    if (validation?.min !== undefined) schema = schema.min(validation.min, `Value must be at least ${validation.min}`);
    if (validation?.max !== undefined) schema = schema.max(validation.max, `Value must be at most ${validation.max}`);

    return schema;
};

const createDateSchema = (field: FormField) => {
    let schema = z.string().refine((val) => !isNaN(new Date(val).getTime()), 'Please enter a valid date');
    const { validation } = field;

    if (validation?.min) {
        const minDate = new Date(validation.min.toString());
        schema = schema.refine((val) => new Date(val) >= minDate, `Date must be after ${minDate.toLocaleDateString()}`);
    }
    if (validation?.max) {
        const maxDate = new Date(validation.max.toString());
        schema = schema.refine((val) => new Date(val) <= maxDate, `Date must be before ${maxDate.toLocaleDateString()}`);
    }

    return schema;
};

const createFileSchema = (field: FormField) => {
    return z.any().refine((val) => {
        if (!val) return !field.required;
        if (!(val instanceof File)) return false;

        if (!field.accept || field.accept === '*/*') return true;

        const acceptedTypes = field.accept.split(',').map(type => type.trim());
        const fileExtension = '.' + val.name.split('.').pop()?.toLowerCase();
        const mimeType = val.type.toLowerCase();

        return acceptedTypes.some(acceptedType => {
            if (acceptedType.startsWith('.')) return fileExtension === acceptedType.toLowerCase();
            if (acceptedType.includes('/')) return mimeType === acceptedType.toLowerCase() || mimeType.startsWith(acceptedType.toLowerCase());
            return false;
        });
    }, getMessage(field, 'Please select a valid file type'));
};

const createEmailSchema = (field: FormField) => {
    const schema = z.string();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Use custom email validation if enabled
    const emailValidationEnabled = field.validation?.email !== false; // Default to true if not specified
    const customEmailMessage = field.validation?.emailMessage || 'Please enter a valid email address';

    if (emailValidationEnabled) {
        return schema
            .refine((val) => val && val.trim().length > 0, getMessage(field, `${field.label} is required`))
            .refine((val) => !val || val.trim().length === 0 || emailRegex.test(val), customEmailMessage);
    } else {
        // If email validation is disabled, just check if it's required
        return schema.refine((val) => val && val.trim().length > 0, getMessage(field, `${field.label} is required`));
    }
};

const createBaseSchema = (field: FormField): z.ZodTypeAny => {
    switch (field.type) {
        case 'text':
        case 'textarea':
            return createStringSchema(field);
        case 'email':
            return createEmailSchema(field);
        case 'password':
            return createStringSchema(field);
        case 'number':
            return createNumberSchema(field);
        case 'date':
            return createDateSchema(field);
        case 'select':
            return field.multiple ? z.array(z.string()) : z.string();
        case 'radio':
            return z.string();
        case 'checkbox':
            return z.array(z.string());
        case 'file':
            return createFileSchema(field);
        default:
            return z.string();
    }
};

const addRequiredValidation = (field: FormField, schema: z.ZodTypeAny): z.ZodTypeAny => {
    if (!field.required) {
        return field.type === 'checkbox' || (field.type === 'select' && field.multiple)
            ? z.array(z.string()).optional()
            : schema.optional();
    }

    switch (field.type) {
        case 'checkbox':
            if (field.multiple === true) {
                return (schema as z.ZodArray<z.ZodString>).min(1, getMessage(field, `${field.label} is required`));
            } else {
                return field.required
                    ? (schema as z.ZodArray<z.ZodString>).length(1, getMessage(field, `${field.label} is required`))
                    : (schema as z.ZodArray<z.ZodString>).max(1, getMessage(field, `Please select only one option`));
            }
        case 'select':
            return field.multiple
                ? (schema as z.ZodArray<z.ZodString>).min(1, getMessage(field, `${field.label} is required`))
                : (schema as z.ZodString).refine((val) => val && val.trim().length > 0, getMessage(field, `${field.label} is required`));
        case 'file':
            return z.any().refine((val) => val && val instanceof File, getMessage(field, `${field.label} is required`));
        case 'number':
            return (schema as z.ZodNumber).refine((val) => val !== undefined && !isNaN(val), getMessage(field, `${field.label} is required`));
        default:
            return field.type === 'email'
                ? schema // Email validation already includes required check
                : (schema as z.ZodString).refine((val) => val && val.trim().length > 0, getMessage(field, `${field.label} is required`));
    }
};

export const createZodSchema = (fields: FormField[]) => {
    const schemaFields = fields.reduce((acc, field) => {
        const baseSchema = createBaseSchema(field);
        acc[field.id] = addRequiredValidation(field, baseSchema);
        return acc;
    }, {} as Record<string, z.ZodTypeAny>);

    return z.object(schemaFields);
};

const transformValue = (field: FormField, value: unknown): unknown => {
    const isEmpty = !value || value === '';

    if (field.type === 'checkbox') return Array.isArray(value) ? value : [];
    if (field.type === 'select' && field.multiple) return Array.isArray(value) ? value : [];
    if (field.type === 'number') return isEmpty ? (field.required ? NaN : undefined) : Number(value);
    if (field.type === 'file') return field.required ? (value || null) : value;

    return isEmpty ? undefined : value;
};

export const validateFormWithZod = (fields: FormField[], formData: Record<string, unknown>): ValidationError[] => {
    const schema = createZodSchema(fields);
    const errors: ValidationError[] = [];

    try {
        const transformedData = fields.reduce((acc, field) => {
            acc[field.id] = transformValue(field, formData[field.id]);
            return acc;
        }, {} as Record<string, unknown>);

        schema.parse(transformedData);
    } catch (error) {
        if (error instanceof z.ZodError) {
            error.issues?.forEach(err => {
                errors.push({
                    fieldId: err.path[0] as string,
                    message: err.message,
                });
            });
        }
    }

    return errors;
};

export const getFieldError = (fieldId: string, errors: ValidationError[]): string | null => {
    const error = errors.find(e => e.fieldId === fieldId);
    return error ? error.message : null;
};

