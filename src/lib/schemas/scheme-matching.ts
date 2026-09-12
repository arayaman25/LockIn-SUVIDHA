import { z } from 'zod';

export const intentEnum = z.enum([
  'business_loan',
  'education_loan',
  'skill_training',
]);

export const genderEnum = z.enum(['male', 'female', 'other']);

export const educationStatusEnum = z.enum([
  'none',
  'secondary',
  'graduate',
  'postgraduate',
]);

// Helper for preprocess numeric inputs that might produce NaN or empty strings from HTML inputs
const sanitizeNumber = (val: unknown): number | undefined => {
  if (val === '' || val === null || val === undefined) return undefined;
  const num = Number(val);
  return Number.isNaN(num) ? undefined : num;
};

// Helper for preprocess string inputs
const sanitizeString = (val: unknown): string | undefined => {
  if (typeof val !== 'string') return undefined;
  const trimmed = val.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

export const baseCitizenProfileSchema = z.object({
  isScheduledCaste: z.boolean(),
  age: z
    .preprocess(
      sanitizeNumber,
      z
        .number()
        .int('Age must be a whole number')
        .min(18, 'Age must be at least 18 years')
        .max(120, 'Age must be 120 or under')
    ),
  gender: genderEnum,
  annualFamilyIncome: z
    .preprocess(
      sanitizeNumber,
      z.number().nonnegative('Annual family income cannot be negative')
    ),
  state: z.string().trim().min(1, 'State of domicile is required'),
  district: z.string().trim().min(1, 'District is required'),
  occupationCategory: z.string().trim().min(1, 'Occupation category is required').optional(),
  occupationType: z.string().trim().min(1, 'Occupation type is required').optional(),
  customOccupation: z.preprocess(sanitizeString, z.string().optional()),
  estimatedProjectCost: z.preprocess(
    sanitizeNumber,
    z.number().positive('Estimated project cost must be greater than 0').optional()
  ),
  latitude: z
    .preprocess(
      sanitizeNumber,
      z.number().min(-90, 'Latitude must be >= -90').max(90, 'Latitude must be <= 90').optional()
    ),
  longitude: z
    .preprocess(
      sanitizeNumber,
      z.number().min(-180, 'Longitude must be >= -180').max(180, 'Longitude must be <= 180').optional()
    ),
});

export const businessProfileSchema = baseCitizenProfileSchema.extend({
  intent: z.literal('business_loan'),
  projectType: z
    .string()
    .trim()
    .min(1, 'Project / Enterprise type is required'),
  requiredLoanAmount: z
    .preprocess(
      sanitizeNumber,
      z.number().positive('Required loan amount must be greater than 0')
    ),
  educationStatus: z.preprocess(
    (val) => (!val || val === '' || val === 'ongoing' ? undefined : val),
    educationStatusEnum.optional()
  ),
  course: z.preprocess(sanitizeString, z.string().optional()),
});

export const educationProfileSchema = baseCitizenProfileSchema.extend({
  intent: z.literal('education_loan'),
  projectType: z.preprocess(sanitizeString, z.string().optional()),
  requiredLoanAmount: z
    .preprocess(
      sanitizeNumber,
      z.number().positive('Required loan amount must be greater than 0')
    ),
  educationStatus: educationStatusEnum,
  course: z
    .string()
    .trim()
    .min(1, 'Course of study is required (e.g. B.Tech, MBBS, MBA)'),
});

export const skillTrainingProfileSchema = baseCitizenProfileSchema.extend({
  intent: z.literal('skill_training'),
  projectType: z.preprocess(sanitizeString, z.string().optional()),
  requiredLoanAmount: z.preprocess(
    sanitizeNumber,
    z.number().positive('Required loan amount must be greater than 0').optional()
  ),
  educationStatus: z.preprocess(
    (val) => (!val || val === '' || val === 'ongoing' ? undefined : val),
    educationStatusEnum.optional()
  ),
  course: z.preprocess(sanitizeString, z.string().optional()),
});

export const citizenProfileSchema = z.discriminatedUnion('intent', [
  businessProfileSchema,
  educationProfileSchema,
  skillTrainingProfileSchema,
]);

export type CitizenProfileFormValues = {
  intent: 'business_loan' | 'education_loan' | 'skill_training';
  isScheduledCaste: boolean;
  age: number;
  gender: 'male' | 'female' | 'other';
  annualFamilyIncome: number;
  state: string;
  district: string;
  occupationCategory: string;
  occupationType: string;
  customOccupation?: string;
  projectType?: string;
  estimatedProjectCost?: number;
  requiredLoanAmount?: number;
  educationStatus?: 'none' | 'secondary' | 'graduate' | 'postgraduate';
  course?: string;
  institution?: string;
  skillCategory?: string;
  preferredDuration?: string;
  latitude?: number;
  longitude?: number;
};

// Form schema with conditional refinement across steps
export const schemeMatchingFormSchema = z
  .object({
    intent: intentEnum,
    isScheduledCaste: z.boolean(),
    age: z
      .preprocess(
        sanitizeNumber,
        z
          .number()
          .int('Age must be a whole number')
          .min(18, 'Age must be at least 18')
          .max(120, 'Age must be 120 or under')
      ),
    gender: genderEnum,
    annualFamilyIncome: z
      .preprocess(
        sanitizeNumber,
        z.number().nonnegative('Income cannot be negative')
      ),
    state: z.string().trim().min(1, 'State is required'),
    district: z.string().trim().min(1, 'District is required'),
    occupationCategory: z.preprocess(sanitizeString, z.string().optional()),
    occupationType: z.preprocess(sanitizeString, z.string().optional()),
    customOccupation: z.preprocess(sanitizeString, z.string().optional()),
    projectType: z.preprocess(sanitizeString, z.string().optional()),
    estimatedProjectCost: z.preprocess(
      sanitizeNumber,
      z.number().positive('Estimated project cost must be greater than 0').optional()
    ),
    requiredLoanAmount: z.preprocess(
      sanitizeNumber,
      z.number().positive('Required loan amount must be greater than 0').optional()
    ),
    educationStatus: z.preprocess(
      (val) => (!val || val === '' || val === 'ongoing' ? undefined : val),
      educationStatusEnum.optional()
    ),
    course: z.preprocess(sanitizeString, z.string().optional()),
    institution: z.preprocess(sanitizeString, z.string().optional()),
    skillCategory: z.preprocess(sanitizeString, z.string().optional()),
    preferredDuration: z.preprocess(sanitizeString, z.string().optional()),
    latitude: z.preprocess(sanitizeNumber, z.number().min(-90).max(90).optional()),
    longitude: z.preprocess(sanitizeNumber, z.number().min(-180).max(180).optional()),
  })
  .superRefine((data, ctx) => {
    if (data.intent === 'business_loan') {
      if (!data.projectType || data.projectType.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['projectType'],
          message: 'Project / Trade type is required for business assistance',
        });
      }
      if (data.requiredLoanAmount === undefined || data.requiredLoanAmount <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['requiredLoanAmount'],
          message: 'Required loan amount must be greater than 0',
        });
      }
    }

    if (data.intent === 'education_loan') {
      if (!data.course || data.course.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['course'],
          message: 'Course of study is required for education loan',
        });
      }
      if (!data.educationStatus) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['educationStatus'],
          message: 'Current education level is required',
        });
      }
      if (data.requiredLoanAmount === undefined || data.requiredLoanAmount <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['requiredLoanAmount'],
          message: 'Required loan amount must be greater than 0',
        });
      }
    }
  });
