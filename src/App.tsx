/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommissionDashboard } from './components/CommissionDashboard';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <CommissionDashboard />
    </ErrorBoundary>
  );
}
