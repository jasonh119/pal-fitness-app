import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import TargetDetail from '../_components/TargetDetail';

interface TargetDetailPageProps {
  params: Promise<{ targetId: string }>;
}

export async function generateMetadata(
  { params }: TargetDetailPageProps
): Promise<Metadata> {
  const { targetId } = await params;
  
  return {
    title: `Target Details | PAL Fitness`,
    description: `View progress and details for target ${targetId}`,
  };
}

export default async function TargetDetailPage({ 
  params 
}: TargetDetailPageProps) {
  const { targetId } = await params;
  
  if (!targetId) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TargetDetail targetId={targetId} />
      </div>
    </div>
  );
}