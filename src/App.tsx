/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommissionDashboard } from './components/CommissionDashboard';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <CommissionDashboard />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
