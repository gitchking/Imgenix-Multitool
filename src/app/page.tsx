
import { ToolCard } from '@/components/tool-card';
import { tools } from '@/lib/tools';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} {...tool} />
        ))}
      </div>
    </div>
  );
}
