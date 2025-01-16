import { createLazyFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { PageContent, PageHeader } from 'components/Layout'
import { EmptyState } from 'components/Layout/EmptyState'

export const Route = createLazyFileRoute('/_defaultNavLayout/worlds/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation()
  return (
    <>
      <PageHeader label={t('worlds.title', 'Worlds')} />
      <PageContent>
        <EmptyState
          title={t('worlds.emptyState.title', 'Coming Soon!')}
          message={t(
            'worlds.emptyState.description',
            'Worlds are not yet available in the beta version.',
          )}
        />
      </PageContent>
    </>
  )
}
