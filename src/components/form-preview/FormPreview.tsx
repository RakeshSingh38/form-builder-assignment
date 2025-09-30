'use client';

import React, { useState, FormEvent } from 'react';
import { FormConfig, FormSubmission } from '../../types/form';
import { FieldFactory } from '../form-fields/FieldFactory';
import { validateFormWithZod, ValidationError } from '../../utils/zodValidation';
import { Check, AlertCircle } from 'lucide-react';

interface FormPreviewProps {
  formConfig: FormConfig;
  onSubmit?: (submission: FormSubmission) => void;
}

export const FormPreview = ({ formConfig, onSubmit }: FormPreviewProps) => {
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFieldChange = (fieldId: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    if (errors.some(e => e.fieldId === fieldId)) setErrors(prev => prev.filter(e => e.fieldId !== fieldId));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateFormWithZod(formConfig.fields, formData);
    setErrors(validationErrors);
    if (validationErrors.length > 0) return;

    setIsSubmitting(true);
    try {
      const submission: FormSubmission = { id: `submission_${Date.now()}`, formId: formConfig.id, data: formData, submittedAt: new Date() };
      if (onSubmit) await onSubmit(submission);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({});
    setErrors([]);
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="w-full h-[calc(100vh-10rem)] lg:h-[calc(100vh-15rem)] flex items-center justify-center p-3 lg:p-4 overflow-hidden">
        <div className="w-full max-w-4xl rounded-xl shadow-lg border-2 p-4 lg:p-8 text-center" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-success)', borderStyle: 'solid', borderWidth: '2px', boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}>
          <div className="mx-auto flex items-center justify-center h-16 w-16 lg:h-20 lg:w-20 rounded-full mb-4 lg:mb-6 relative" style={{
            background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
            boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)'
          }}>
            <Check
              className="h-8 w-8 lg:h-10 lg:w-10 text-white"
              style={{
                filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
                strokeWidth: '3'
              }}
            />
          </div>
          <h2 className="font-bold mb-3 lg:mb-4" style={{ color: 'var(--color-text)', fontSize: 'var(--font-size-xl)' }}>Form Submitted Successfully!</h2>
          <p className="mb-6 lg:mb-8" style={{ color: 'var(--color-textSecondary)', fontSize: 'var(--font-size-lg)' }}>Thank you for your submission.</p>
          <button onClick={handleReset} className="px-6 lg:px-8 py-2.5 lg:py-3 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 shadow-lg" style={{ backgroundColor: 'var(--color-primary)', fontFamily: 'var(--font-family)', fontSize: 'var(--font-size-lg)' }}>Submit Another Response</button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-0 lg:p-2 flex justify-center pb-20">
      <div className="w-full max-w-full lg:max-w-4xl lg:rounded-xl lg:shadow-lg lg:border-2 lg:p-6 preview-container" style={{ borderColor: 'var(--color-border)', borderStyle: 'solid' }}>
        <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-6">
          <div className="mb-8 lg:mb-8 px-4 lg:px-4 pt-6 lg:pt-0">
            <h1 className="font-normal lg:font-bold mb-4 lg:mb-2 break-words hyphens-auto" style={{ color: 'var(--color-text)', fontSize: formConfig.titleStyle?.fontSize || 'var(--font-size-2xl)', fontFamily: formConfig.titleStyle?.fontFamily || 'var(--font-family)', fontWeight: formConfig.titleStyle?.fontWeight || '400', textAlign: formConfig.titleStyle?.textAlign || 'left', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
              {formConfig.title}
            </h1>
            {formConfig.description && (
              <p className="break-words hyphens-auto leading-relaxed" style={{ color: 'var(--color-textSecondary)', fontSize: formConfig.descriptionStyle?.fontSize || 'var(--font-size-lg)', fontFamily: formConfig.descriptionStyle?.fontFamily || 'var(--font-family)', fontWeight: formConfig.descriptionStyle?.fontWeight || '400', textAlign: formConfig.descriptionStyle?.textAlign || 'left', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                {formConfig.description}
              </p>
            )}
          </div>

          {errors.length > 0 && (
            <div className="mb-6 p-4 rounded-lg border-l-4" style={{ backgroundColor: 'var(--color-error)', borderLeftColor: 'var(--color-error)', color: 'white' }}>
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <h3 className="font-semibold">Please fix the following errors:</h3>
              </div>
              <ul className="mt-2 ml-7 list-disc">
                {errors.map((error, index) => <li key={index} style={{ fontSize: 'var(--font-size-sm)' }}>{error.message}</li>)}
              </ul>
            </div>
          )}

          <div className="space-y-6 lg:space-y-4 px-4 lg:p-4 lg:rounded-lg" style={{ backgroundColor: 'var(--color-surface)' }}>
            {formConfig.fields.map((field) => (
              <div key={field.id} className="lg:p-4 lg:rounded-lg lg:border-2 lg:shadow-sm" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)', borderStyle: 'solid', borderWidth: '0px' }}>
                <FieldFactory field={field} value={formData[field.id]} onChange={(value) => handleFieldChange(field.id, value)} error={errors.find(e => e.fieldId === field.id)?.message} theme={formConfig.theme} mode="preview" />
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-6 px-4 lg:px-0">
            <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto px-8 lg:px-12 py-3 lg:py-4 text-white font-medium lg:font-semibold rounded-md lg:rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 shadow-sm lg:shadow-lg" style={{ backgroundColor: 'var(--color-primary)', fontFamily: 'var(--font-family)', fontSize: 'var(--font-size-lg)' }}>
              {isSubmitting ? 'Submitting...' : formConfig.settings.submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};