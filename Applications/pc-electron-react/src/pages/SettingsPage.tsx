// Base
import React from 'react';
// Composants internes
import { PageHeader } from '@/components/PageHeader';

/**
 * Page des paramètres
 */
export default function SettingsPage(): React.JSX.Element {
  /**
   * Affichage de l'adresse IP du client WebSocket
   */
  return (
    <>
      <PageHeader title="Paramètres" />
      <p>Dans cette page, il y aura les paramètres de l&apos;application</p>
    </>
  );
}
