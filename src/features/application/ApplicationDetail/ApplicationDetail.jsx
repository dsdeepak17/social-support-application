import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import { getApplicationResponse } from '@/utils/applicationStorage';

export function ApplicationDetail() {
  const { t } = useTranslation();
  const { applicationId } = useParams();
  const data = getApplicationResponse(applicationId);

  if (!data) {
    return (
      <div className="application-detail" role="main">
        <p className="application-detail-not-found">{t('applicationDetail.notFound')}</p>
        <Link to="/applications/submitted" className="application-detail-back">
          {t('applicationDetail.backToList')}
        </Link>
      </div>
    );
  }

  const jsonString = JSON.stringify(data, null, 2);

  return (
    <div className="application-detail" role="main">
      <div className="application-detail-header">
        <Link to="/applications/submitted" className="application-detail-back">
          {t('applicationDetail.backToList')}
        </Link>
        <h2 className="page-title">
          {t('applicationDetail.title')} #{data.applicationId}
        </h2>
        {data.submittedAt && (
          <p className="application-detail-date">
            {t('applicationDetail.submittedAt')}: {new Date(data.submittedAt).toLocaleString()}
          </p>
        )}
      </div>
      <pre className="application-detail-json" aria-label={t('applicationDetail.jsonLabel')}>
        <code>{jsonString}</code>
      </pre>
    </div>
  );
}

export default ApplicationDetail;
