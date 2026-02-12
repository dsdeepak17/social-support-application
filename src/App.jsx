import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { ApplicationWizard } from '@/features/application/ApplicationWizard';
import { SavedApplications } from '@/features/application/SavedApplications';
import { ApplicationDetail } from '@/features/application/ApplicationDetail';
import { ROUTES } from '@/constants';
import '@/App.css';

function App() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language, isRTL]);

  return (
    <div className="app" dir={isRTL ? 'rtl' : 'ltr'} lang={i18n.language}>
      <header className="app-header" role="banner">
        <h1 className="app-title">{i18n.t('app.title')}</h1>
        <nav className="app-nav" aria-label={i18n.t('nav.ariaLabel')}>
          <NavLink to={ROUTES.APPLICATIONS.APPLY} className={({ isActive }) => (isActive ? 'app-nav-link active' : 'app-nav-link')}>
            {i18n.t('nav.newApplication')}
          </NavLink>
          <NavLink to={ROUTES.APPLICATIONS.SUBMITTED} className={({ isActive }) => (isActive ? 'app-nav-link active' : 'app-nav-link')}>
            {i18n.t('nav.savedApplications')}
          </NavLink>
        </nav>
        <LanguageSwitcher />
      </header>
      <Routes>
        <Route path={ROUTES.ROOT} element={<Navigate to={ROUTES.APPLICATIONS.APPLY} replace />} />
        <Route path={ROUTES.APPLICATIONS.APPLY} element={<ApplicationWizard />} />
        <Route path={ROUTES.APPLICATIONS.SUBMITTED} element={<SavedApplications />} />
        <Route path={ROUTES.APPLICATION_DETAIL_PATTERN} element={<ApplicationDetail />} />
      </Routes>
    </div>
  );
}

export default App;
