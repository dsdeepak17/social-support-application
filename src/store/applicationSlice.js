import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS, STEPS } from '@/constants';

const STORAGE_KEY = STORAGE_KEYS.APPLICATION_FORM;

const getInitialFormState = () => ({
  // Step 1: Personal Information
  name: '',
  nationalId: '',
  dateOfBirth: '',
  gender: '',
  address: '',
  city: '',
  state: '',
  country: '',
  phone: '',
  email: '',
  // Step 2: Family & Financial
  maritalStatus: '',
  dependents: 0,
  employmentStatus: '',
  monthlyIncome: '',
  housingStatus: '',
  // Step 3: Situation Descriptions
  currentFinancialSituation: '',
  employmentCircumstances: '',
  reasonForApplying: '',
});

const getInitialState = () => ({
  currentStep: STEPS.STEP_1,
  formState: getInitialFormState(),
  step1Complete: false,
  step2Complete: false,
  step3Complete: false,
});

const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Migrate old flat state to new shape
      if (parsed.formState != null) {
        return { ...getInitialState(), ...parsed };
      }
      const initial = getInitialState();
      initial.formState = { ...getInitialFormState(), ...parsed };
      if (typeof parsed.currentStep === 'number') initial.currentStep = parsed.currentStep;
      return initial;
    }
  // eslint-disable-next-line no-unused-vars
  } catch (_) {
    // ignore
  }
  return getInitialState();
};

const initialState = loadFromStorage();

const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    setStep(state, action) {
      state.currentStep = action.payload;
    },
    nextStep(state) {
      if (state.currentStep < STEPS.MAX_STEP) state.currentStep += 1;
    },
    prevStep(state) {
      if (state.currentStep > STEPS.MIN_STEP) state.currentStep -= 1;
    },
    updateField(state, action) {
      const { field, value } = action.payload;
      if (field in state.formState) state.formState[field] = value;
    },
    updateForm(state, action) {
      Object.assign(state.formState, action.payload);
    },
    resetForm() {
      return getInitialState();
    },
    setStep1Complete(state, action) {
      state.step1Complete = action.payload;
    },
    setStep2Complete(state, action) {
      state.step2Complete = action.payload;
    },
    setStep3Complete(state, action) {
      state.step3Complete = action.payload;
    },
  },
});

export const {
  setStep,
  nextStep,
  prevStep,
  updateField,
  updateForm,
  resetForm,
  setStep1Complete,
  setStep2Complete,
  setStep3Complete,
} = applicationSlice.actions;

export { STORAGE_KEY as APPLICATION_STORAGE_KEY };
export default applicationSlice.reducer;
