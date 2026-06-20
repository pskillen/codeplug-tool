import { Navigate } from 'react-router-dom';
import SummaryDashboard from '../components/SummaryDashboard/SummaryDashboard.tsx';
import { useCodeplug, useProjects } from '../state/codeplugStore.tsx';

export default function Summary() {
  const { activeProject } = useProjects();
  const { codeplug } = useCodeplug();

  if (!activeProject) {
    return <Navigate to="/" replace />;
  }

  return <SummaryDashboard project={activeProject} codeplug={codeplug} />;
}
