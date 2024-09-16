import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

export interface HeadProps {
  title: string;
  description?: string;
  openGraphImageSrc?: string;
}

export function Head(props: HeadProps) {
  const { title, description, openGraphImageSrc } = props;

  const { t } = useTranslation();
  const appName = t("Iron Link");
  return (
    <Helmet>
      <title>
        {title} | {appName}
      </title>
      <meta property="og:title" content={`${title} | ${appName}`} />
      {description && <meta property="og:description" content={description} />}
      {openGraphImageSrc && (
        <>
          <meta property="og:image" content={openGraphImageSrc} />
          <meta property="og:image:secure_url" content={openGraphImageSrc} />
          <meta property="twitter:image" content={openGraphImageSrc} />
        </>
      )}
    </Helmet>
  );
}
