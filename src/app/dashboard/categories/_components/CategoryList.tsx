import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CategoryType } from '@/server/db/schema'
import CategoryActions from './CategoryActions'


interface CategoryListProps {
  Categories: CategoryType[]
  updateAction: (formData: FormData) => void
  deleteAction: (formData: FormData) => void
  isPendingUpdate: boolean
  isPendingDelete: boolean
}

export default function CategoryList({ Categories, updateAction, deleteAction, isPendingUpdate, isPendingDelete }: CategoryListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Category List</CardTitle>
        <CardDescription>Manage your existing Categories</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Categories.map((Category) => (
              <TableRow key={Category.id}>
                <TableCell>{Category.id}</TableCell>
                <TableCell>{Category.name}</TableCell>
                <TableCell>
                  <CategoryActions
                    Category={Category}
                    updateAction={updateAction}
                    deleteAction={deleteAction}
                    isPendingUpdate={isPendingUpdate}
                    isPendingDelete={isPendingDelete}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
