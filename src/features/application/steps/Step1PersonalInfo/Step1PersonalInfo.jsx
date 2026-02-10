import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Select, FormItem, Button } from '@/components/ui';
import { StepContainer } from '@/components/layout/StepContainer';
import { nextStep, updateForm, setStep1Complete } from '@/store/applicationSlice';
import { validationRules, getRequiredError, getEmailError, getPhoneError } from '@/utils/validation';

const GENDER_OPTIONS = [
  { value: 'male', labelKey: 'gender.male' },
  { value: 'female', labelKey: 'gender.female' },
  { value: 'other', labelKey: 'gender.other' },
  { value: 'preferNotToSay', labelKey: 'gender.preferNotToSay' },
];

export function Step1PersonalInfo({ onNext }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { formState: applicationForm } = useSelector((state) => state.application);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: applicationForm.name,
      nationalId: applicationForm.nationalId,
      dateOfBirth: applicationForm.dateOfBirth,
      gender: applicationForm.gender,
      address: applicationForm.address,
      city: applicationForm.city,
      state: applicationForm.state,
      country: applicationForm.country,
      phone: applicationForm.phone,
      email: applicationForm.email,
    },
  });

  const onSubmit = (data) => {
    dispatch(updateForm(data));
    dispatch(setStep1Complete(true));
    dispatch(nextStep());
    onNext?.();
  };

  return (
    <StepContainer titleId="step1-title">
      <h2 id="step1-title" className="step-title">
        {t('steps.personalInfo')}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} role="form" aria-labelledby="step1-title">
      <Form layout="vertical" component="div">
        <FormItem
          label={t('form.name')}
          required
          validateStatus={errors.name ? 'error' : ''}
          help={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            rules={{
              required: getRequiredError(t),
            }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder={t('form.name')}
                aria-required="true"
                aria-invalid={!!errors.name}
              />
            )}
          />
        </FormItem>
        <FormItem
          label={t('form.nationalId')}
          required
          validateStatus={errors.nationalId ? 'error' : ''}
          help={errors.nationalId?.message}
        >
          <Controller
            name="nationalId"
            control={control}
            rules={{ required: getRequiredError(t) }}
            render={({ field }) => (
              <Input {...field} placeholder={t('form.nationalId')} aria-required="true" aria-invalid={!!errors.nationalId} />
            )}
          />
        </FormItem>
        <FormItem
          label={t('form.dateOfBirth')}
          required
          validateStatus={errors.dateOfBirth ? 'error' : ''}
          help={errors.dateOfBirth?.message}
        >
          <Controller
            name="dateOfBirth"
            control={control}
            rules={{ required: getRequiredError(t) }}
            render={({ field }) => (
              <Input
                type="date"
                {...field}
                aria-required="true"
                aria-invalid={!!errors.dateOfBirth}
              />
            )}
          />
        </FormItem>
        <FormItem
          label={t('form.gender')}
          validateStatus={errors.gender ? 'error' : ''}
          help={errors.gender?.message}
        >
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                placeholder={t('form.gender')}
                allowClear
                options={GENDER_OPTIONS.map((o) => ({ value: o.value, label: t(o.labelKey) }))}
                aria-invalid={!!errors.gender}
              />
            )}
          />
        </FormItem>
        <FormItem
          label={t('form.address')}
          required
          validateStatus={errors.address ? 'error' : ''}
          help={errors.address?.message}
        >
          <Controller
            name="address"
            control={control}
            rules={{ required: getRequiredError(t) }}
            render={({ field }) => (
              <Input {...field} placeholder={t('form.address')} aria-required="true" aria-invalid={!!errors.address} />
            )}
          />
        </FormItem>
        <div className="form-row">
          <FormItem
            label={t('form.city')}
            required
            validateStatus={errors.city ? 'error' : ''}
            help={errors.city?.message}
          >
            <Controller
              name="city"
              control={control}
              rules={{ required: getRequiredError(t) }}
              render={({ field }) => (
                <Input {...field} placeholder={t('form.city')} aria-required="true" aria-invalid={!!errors.city} />
              )}
            />
          </FormItem>
          <FormItem
            label={t('form.state')}
            validateStatus={errors.state ? 'error' : ''}
            help={errors.state?.message}
          >
            <Controller
              name="state"
              control={control}
              render={({ field }) => <Input {...field} placeholder={t('form.state')} />}
            />
          </FormItem>
        </div>
        <FormItem
          label={t('form.country')}
          required
          validateStatus={errors.country ? 'error' : ''}
          help={errors.country?.message}
        >
          <Controller
            name="country"
            control={control}
            rules={{ required: getRequiredError(t) }}
            render={({ field }) => (
              <Input {...field} placeholder={t('form.country')} aria-required="true" aria-invalid={!!errors.country} />
            )}
          />
        </FormItem>
        <FormItem
          label={t('form.phone')}
          required
          validateStatus={errors.phone ? 'error' : ''}
          help={errors.phone?.message}
        >
          <Controller
            name="phone"
            control={control}
            rules={{
              required: getRequiredError(t),
              validate: (v) => validationRules.phone(v) || getPhoneError(t),
            }}
            render={({ field }) => (
              <Input {...field} placeholder={t('form.phone')} aria-required="true" aria-invalid={!!errors.phone} />
            )}
          />
        </FormItem>
        <FormItem
          label={t('form.email')}
          required
          validateStatus={errors.email ? 'error' : ''}
          help={errors.email?.message}
        >
          <Controller
            name="email"
            control={control}
            rules={{
              required: getRequiredError(t),
              validate: (v) => validationRules.email(v) || getEmailError(t),
            }}
            render={({ field }) => (
              <Input
                type="email"
                {...field}
                placeholder={t('form.email')}
                aria-required="true"
                aria-invalid={!!errors.email}
              />
            )}
          />
        </FormItem>
        <div className="form-actions">
          <Button type="primary" htmlType="submit" aria-label={t('actions.next')}>
            {t('actions.next')}
          </Button>
        </div>
      </Form>
      </form>
    </StepContainer>
  );
}

export default Step1PersonalInfo;
