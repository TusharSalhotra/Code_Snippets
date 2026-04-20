import { KPI, KPIPack } from '../types';

/**
 * Fetch all KPIs
 */
export async function fetchKPIs(): Promise<KPI[]> {
  try {
    const response = await fetch('/api/kpis', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch KPIs: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching KPIs:', error);
    throw error;
  }
}

/**
 * Fetch KPI packs
 */
export async function fetchKPIPacks(): Promise<KPIPack[]> {
  try {
    const response = await fetch('/api/kpis/packs', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch KPI packs: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching KPI packs:', error);
    throw error;
  }
}

/**
 * Create a new KPI
 */
export async function createKPI(kpi: Omit<KPI, 'id'>): Promise<KPI> {
  try {
    const response = await fetch('/api/kpis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(kpi),
    });

    if (!response.ok) {
      throw new Error(`Failed to create KPI: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating KPI:', error);
    throw error;
  }
}

/**
 * Update an existing KPI
 */
export async function updateKPI(id: string, kpi: Partial<KPI>): Promise<KPI> {
  try {
    const response = await fetch(`/api/kpis/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(kpi),
    });

    if (!response.ok) {
      throw new Error(`Failed to update KPI: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating KPI:', error);
    throw error;
  }
}

/**
 * Delete a KPI
 */
export async function deleteKPI(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/kpis/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete KPI: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting KPI:', error);
    throw error;
  }
}

/**
 * Add a KPI pack to organization
 */
export async function addKPIPack(packId: string): Promise<void> {
  try {
    const response = await fetch(`/api/kpis/packs/${packId}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to add KPI pack: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error adding KPI pack:', error);
    throw error;
  }
}
