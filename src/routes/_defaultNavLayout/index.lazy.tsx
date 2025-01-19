import { createLazyFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { PageContent, PageHeader } from 'components/Layout'
import { EmptyState } from 'components/Layout/EmptyState'

export const Route = createLazyFileRoute('/_defaultNavLayout/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation()
  return (
    <>
      <PageHeader label={t('home.title', 'Home')} />
      <PageContent>
        <EmptyState
          title={t('home.emptyState.title', 'Welcome to Iron Link!')}
          message={t(
            'home.emptyState.description',
            "This is a work-in-progress app for playing Ironsworn and Starforged. I'll fill this in later with some pretty examples and such!",
          )}
        />
      </PageContent>
    </>
  )
}
