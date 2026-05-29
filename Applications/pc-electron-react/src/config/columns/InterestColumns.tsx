import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { InterestModel } from '@shared/models/InterestModel';

// Disposition du tableau de "interets" (bibliothèque d'interets)
export const interestColumns: ColumnDef<InterestModel>[] = [
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
    id: 'interet',
    accessorFn: (row) => row.name,
    header: () => <p>Intéret</p>,
    cell: ({ row }) => {
      const resource: InterestModel = row.original as InterestModel;
      return resource.name;
    },
  },
];
