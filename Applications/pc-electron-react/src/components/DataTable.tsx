import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ChevronRightIcon } from 'lucide-react';
import React from 'react';
import { PlusIcon } from 'lucide-react';
import { BindIdManager } from '@/utils/BindIdManager';

// Interface avec les données du composant
export interface DataTableComponent<TData, TValue> {
  id: string;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  rowOnClick?: (row: TData) => void;
  onCreate?: () => void;
}

/**
 * COmposant affichant un tableau avec des éléments
 * @param dataComponent Données de la table
 * @returns Renvoie un composant
 */
export function DataTable<TData, TValue>(
  dataComponent: DataTableComponent<TData, TValue>
) {
  // --- ID ---
  const bindId: BindIdManager = new BindIdManager(
    dataComponent.id + '-DataTable'
  );

  // --- FILTRE TRIE ---
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // --- TABLE ---
  const { columns, data, rowOnClick } = dataComponent;
  const [rowSelection, setRowSelection] = React.useState({});
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      rowSelection,
      sorting,
    },
  });

  return (
    <div
      id={bindId.bindId(1, 'MainContainer')}
      className="overflow-hidden rounded-md border bg-white p-1"
    >
      <Table id={bindId.bindId(2, 'MainContainer')}>
        {/* En-tête du tableau */}
        <TableHeader
          id={bindId.bindId(3, 'TableHeader')}
          className="border-b-2"
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow id={bindId.bindId(4, 'RowHeader')} key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead id={bindId.bindId(5, 'Header')} key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        {/* Corps du tableau */}
        <TableBody id={bindId.bindId(3, 'TableBody')}>
          {/* Btn d'ajout - utilisable uniquement si onCreate est définit */}
          {dataComponent.onCreate !== undefined ? (
            <TableRow
              id={bindId.bindId(4, 'RowAddButton')}
              className="border-0"
            >
              <TableCell
                id={bindId.bindId(5, 'CellAddButton')}
                colSpan={columns.length + 1}
              >
                <button
                  id={bindId.bindId(6, 'ButtonAdd')}
                  onClick={() => {
                    if (dataComponent.onCreate !== undefined)
                      dataComponent.onCreate();
                  }}
                  className="w-full bg-[#f1f2f3] p-3 flex justify-center align-center rounded-lg border-1"
                >
                  <PlusIcon size={20} />
                </button>
              </TableCell>
            </TableRow>
          ) : undefined}

          {/* Liste des données */}
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} id={bindId.bindId(4, 'TableRow')}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    id={bindId.bindId(5, 'RowData')}
                    className="py-4"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
                <TableCell
                  id={bindId.bindId(5, 'RowDetails')}
                  className="py-4 w-[120px]"
                >
                  <div
                    id={bindId.bindId(6, 'Container')}
                    className="flex justify-end items-center gap-2"
                  >
                    {rowOnClick && (
                      <>
                        <button
                          id={bindId.bindId(7, 'BtnDetails')}
                          className="text-blue-500 hover:underline text-sm flex items-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            rowOnClick(row.original);
                          }}
                        >
                          Détails
                          <ChevronRightIcon className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow id={bindId.bindId(4, 'EmptyRow')}>
              <TableCell
                id={bindId.bindId(5, 'EmptyCell')}
                colSpan={columns.length}
                className="h-24 text-center"
              >
                <p id={bindId.bindId(6, 'EmptyMsg')}>Aucun résultat</p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
