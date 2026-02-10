import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Button, TextArea, Spin } from '@/components/ui';

/**
 * Modal to display AI-generated suggestion with Accept, Edit, or Discard.
 * Accessible: focus trap and aria attributes handled by Ant Design Modal.
 */
export function AISuggestionModal({ open, onClose, suggestion, onAccept, loading }) {
  const { t } = useTranslation();
  const [editedText, setEditedText] = useState(suggestion ?? '');

  const handleAccept = () => {
    onAccept(editedText);
    onClose();
  };

  const handleDiscard = () => {
    onClose();
  };

  useEffect(() => {
    if (open && suggestion != null) setEditedText(suggestion);
  }, [open, suggestion]);

  const handleAfterOpenChange = (visible) => {
    if (visible) setEditedText(suggestion ?? '');
  };

  return (
    <Modal
      open={open}
      onCancel={handleDiscard}
      afterOpenChange={handleAfterOpenChange}
      title={t('ai.suggestionTitle')}
      footer={[
        <Button key="discard" onClick={handleDiscard} aria-label={t('actions.discard')}>
          {t('actions.discard')}
        </Button>,
        <Button key="accept" type="primary" onClick={handleAccept} loading={loading} aria-label={t('actions.accept')}>
          {t('actions.accept')}
        </Button>,
      ]}
      width={560}
      destroyOnHidden
      aria-labelledby="ai-suggestion-title"
      aria-describedby="ai-suggestion-content"
    >
      <div id="ai-suggestion-content">
        {loading && !suggestion ? (
          <div className="ai-modal-loading" role="status" aria-live="polite">
            <Spin size="large" />
            <p>{t('ai.generating')}</p>
          </div>
        ) : (
          <TextArea
            rows={6}
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            placeholder={t('ai.suggestionTitle')}
            aria-label={t('ai.suggestionTitle')}
            disabled={loading}
          />
        )}
      </div>
    </Modal>
  );
}

export default AISuggestionModal;
