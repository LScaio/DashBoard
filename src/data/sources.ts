/**
 * Potential data sources. None of these organisations is integrated with this
 * prototype; no data shown in the dashboard comes from them. Descriptions are
 * intentionally generic and contain no links, report titles or figures.
 */
export interface PotentialSource {
  id: string
  name: string
  category: 'United Nations' | 'Regional organisation' | 'Judicial' | 'National' | 'Humanitarian'
  description: string
  dataKind: string
}

export const POTENTIAL_SOURCES: PotentialSource[] = [
  {
    id: 'un',
    name: 'United Nations',
    category: 'United Nations',
    description: 'System-wide reporting on the protection of civilians and conflict-related sexual violence.',
    dataKind: 'Periodic reports',
  },
  {
    id: 'un-women',
    name: 'UN Women',
    category: 'United Nations',
    description: 'Gender analyses of humanitarian needs and of the impact of the war on women and girls.',
    dataKind: 'Gender analyses',
  },
  {
    id: 'ohchr',
    name: 'Office of the UN High Commissioner for Human Rights',
    category: 'United Nations',
    description: 'Human rights monitoring, documentation methodology and periodic public updates.',
    dataKind: 'Monitoring reports',
  },
  {
    id: 'hrmmu',
    name: 'Human Rights Monitoring Mission in Ukraine',
    category: 'United Nations',
    description: 'Field-based documentation of human rights violations with defined verification standards.',
    dataKind: 'Verified case documentation',
  },
  {
    id: 'osce',
    name: 'OSCE',
    category: 'Regional organisation',
    description: 'Expert missions and reports on violations of international humanitarian and human rights law.',
    dataKind: 'Expert mission reports',
  },
  {
    id: 'icc',
    name: 'International Criminal Court',
    category: 'Judicial',
    description: 'Public information on judicial proceedings relating to the situation in Ukraine.',
    dataKind: 'Judicial records (public)',
  },
  {
    id: 'who',
    name: 'World Health Organization',
    category: 'United Nations',
    description: 'Health-system data, including access to clinical and psychosocial services for survivors.',
    dataKind: 'Health service data',
  },
  {
    id: 'ua-gov',
    name: 'Ukrainian government / public datasets',
    category: 'National',
    description: 'Official registers and open-data publications maintained by national authorities.',
    dataKind: 'Public registers',
  },
  {
    id: 'humanitarian',
    name: 'Reputable humanitarian organisations',
    category: 'Humanitarian',
    description: 'Service-provider and protection-cluster data, shared under survivor-centred safeguards.',
    dataKind: 'Aggregated service data',
  },
]
