import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { PatientWithInterestsModel } from '@shared/models/PatientWithInterestsModel';
import { formatDateShort } from '@/utils/DateUtils';

// Disposition du tableau de "patients"
export const patientsColumns: ColumnDef<PatientWithInterestsModel>[] = [
  // Section de la checkbox
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // Section du nom
  {
    id: 'name',
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    header: () => <p>Nom</p>,
    cell: ({ row }) => {
      const patient: PatientWithInterestsModel =
        row.original as PatientWithInterestsModel;
      return `${patient.firstName} ${patient.lastName}`;
    },
  },

  // Section de la date de naissance
  {
    id: 'birth_date',
    accessorFn: (row) => row.birthDate,
    header: () => <p>Date de naissance</p>,
    cell: ({ row }) => {
      const patient: PatientWithInterestsModel =
        row.original as PatientWithInterestsModel;
      return formatDateShort(patient.birthDate);
    },
    enableSorting: true,
  },
];
