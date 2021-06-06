import { Outlet } from 'react-router-dom';

import PageLayout from '~components/navigation/PageLayout';

// NOTE: this needs to be in a separate file so that we can code-split it
// since we don't want to load the page layout in case the user is not authenticated
export default function Main() {
  return (
    <PageLayout>
      <Outlet />
    </PageLayout>
  );
}
