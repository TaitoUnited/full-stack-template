import { useLingui } from '@lingui/react/macro';

import { Dialog } from '~/uikit/dialog';

import { SidebarContent } from './sidebar';

type Props = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export function MobileSidebar({ isOpen, onOpenChange }: Props) {
  const { t } = useLingui();

  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange} placement="drawer">
      <Dialog.Header title={t`Navigation`} />
      <Dialog.Body>
        <SidebarContent onNavigate={() => onOpenChange(false)} />
      </Dialog.Body>
    </Dialog>
  );
}
