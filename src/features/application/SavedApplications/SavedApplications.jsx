import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { listSavedApplications } from '@/utils/applicationStorage';

export function SavedApplications() {
  const { t } = useTranslation();
  const applications = listSavedApplications();

  const formatDate = (iso) => {
    if (!iso) return '—';
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  };

  return (
    <div className="saved-applications" role="main">
      <h2 className="page-title">{t('nav.savedApplications')}</h2>
      {applications.length === 0 ? (
        <p className="saved-applications-empty">{t('savedApplications.empty')}</p>
      ) : (
        <ul className="saved-applications-list" aria-label={t('nav.savedApplications')}>
          {applications.map(({ applicationId, submittedAt }) => (
            <li key={applicationId}>
              <Link
                to={`/application/${applicationId}`}
                className="saved-application-link"
                aria-label={`${t('savedApplications.viewApplication')} ${applicationId}`}
              >
                <span className="saved-application-id">{t('savedApplications.application')} #{applicationId}</span>
                <span className="saved-application-date">{formatDate(submittedAt)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SavedApplications;
