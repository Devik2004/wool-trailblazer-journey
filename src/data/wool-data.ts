// Types for our data model
export type WoolGrade = 'Fine' | 'Medium' | 'Coarse' | 'Superfine';
export type BatchStatus = 'Sheared' | 'Sorted' | 'Cleaned' | 'Processed' | 'Spun' | 'Dyed' | 'Woven' | 'Finished' | 'Delivered';

export interface Farm {
  id: string;
  name: string;
  location: string;
  sheep_count: number;
  certifications: string[];
  contact_person: string;
  contact_email: string;
  joined_date: string;
  annual_production: number; // in kg
  photo: string;
  length?:number;
}

export interface JourneyHistoryItem {
  status: BatchStatus;
  location: string;
  timestamp: string;
  handledBy: string;
  notes?: string;
}

export interface WoolBatch {
  id: string;
  farmId: string;
  shearDate: string;
  weight: number; // in kg
  grade: WoolGrade;
  color: string;
  current_status: BatchStatus;
  current_location: string;
  journeyHistory: JourneyHistoryItem[];
  qualityScore: number; // 0-100
}

export interface ProcessingFacility {
  id: string;
  name: string;
  type: 'Sorting' | 'Washing' | 'Processing' | 'Spinning' | 'Dyeing' | 'Weaving';
  location: string;
  capacity: number; // in kg
  current_utilization: number; // percentage
}

// Define the AnalyticsData type
export interface AnalyticsData {
  totalWoolProduced: number;
  averageQualityScore: number;
  productionByFarm: Array<{
    farmName: string;
    production: number;
  }>;
  statusDistribution: Record<BatchStatus, number>;
  monthlyProduction: Array<{
    month: string;
    amount: number;
  }>;
  facilityUtilization: Array<{
    facilityName: string;
    utilizationPercentage: number;
  }>;
}

// Sample data
export const farms: Farm[] = [
  {
    id: 'farm-001',
    name: 'Highland Sheep Ranch',
    location: 'Scottish Highlands',
    sheep_count: 1250,
    certifications: ['Organic', 'Sustainable Farming'],
    contact_person: 'John MacLeod',
    contact_email: 'john@highlandsheep.com',
    joined_date: '2020-04-15',
    annual_production: 5600,
    photo: 'https://images.unsplash.com/photo-1516466823543-f945a3732093'
  },
  {
    id: 'farm-002',
    name: 'Green Valley Wool',
    location: 'Wales',
    sheep_count: 780,
    certifications: ['Rainforest Alliance', 'Animal Welfare Approved'],
    contact_person: 'Emma Davies',
    contact_email: 'emma@greenvalleywool.com',
    joined_date: '2019-09-23',
    annual_production: 3200,
    photo: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30'
  },
  {
    id: 'farm-003',
    name: 'Alpine Merino Farm',
    location: 'Southern Alps, New Zealand',
    sheep_count: 2100,
    certifications: ['Organic', 'Sustainable Farming', 'ZQ Certified'],
    contact_person: 'David Miller',
    contact_email: 'david@alpinemerino.co.nz',
    joined_date: '2018-06-10',
    annual_production: 9400,
    photo: 'https://images.unsplash.com/photo-1446824505046-e43605ffb17f'
  }
];

export const woolBatches: WoolBatch[] = [
  {
    id: 'batch-001',
    farmId: 'farm-001',
    shearDate: '2023-05-15',
    weight: 450,
    grade: 'Fine',
    color: 'White',
    current_status: 'Processed',
    current_location: 'Yorkshire Processing Co.',
    journeyHistory: [
      {
        status: 'Sheared',
        location: 'Highland Sheep Ranch',
        timestamp: '2023-05-15T09:30:00',
        handledBy: 'John MacLeod',
        notes: 'Spring shearing completed with good yield'
      },
      {
        status: 'Sorted',
        location: 'Highland Sheep Ranch',
        timestamp: '2023-05-17T14:20:00',
        handledBy: 'Sarah Johnson',
        notes: 'Separated by grade and color'
      },
      {
        status: 'Cleaned',
        location: 'CleanWool Facility',
        timestamp: '2023-05-25T10:15:00',
        handledBy: 'Mike Thomson',
        notes: 'Washed and dried using eco-friendly processes'
      },
      {
        status: 'Processed',
        location: 'Yorkshire Processing Co.',
        timestamp: '2023-06-02T13:40:00',
        handledBy: 'Yorkshire Team',
      }
    ],
    qualityScore: 92
  },
  {
    id: 'batch-002',
    farmId: 'farm-002',
    shearDate: '2023-04-30',
    weight: 380,
    grade: 'Medium',
    color: 'Cream',
    current_status: 'Spun',
    current_location: 'Traditional Spinners Ltd.',
    journeyHistory: [
      {
        status: 'Sheared',
        location: 'Green Valley Wool',
        timestamp: '2023-04-30T08:45:00',
        handledBy: 'Robert Davies',
      },
      {
        status: 'Sorted',
        location: 'Green Valley Wool',
        timestamp: '2023-05-01T16:30:00',
        handledBy: 'Emma Davies',
      },
      {
        status: 'Cleaned',
        location: 'CleanWool Facility',
        timestamp: '2023-05-07T11:20:00',
        handledBy: 'Mike Thomson',
      },
      {
        status: 'Processed',
        location: 'Yorkshire Processing Co.',
        timestamp: '2023-05-18T14:10:00',
        handledBy: 'Yorkshire Team',
      },
      {
        status: 'Spun',
        location: 'Traditional Spinners Ltd.',
        timestamp: '2023-05-30T09:50:00',
        handledBy: 'Traditional Spinners Team',
        notes: 'Spun into medium-weight yarn'
      }
    ],
    qualityScore: 87
  },
  {
    id: 'batch-003',
    farmId: 'farm-003',
    shearDate: '2023-06-05',
    weight: 720,
    grade: 'Superfine',
    color: 'White',
    current_status: 'Cleaned',
    current_location: 'EcoClean Wool Services',
    journeyHistory: [
      {
        status: 'Sheared',
        location: 'Alpine Merino Farm',
        timestamp: '2023-06-05T07:30:00',
        handledBy: 'Alpine Shearing Team',
        notes: 'Premium merino wool from winter coats'
      },
      {
        status: 'Sorted',
        location: 'Alpine Merino Farm',
        timestamp: '2023-06-06T15:45:00',
        handledBy: 'Quality Control Team',
        notes: 'Grade A classification - premium quality'
      },
      {
        status: 'Cleaned',
        location: 'EcoClean Wool Services',
        timestamp: '2023-06-12T10:30:00',
        handledBy: 'EcoClean Team',
        notes: 'Gentle washing to preserve fiber quality'
      }
    ],
    qualityScore: 98
  },
  {
    id: 'batch-004',
    farmId: 'farm-001',
    shearDate: '2023-05-16',
    weight: 390,
    grade: 'Medium',
    color: 'Light Gray',
    current_status: 'Dyed',
    current_location: 'Natural Dyes Workshop',
    journeyHistory: [
      {
        status: 'Sheared',
        location: 'Highland Sheep Ranch',
        timestamp: '2023-05-16T11:20:00',
        handledBy: 'John MacLeod',
      },
      {
        status: 'Sorted',
        location: 'Highland Sheep Ranch',
        timestamp: '2023-05-17T14:30:00',
        handledBy: 'Sarah Johnson',
      },
      {
        status: 'Cleaned',
        location: 'CleanWool Facility',
        timestamp: '2023-05-26T09:45:00',
        handledBy: 'Mike Thomson',
      },
      {
        status: 'Processed',
        location: 'Yorkshire Processing Co.',
        timestamp: '2023-06-03T15:20:00',
        handledBy: 'Yorkshire Team',
      },
      {
        status: 'Spun',
        location: 'Traditional Spinners Ltd.',
        timestamp: '2023-06-15T13:10:00',
        handledBy: 'Traditional Spinners Team',
      },
      {
        status: 'Dyed',
        location: 'Natural Dyes Workshop',
        timestamp: '2023-06-28T10:40:00',
        handledBy: 'Artisan Dye Team',
        notes: 'Dyed with plant-based indigo'
      }
    ],
    qualityScore: 85
  }
];

export const processingFacilities: ProcessingFacility[] = [
  {
    id: 'facility-001',
    name: 'CleanWool Facility',
    type: 'Washing',
    location: 'Leeds, UK',
    capacity: 2000,
    current_utilization: 65
  },
  {
    id: 'facility-002',
    name: 'Yorkshire Processing Co.',
    type: 'Processing',
    location: 'Yorkshire, UK',
    capacity: 1800,
    current_utilization: 80
  },
  {
    id: 'facility-003',
    name: 'Traditional Spinners Ltd.',
    type: 'Spinning',
    location: 'Manchester, UK',
    capacity: 1500,
    current_utilization: 70
  },
  {
    id: 'facility-004',
    name: 'Natural Dyes Workshop',
    type: 'Dyeing',
    location: 'Bristol, UK',
    capacity: 800,
    current_utilization: 45
  },
  {
    id: 'facility-005',
    name: 'Heritage Weavers',
    type: 'Weaving',
    location: 'Edinburgh, UK',
    capacity: 1200,
    current_utilization: 60
  }
];

// Statistics and metrics for analytics
export const analyticsData: AnalyticsData = {
  totalWoolProduced: woolBatches.reduce((total, batch) => total + batch.weight, 0),
  averageQualityScore: Math.round(woolBatches.reduce((total, batch) => total + batch.qualityScore, 0) / woolBatches.length),
  productionByFarm: farms.map(farm => ({
    farmName: farm.name,
    production: woolBatches
      .filter(batch => batch.farmId === farm.id)
      .reduce((total, batch) => total + batch.weight, 0)
  })),
  statusDistribution: {
    Sheared: woolBatches.filter(batch => batch.current_status === 'Sheared').length,
    Sorted: woolBatches.filter(batch => batch.current_status === 'Sorted').length,
    Cleaned: woolBatches.filter(batch => batch.current_status === 'Cleaned').length,
    Processed: woolBatches.filter(batch => batch.current_status === 'Processed').length,
    Spun: woolBatches.filter(batch => batch.current_status === 'Spun').length,
    Dyed: woolBatches.filter(batch => batch.current_status === 'Dyed').length,
    Woven: woolBatches.filter(batch => batch.current_status === 'Woven').length,
    Finished: woolBatches.filter(batch => batch.current_status === 'Finished').length,
    Delivered: woolBatches.filter(batch => batch.current_status === 'Delivered').length,
  },
  monthlyProduction: [
    { month: 'Jan', amount: 0 },
    { month: 'Feb', amount: 0 },
    { month: 'Mar', amount: 0 },
    { month: 'Apr', amount: 380 },
    { month: 'May', amount: 840 },
    { month: 'Jun', amount: 720 },
    { month: 'Jul', amount: 0 },
    { month: 'Aug', amount: 0 },
    { month: 'Sep', amount: 0 },
    { month: 'Oct', amount: 0 },
    { month: 'Nov', amount: 0 },
    { month: 'Dec', amount: 0 },
  ],
  facilityUtilization: processingFacilities.map(facility => ({
    facilityName: facility.name,
    utilizationPercentage: facility.current_utilization
  }))
};
