import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Select, FormItem, Button, InputNumber } from '@/components/ui';
import { StepContainer } from '@/components/layout/StepContainer';
import { nextStep, prevStep, updateForm, setStep2Complete } from '@/store/applicationSlice';
import { getRequiredError } from '@/utils/validation';

const MARITAL_OPTIONS = [
  { value: 'single', labelKey: 'maritalStatus.single' },
  { value: 'married', labelKey: 'maritalStatus.married' },
  { value: 'divorced', labelKey: 'maritalStatus.divorced' },
  { value: 'widowed', labelKey: 'maritalStatus.widowed' },
];

const EMPLOYMENT_OPTIONS = [
  { value: 'employed', labelKey: 'employmentStatus.employed' },
  { value: 'unemployed', labelKey: 'employmentStatus.unemployed' },
  { value: 'selfEmployed', labelKey: 'employmentStatus.selfEmployed' },
  { value: 'student', labelKey: 'employmentStatus.student' },
  { value: 'retired', labelKey: 'employmentStatus.retired' },
  { value: 'other', labelKey: 'employmentStatus.other' },
];

const HOUSING_OPTIONS = [
  { value: 'own', labelKey: 'housingStatus.own' },
  { value: 'rent', labelKey: 'housingStatus.rent' },
  { value: 'livingWithFamily', labelKey: 'housingStatus.livingWithFamily' },
  { value: 'homeless', labelKey: 'housingStatus.homeless' },
  { value: 'other', labelKey: 'housingStatus.other' },
];

export function Step2FamilyFinancial({ onNext, onPrev }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { formState: applicationForm } = useSelector((state) => state.application);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      maritalStatus: applicationForm.maritalStatus,
      dependents: applicationForm.dependents ?? 0,
      employmentStatus: applicationForm.employmentStatus,
      monthlyIncome: applicationForm.monthlyIncome ?? '',
      housingStatus: applicationForm.housingStatus,
    },
  });

  const onSubmit = (data) => {
    dispatch(updateForm({ ...data, dependents: Number(data.dependents) || 0 }));
    dispatch(setStep2Complete(true));
    dispatch(nextStep());
    onNext?.();
  };

  const onPrevious = () => {
    dispatch(prevStep());
    onPrev?.();
  };

  return (
    <StepContainer titleId="step2-title">
      <h2 id="step2-title" className="step-title">
        {t('steps.familyFinancial')}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} role="form" aria-labelledby="step2-title">
        <Form layout="vertical" component="div">
          <FormItem
            label={t('form.maritalStatus')}
            validateStatus={errors.maritalStatus ? 'error' : ''}
            help={errors.maritalStatus?.message}
          >
            <Controller
              name="maritalStatus"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder={t('form.maritalStatus')}
                  allowClear
                  options={MARITAL_OPTIONS.map((o) => ({ value: o.value, label: t(o.labelKey) }))}
                />
              )}
            />
          </FormItem>
          <FormItem
            label={t('form.dependents')}
            validateStatus={errors.dependents ? 'error' : ''}
            help={errors.dependents?.message}
          >
            <Controller
              name="dependents"
              control={control}
              rules={{ min: { value: 0, message: 'Must be 0 or more' } }}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  min={0}
                  placeholder={t('form.dependents')}
                  style={{ width: '100%' }}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </FormItem>
          <FormItem
            label={t('form.employmentStatus')}
            required
            validateStatus={errors.employmentStatus ? 'error' : ''}
            help={errors.employmentStatus?.message}
          >
            <Controller
              name="employmentStatus"
              control={control}
              rules={{ required: getRequiredError(t) }}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder={t('form.employmentStatus')}
                  options={EMPLOYMENT_OPTIONS.map((o) => ({ value: o.value, label: t(o.labelKey) }))}
                  aria-required="true"
                />
              )}
            />
          </FormItem>
          <FormItem
            label={t('form.monthlyIncome')}
            validateStatus={errors.monthlyIncome ? 'error' : ''}
            help={errors.monthlyIncome?.message}
          >
            <Controller
              name="monthlyIncome"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  min={0}
                  {...field}
                  placeholder={t('form.monthlyIncome')}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value === '' ? '' : e.target.value)}
                />
              )}
            />
          </FormItem>
          <FormItem
            label={t('form.housingStatus')}
            required
            validateStatus={errors.housingStatus ? 'error' : ''}
            help={errors.housingStatus?.message}
          >
            <Controller
              name="housingStatus"
              control={control}
              rules={{ required: getRequiredError(t) }}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder={t('form.housingStatus')}
                  options={HOUSING_OPTIONS.map((o) => ({ value: o.value, label: t(o.labelKey) }))}
                  aria-required="true"
                />
              )}
            />
          </FormItem>
          <div className="form-actions form-actions-between">
            <Button type="button" onClick={onPrevious} aria-label={t('actions.previous')}>
              {t('actions.previous')}
            </Button>
            <Button type="primary" htmlType="submit" aria-label={t('actions.next')}>
              {t('actions.next')}
            </Button>
          </div>
        </Form>
      </form>
    </StepContainer>
  );
}

export default Step2FamilyFinancial;
