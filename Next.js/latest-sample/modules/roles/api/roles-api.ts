import { Role } from '../types';

/**
 * Fetch all roles from the API
 */
export async function fetchRoles(): Promise<Role[]> {
  try {
    const response = await fetch('/api/roles', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch roles: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
}

/**
 * Fetch a single role by ID
 */
export async function fetchRoleById(id: string): Promise<Role> {
  try {
    const response = await fetch(`/api/roles/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch role: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching role:', error);
    throw error;
  }
}

/**
 * Create a new role
 */
export async function createRole(role: Omit<Role, 'id'>): Promise<Role> {
  try {
    const response = await fetch('/api/roles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(role),
    });

    if (!response.ok) {
      throw new Error(`Failed to create role: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
}

/**
 * Update an existing role
 */
export async function updateRole(id: string, role: Partial<Role>): Promise<Role> {
  try {
    const response = await fetch(`/api/roles/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(role),
    });

    if (!response.ok) {
      throw new Error(`Failed to update role: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating role:', error);
    throw error;
  }
}

/**
 * Delete a role
 */
export async function deleteRole(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/roles/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete role: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting role:', error);
    throw error;
  }
}

/**
 * Assign role to users
 */
export async function assignRoleToUsers(roleId: string, userIds: string[]): Promise<void> {
  try {
    const response = await fetch(`/api/roles/${roleId}/assign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userIds }),
    });

    if (!response.ok) {
      throw new Error(`Failed to assign role: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error assigning role:', error);
    throw error;
  }
}
