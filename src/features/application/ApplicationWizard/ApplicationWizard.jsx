import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ProgressBar } from '@/components/layout/ProgressBar';
import { Step1PersonalInfo } from '@/features/application/steps/Step1PersonalInfo';
import { Step2FamilyFinancial } from '@/features/application/steps/Step2FamilyFinancial';
import { Step3SituationDescriptions } from '@/features/application/steps/Step3SituationDescriptions';
import { usePersistForm } from '@/hooks/usePersistForm';
import { STEPS } from '@/constants';

/**
 * Main 3-step application wizard.
 * Persists form to localStorage via usePersistForm.
 * Accessible: step region and progress bar have ARIA attributes.
 */
export function ApplicationWizard() {
  const { t } = useTranslation();
  const currentStep = useSelector((state) => state.application.currentStep);

  usePersistForm();

  const stepContent = () => {
    switch (currentStep) {
      case STEPS.STEP_1:
        return <Step1PersonalInfo />;
      case STEPS.STEP_2:
        return <Step2FamilyFinancial />;
      case STEPS.STEP_3:
        return <Step3SituationDescriptions />;
      default:
        return <Step1PersonalInfo />;
    }
  };

  return (
    <div className="application-wizard" role="application" aria-label={t('app.title')}>
      <ProgressBar currentStep={currentStep} />
      <main className="wizard-content" role="main" aria-label={t('steps.personalInfo')}>
        {stepContent()}
      </main>
    </div>
  );
}

export default ApplicationWizard;
