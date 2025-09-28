export interface FormField {
    id: string;
    type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'file';
    label: string;
    placeholder?: string;
    required?: boolean;
    validation?: {
        min?: number;
        max?: number;
        pattern?: string;
        message?: string;
        email?: boolean;
        emailMessage?: string;
    };
    options?: string[]; // For select, radio, checkbox
    multiple?: boolean; // For select, checkbox
    rows?: number; // For textarea
    accept?: string; // For file input
}

export interface FormTheme {
    id: string;
    name: string;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        surface: string;
        text: string;
        textSecondary: string;
        border: string;
        success: string;
        warning: string;
        error: string;
    };
    typography: {
        fontFamily: string;
        fontSize: {
            xs: string;
            sm: string;
            base: string;
            lg: string;
            xl: string;
            '2xl': string;
        };
        fontWeight: {
            light: string;
            normal: string;
            medium: string;
            semibold: string;
            bold: string;
        };
    };
    spacing: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };
    borderRadius: {
        sm: string;
        md: string;
        lg: string;
    };
}

export interface FormConfig {
    id: string;
    title: string;
    description?: string;
    titleStyle?: {
        fontSize: string;
        fontFamily: string;
        fontWeight: string;
        textAlign: 'left' | 'center' | 'right';
    };
    descriptionStyle?: {
        fontSize: string;
        fontFamily: string;
        fontWeight: string;
        textAlign: 'left' | 'center' | 'right';
    };
    fields: FormField[];
    theme: FormTheme;
    settings: {
        submitText: string;
        showProgress: boolean;
        allowMultipleSubmissions: boolean;
    };
}

export interface FormSubmission {
    id: string;
    formId: string;
    data: Record<string, unknown>;
    submittedAt: Date;
}

export type FormMode = 'edit' | 'preview';
