"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableRow } from "@/components/ui/table";

export default function AppointmentSkeleton() {
  const skeletonRows = 3;
  return (
    <div className="flex justify-around">
      <Table>
        <thead>
          <TableRow>
            <th className="text-center p-2">
              <Skeleton className="h-[30px] w-[100px] md:w-[250px]" />
            </th>
            <th className="text-center p-2">
              <Skeleton className="h-[30px] w-[100px] md:w-[250px]" />
            </th>
            <th className="text-center p-2">
              <Skeleton className="h-[30px] w-[100px] md:w-[250px]" />
            </th>
          </TableRow>
        </thead>
        <TableBody>
          {Array.from({ length: skeletonRows }, (_, i) => (
            <TableRow key={i} className="text-center p-2">
              <td>
                <Skeleton className="h-[30px] w-[100px] md:w-[250px]" />
              </td>
              <td>
                <Skeleton className="h-[30px] w-[100px] md:w-[250px]" />
              </td>
              <td>
                <Skeleton className="h-[30px] w-[100px] md:w-[250px]" />
              </td>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
