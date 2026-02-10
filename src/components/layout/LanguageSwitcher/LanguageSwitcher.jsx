import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const nextLang = isRTL ? 'en' : 'ar';
  const label = isRTL ? 'English' : 'العربية';

  const handleClick = () => {
    i18n.changeLanguage(nextLang);
  };

  return (
    <Button
      type="default"
      onClick={handleClick}
      aria-label={`Switch language to ${label}`}
      className="language-switcher"
    >
      {label}
    </Button>
  );
}

export default LanguageSwitcher;
