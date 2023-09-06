export enum ReadPolicy {
  ASSIGNED = 'assigned',
  ASSIGNED_N_SPECIFIC = 'assigned_n_specific',
  ALL = 'all',
}

export enum CreatePolicy {
  None = 'none',
  ASSIGNED = 'assigned',
  ASSIGNED_N_SPECIFIC = 'assigned_n_specific',
  ALL = 'all',
}

export enum UpdatePolicy {
  None = 'none',
  ASSIGNED = 'assigned',
  ASSIGNED_N_SPECIFIC = 'assigned_n_specific',
  ALL = 'all',
}

export enum DeletePolicy {
  None = 'none',
  ASSIGNED = 'assigned',
  ASSIGNED_N_SPECIFIC = 'assigned_n_specific',
  ALL = 'all',
}

export const InternPolicy = {
  read: ReadPolicy.ASSIGNED,
  create: CreatePolicy.None,
  update: UpdatePolicy.ASSIGNED,
  delete: DeletePolicy.None,
}

export const EmployeePolicy = {
  read: ReadPolicy.ASSIGNED,
  create: CreatePolicy.None,
  update: UpdatePolicy.ASSIGNED,
  delete: DeletePolicy.None,
}

export const LeadPolicy = {
  read: ReadPolicy.ASSIGNED,
  create: CreatePolicy.None,
  update: UpdatePolicy.ASSIGNED,
  delete: DeletePolicy.None,
}

export const ManagerPolicy = {
  read: ReadPolicy.ALL,
  create: CreatePolicy.ALL,
  update: UpdatePolicy.ALL,
  delete: DeletePolicy.ALL,
}
