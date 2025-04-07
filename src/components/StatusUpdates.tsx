
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import api from "@/services/apiService";

// Gets the most recent updates across all batches
const StatusUpdates = () => {
  // Fetch data using React Query
  const { data: woolBatches = [] } = useQuery({
    queryKey: ['woolBatches'],
    queryFn: () => api.batches.getAllBatches(),
  });
  
  const { data: farms = [] } = useQuery({
    queryKey: ['farms'],
    queryFn: () => api.farms.getAllFarms(),
  });
  
  // Extract all journey history items from all batches
  const getRecentUpdates = () => {
    if (!woolBatches.length) return [];
    
    const allUpdates = woolBatches.flatMap(batch => 
      batch.journeyHistory.map(history => ({
        batchId: batch.id,
        farmId: batch.farmId,
        history
      }))
    );
    
    // Sort by timestamp in descending order (most recent first)
    return allUpdates.sort((a, b) => 
      new Date(b.history.timestamp).getTime() - new Date(a.history.timestamp).getTime()
    ).slice(0, 10); // Get the 10 most recent updates
  };
  
  const recentUpdates = getRecentUpdates();

  // Format the timestamp to a human-readable format
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit'
    }).format(date);
  };

  // Get farm name by ID
  const getFarmName = (farmId: string) => {
    const farm = farms.find(f => f.id === farmId);
    return farm ? farm.name : "Unknown Farm";
  };

  // Status badge color mapping
  const getStatusBadgeColor = (status: string) => {
    const statusColors: {[key: string]: string} = {
      'Sheared': 'bg-wool-beige text-wool-darkBrown',
      'Sorted': 'bg-wool-beige text-wool-darkBrown',
      'Cleaned': 'bg-wool-beige text-wool-darkBrown',
      'Processed': 'bg-wool-brown text-white',
      'Spun': 'bg-wool-brown text-white',
      'Dyed': 'bg-wool-brown text-white',
      'Woven': 'bg-wool-darkBrown text-white',
      'Finished': 'bg-wool-darkBrown text-white',
      'Delivered': 'bg-wool-green text-white',
    };
    
    return statusColors[status] || 'bg-wool-gray';
  };
  
  return (
    <div className="space-y-4">
      {recentUpdates.length === 0 ? (
        <p className="text-center text-wool-gray">No recent updates available.</p>
      ) : (
        recentUpdates.map((update, index) => (
          <div 
            key={`${update.batchId}-${index}`} 
            className="p-4 border rounded-lg animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium">
                  {update.batchId.replace('batch-', 'Batch ')}
                </h3>
                <p className="text-sm text-muted-foreground">
                  from {getFarmName(update.farmId)}
                </p>
              </div>
              <Badge className={getStatusBadgeColor(update.history.status)}>
                {update.history.status}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Location: </span>
                <span>{update.history.location}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Handler: </span>
                <span>{update.history.handledBy}</span>
              </div>
            </div>
            
            {update.history.notes && (
              <p className="text-sm mt-2 italic">
                "{update.history.notes}"
              </p>
            )}
            
            <div className="mt-2 text-xs text-right text-muted-foreground">
              {formatTime(update.history.timestamp)}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default StatusUpdates;
