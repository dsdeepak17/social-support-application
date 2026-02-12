import { useTranslation } from 'react-i18next';
import { Progress } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setStep } from '@/store/applicationSlice';
import { Toast } from '@/components/ui';
import { STEPS } from '@/constants';

/**
 * Progress bar for the 3-step application wizard.
 * Accessible: role and aria attributes for screen readers.
 */
export function ProgressBar({ currentStep }) {
  const { t } = useTranslation();
  const percent = (currentStep / STEPS.MAX_STEP) * 100;
  const dispatch = useDispatch();
  const step1Complete = useSelector((state) => state.application.step1Complete);
  const step2Complete = useSelector((state) => state.application.step2Complete);

  const goToStep = (step) => {
    if (step === STEPS.STEP_2) {
      if (!step1Complete) {
        Toast.error(t('errors.completePreviousStep'));
        return;
      }
    } else if (step === STEPS.STEP_3) {
      if (!step2Complete) {
        Toast.error(t('errors.completePreviousStep'));
        return;
      }
    }
    dispatch(setStep(step));
  };


  return (
    <div
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={STEPS.MIN_STEP}
      aria-valuemax={STEPS.MAX_STEP}
      aria-label={t('steps.personalInfo')}
      className="progress-bar-wrapper"
    >
      <div className="progress-steps" role="list">
        {STEPS.STEP_CONFIG.map(({ key, step }) => (
          <div
            key={key}
            role="listitem"
            className={`progress-step ${currentStep >= step ? 'active' : ''} ${currentStep === step ? 'current' : ''}`}
            aria-current={currentStep === step ? 'step' : undefined}
          >
            <span className="progress-step-dot" aria-hidden="true" onClick={() => goToStep(step)} />
            <span className="progress-step-label">{t(`steps.${key}`)}</span>
          </div>
        ))}
      </div>
      <Progress
        percent={percent}
        showInfo={false}
        strokeColor="var(--primary-color, #1677ff)"
        className="progress-line"
      />
    </div>
  );
}

export default ProgressBar;
