import React, { ReactNode } from 'react';

// Form Container
export const Form: React.FC<React.FormHTMLAttributes<HTMLFormElement>> = ({ children, className = '', ...props }) => {
  return (
    <form className={`space-y-6 ${className}`} {...props}>
      {children}
    </form>
  );
};

// Form Section
interface FormSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({ title, description, children, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {(title || description) && (
        <div>
          {title && <h3 className="text-lg font-medium text-navy">{title}</h3>}
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

// Form Group
interface FormGroupProps {
  children: ReactNode;
  className?: string;
}

export const FormGroup: React.FC<FormGroupProps> = ({ children, className = '' }) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {children}
    </div>
  );
};

// Form Row (for horizontal layout)
interface FormRowProps {
  children: ReactNode;
  className?: string;
}

export const FormRow: React.FC<FormRowProps> = ({ children, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      {children}
    </div>
  );
};

// Form Label
interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const FormLabel: React.FC<FormLabelProps> = ({ children, required = false, className = '', ...props }) => {
  return (
    <label className={`block text-sm font-medium text-gray-700 ${className}`} {...props}>
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};

// Form Input
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const FormInput: React.FC<FormInputProps> = ({ error, className = '', ...props }) => {
  return (
    <div>
      <input
        className={`w-full rounded-md shadow-sm border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

// Form Textarea
interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const FormTextarea: React.FC<FormTextareaProps> = ({ error, className = '', ...props }) => {
  return (
    <div>
      <textarea
        className={`w-full rounded-md shadow-sm border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

// Form Select
interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  options: { value: string; label: string }[];
}

export const FormSelect: React.FC<FormSelectProps> = ({ error, options, className = '', ...props }) => {
  return (
    <div>
      <select
        className={`w-full rounded-md shadow-sm border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

// Form Checkbox
interface FormCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
}

export const FormCheckbox: React.FC<FormCheckboxProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div>
      <div className="flex items-center">
        <input
          type="checkbox"
          className={`h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded ${error ? 'border-red-500' : ''} ${className}`}
          {...props}
        />
        <label htmlFor={props.id} className="ml-2 block text-sm text-gray-700">
          {label}
        </label>
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

// Form Radio
interface FormRadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
}

export const FormRadio: React.FC<FormRadioProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div>
      <div className="flex items-center">
        <input
          type="radio"
          className={`h-4 w-4 text-primary focus:ring-primary border-gray-300 ${error ? 'border-red-500' : ''} ${className}`}
          {...props}
        />
        <label htmlFor={props.id} className="ml-2 block text-sm text-gray-700">
          {label}
        </label>
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

// Form Error
interface FormErrorProps {
  children: ReactNode;
  className?: string;
}

export const FormError: React.FC<FormErrorProps> = ({ children, className = '' }) => {
  if (!children) return null;
  
  return (
    <p className={`mt-2 text-sm text-red-500 ${className}`}>
      {children}
    </p>
  );
};

// Form Helper Text
interface FormHelperTextProps {
  children: ReactNode;
  className?: string;
}

export const FormHelperText: React.FC<FormHelperTextProps> = ({ children, className = '' }) => {
  return (
    <p className={`mt-2 text-sm text-gray-500 ${className}`}>
      {children}
    </p>
  );
};

// Form Actions
interface FormActionsProps {
  children: ReactNode;
  className?: string;
}

export const FormActions: React.FC<FormActionsProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex items-center justify-end space-x-3 ${className}`}>
      {children}
    </div>
  );
};