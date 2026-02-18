import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormItem, Button, TextArea } from '@/components/ui';
import { StepContainer } from '@/components/layout/StepContainer';
import { AISuggestionModal } from '@/components/features/AISuggestionModal';
import { Toast } from '@/components/ui/Toast';
import { updateForm, resetForm, prevStep, setStep3Complete } from '@/store/applicationSlice';
import submitApplication from '@/services/api/submitApplication';
import { generateApplicationId, saveApplicationResponse } from '@/utils/applicationStorage';
import { generateSuggestion } from '@/services/openai';
import { getRequiredError } from '@/utils/validation';

const FIELDS = [
  { name: 'currentFinancialSituation', labelKey: 'form.currentFinancialSituation', promptKey: 'currentFinancialSituation' },
  { name: 'employmentCircumstances', labelKey: 'form.employmentCircumstances', promptKey: 'employmentCircumstances' },
  { name: 'reasonForApplying', labelKey: 'form.reasonForApplying', promptKey: 'reasonForApplying' },
];

const PROMPT_PREFIX = {
  currentFinancialSituation: 'I need to describe my current financial situation for a social support application. Help me write a clear description. Context: ',
  employmentCircumstances: 'I need to describe my employment circumstances for a social support application. Help me write a clear description. Context: ',
  reasonForApplying: 'I need to explain my reason for applying for financial assistance. Help me write a clear explanation. Context: ',
};

/** Build context string from Step 1 & 2 form state for AI prompts when fields are empty. */
function buildApplicantContext(formState, t) {
  const parts = [];
  // if (formState.name?.trim()) parts.push(`Name: ${formState.name.trim()}`);
  if (formState.maritalStatus) parts.push(`Marital status: ${t(`maritalStatus.${formState.maritalStatus}`) || formState.maritalStatus}`);
  if (formState.dependents != null && formState.dependents !== '') parts.push(`Dependents: ${formState.dependents}`);
  if (formState.employmentStatus) parts.push(`Employment: ${t(`employmentStatus.${formState.employmentStatus}`) || formState.employmentStatus}`);
  if (formState.monthlyIncome != null && formState.monthlyIncome !== '') parts.push(`Monthly income: ${formState.monthlyIncome}`);
  if (formState.housingStatus) parts.push(`Housing: ${t(`housingStatus.${formState.housingStatus}`) || formState.housingStatus}`);
  if (parts.length === 0) return '';
  return parts.join('. ');
}

export function Step3SituationDescriptions({ onPrev, onSubmitSuccess }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const application = useSelector((state) => state.application);
  const { formState: applicationForm } = application;

  const [modalOpen, setModalOpen] = useState(false);
  const [modalSuggestion, setModalSuggestion] = useState('');
  const [activeField, setActiveField] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      currentFinancialSituation: applicationForm.currentFinancialSituation,
      employmentCircumstances: applicationForm.employmentCircumstances,
      reasonForApplying: applicationForm.reasonForApplying,
    },
  });

  const handleHelpMeWrite = async (fieldName) => {
    const context = watch(fieldName) || '';
    const prefix = PROMPT_PREFIX[fieldName];
    const applicantContext = buildApplicantContext(applicationForm, t);
    const userPrompt = context.trim()
      ? `${prefix}${context}`
      : applicantContext
        ? `${prefix} Applicant context: ${applicantContext}. Help me write a brief, professional description for this section based on this.`
        : `I am applying for financial assistance. Help me write a brief, professional description for this section: ${prefix}`;

    setActiveField(fieldName);
    setModalSuggestion('');
    setModalOpen(true);
    setAiLoading(true);

    try {
      const suggestion = await generateSuggestion(userPrompt);
      setModalSuggestion(suggestion);
    } catch (err) {
      setModalOpen(false);
      if (err.code === 'TIMEOUT') {
        Toast.error(t('ai.timeout'));
      } else if (err.code === 'AUTH' || err.message?.includes('API key')) {
        Toast.error(t('ai.error'));
      } else {
        Toast.error(t('ai.error'));
      }
    } finally {
      setAiLoading(false);
    }
  };

  const handleAcceptSuggestion = (text) => {
    if (activeField) {
      setValue(activeField, text);
      setActiveField(null);
    }
    setModalOpen(false);
  };

  const onSubmit = async (data) => {
    dispatch(updateForm(data));
    dispatch(setStep3Complete(true));
    try {
      const payload = { ...applicationForm, ...data };
      await submitApplication(payload);
      const applicationId = generateApplicationId();
      saveApplicationResponse(applicationId, payload);
      Toast.success(t('toast.submitSuccess'));
      dispatch(resetForm());
      onSubmitSuccess?.();
    } catch {
      Toast.error(t('toast.submitError'));
    }
  };

  const onPrevious = () => {
    const values = watch();
    dispatch(updateForm(values));
    dispatch(prevStep());
    onPrev?.();
  };

  return (
    <StepContainer titleId="step3-title">
      <h2 id="step3-title" className="step-title">
        {t('steps.situationDescriptions')}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} role="form" aria-labelledby="step3-title">
        <Form layout="vertical" component="div">
          {FIELDS.map(({ name, labelKey }) => (
            <FormItem
              key={name}
              label={t(labelKey)}
              required
              validateStatus={errors[name] ? 'error' : ''}
              help={errors[name]?.message}
              extra={
                <Button
                  type="link"
                  size="small"
                  onClick={() => handleHelpMeWrite(name)}
                  loading={aiLoading && activeField === name}
                  aria-label={t('form.helpMeWrite')}
                  className="help-me-write-btn"
                >
                  {t('form.helpMeWrite')}
                </Button>
              }
            >
              <Controller
                name={name}
                control={control}
                rules={{ required: getRequiredError(t) }}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    rows={4}
                    placeholder={t(labelKey)}
                    aria-required="true"
                    aria-invalid={!!errors[name]}
                  />
                )}
              />
            </FormItem>
          ))}
          <div className="form-actions form-actions-between">
            <Button type="button" onClick={onPrevious} aria-label={t('actions.previous')}>
              {t('actions.previous')}
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
              aria-label={t('actions.submit')}
            >
              {t('actions.submit')}
            </Button>
          </div>
        </Form>
      </form>

      <AISuggestionModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setActiveField(null); }}
        suggestion={modalSuggestion}
        onAccept={handleAcceptSuggestion}
        loading={aiLoading}
      />
    </StepContainer>
  );
}

export default Step3SituationDescriptions;
