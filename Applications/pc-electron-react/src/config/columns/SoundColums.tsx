import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { ResourceModel } from '@shared/models/ResourceModel';

// Disposition du tableau de "sons" (bibliothèque de sons)
export const soundColumns: ColumnDef<ResourceModel>[] = [
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
    id: 'sound',
    accessorFn: (row) => row.name,
    header: () => <p>Son</p>,
    cell: ({ row }) => {
      const resource: ResourceModel = row.original as ResourceModel;
      return resource.name;
    },
  },
];
