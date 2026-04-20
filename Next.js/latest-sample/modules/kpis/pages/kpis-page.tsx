'use client';

import { useState } from 'react';
import { Plus, ChevronRight } from 'lucide-react';
import { useKPIsStore } from '@/src/store/useKPIsStore';
import { KPIPackCard } from '../components/kpi-pack-card';
import { KPIRecommendations } from '../components/kpi-recommendations';
import { KPIListItem } from '../components/kpi-list-item';
import { SearchBar } from '@/src/shared/components';
import { KPIModal } from '../components/kpi-modal';
import { KPI, KPIPack } from '../types';
import { KPIFormData } from '../schemas/kpi.schema';

// Sample KPI Packs
const kpiPacks: KPIPack[] = [
  {
    id: '1',
    name: 'IT Support Pack',
    emoji: '🎯',
    description: 'Ticket resolution, response time, satisfaction',
    kpiCount: 12,
  },
  {
    id: '2',
    name: 'Sales Pack',
    emoji: '💰',
    description: 'Revenue, conversion, pipeline velocity',
    kpiCount: 8,
  },
  {
    id: '3',
    name: 'HR Pack',
    emoji: '👥',
    description: 'Retention, engagement, recruitment metrics',
    kpiCount: 10,
  },
  {
    id: '4',
    name: 'Engineering Pack',
    emoji: '💻',
    description: 'Code quality, deployment frequency, bug resolution',
    kpiCount: 15,
  },
];

export default function KPIsPage() {
  const { kpis, addKPI, updateKPI, deleteKPI } = useKPIsStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedKPI, setSelectedKPI] = useState<KPI | null>(null);

  // Filter KPIs based on search query
  const activeKPIs = kpis.filter((kpi: KPI) => kpi.status === 'active');
  const filteredKPIs = activeKPIs.filter((kpi: KPI) =>
    kpi.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (kpi.description && kpi.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleAddClick = () => {
    setModalMode('add');
    setSelectedKPI(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (kpi: KPI) => {
    setModalMode('edit');
    setSelectedKPI(kpi);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (kpi: KPI) => {
    if (window.confirm(`Are you sure you want to delete ${kpi.name}?`)) {
      deleteKPI(kpi.id);
    }
  };

  const handleSubmit = (data: KPIFormData) => {
    if (modalMode === 'edit' && selectedKPI) {
      updateKPI(selectedKPI.id, {
        name: data.name,
        description: data.description,
        formula: data.formula,
        type: data.type,
        frequency: data.frequency,
        target: data.target,
        unit: data.unit,
        department: data.department,
        owner: data.owner,
        status: data.status || 'active',
      });
    } else {
      addKPI({
        name: data.name,
        description: data.description || '',
        formula: data.formula || '',
        type: data.type,
        frequency: data.frequency,
        target: data.target,
        currentValue: 0,
        unit: data.unit,
        status: data.status || 'active',
        department: data.department || '',
        owner: data.owner || '',
        weight: 1,
      });
    }
    setIsModalOpen(false);
    setSelectedKPI(null);
  };

  const handleAddPack = (pack: KPIPack) => {
    console.log('Add pack:', pack);
  };

  const handleViewAllPacks = () => {
    console.log('View all packs');
  };

  const handleViewRecommendations = () => {
    console.log('View recommendations');
  };

  const handleFilter = () => {
    console.log('Filter clicked');
  };

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">{/*
    weight: 30,
    status: 'active',
    isAIGenerated: true,
  },
];

export function KPIsPage() {
  const handleCreateKPI = () => {
    console.log('Create KPI clicked');
    // Handle create KPI - open modal or navigate to form
  };

  const handleAddPack = (pack: KPIPack) => {
    console.log('Add pack:', pack);
    // Handle add pack
  };

  const handleViewAllPacks = () => {
    console.log('View all packs clicked');
    // Handle view all packs
  };

  const handleViewRecommendations = () => {
    console.log('View recommendations clicked');
    // Handle view AI recommendations
  };

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    // Handle search
  };

  const handleFilter = () => {
    console.log('Filter clicked');
    // Handle filter
  };

  const handleEditKPI = (kpi: KPI) => {
    console.log('Edit KPI:', kpi);
    // Handle edit KPI
  };

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-white text-3xl mb-2">KPI Management</h1>
            <p className="text-[#B0B6C1]">Define, track, and optimize key performance indicators</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all h-9 px-4 py-2 bg-gradient-to-r from-[#00F5C6] to-[#00AEEF] text-[#0A0F1C] hover:opacity-90"
              type="button"
              onClick={handleAddClick}
            >
              <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
              Create KPI
            </button>
          </div>
        </div>

        {/* KPI Packs Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-xl">KPI Packs</h2>
            <button
              data-slot="button"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent dark:hover:bg-accent/50 h-9 px-4 py-2 has-[>svg]:px-3 text-[#00F5C6] hover:text-[#00F5C6]/80"
              onClick={handleViewAllPacks}
            >
              View All
              <ChevronRight className="w-4 h-4 ml-1" aria-hidden="true" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiPacks.map((pack) => (
              <KPIPackCard key={pack.id} pack={pack} onAddPack={handleAddPack} />
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <KPIRecommendations onViewRecommendations={handleViewRecommendations} />

  {/* Search Bar */}
  <SearchBar onSearch={handleSearch} onFilter={handleFilter} placeholder="Search KPIs..." />

        {/* Active KPIs List */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00F5C6]/20 to-[#00AEEF]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
            <div className="p-6">
              <h3 className="text-white text-lg mb-4">Active KPIs ({filteredKPIs.length})</h3>
              <div className="space-y-3">
                {filteredKPIs.map((kpi) => (
                  <KPIListItem 
                    key={kpi.id} 
                    kpi={kpi} 
                    onEdit={handleEditClick}
                  />
                ))}
                {filteredKPIs.length === 0 && (
                  <p className="text-[#B0B6C1] text-center py-8">
                    {searchQuery ? 'No KPIs found matching your search' : 'No active KPIs yet'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Modal */}
      <KPIModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleSubmit}
        kpi={selectedKPI}
        mode={modalMode}
      />
    </div>
  );
}
