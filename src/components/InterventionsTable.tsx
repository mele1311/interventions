import { Intervention } from "@/lib/mock-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  interventions: Intervention[];
  showUser?: boolean;
}

const InterventionsTable = ({ interventions, showUser }: Props) => {
  if (interventions.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Aucune intervention trouvée.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {showUser && <TableHead>Nom</TableHead>}
                <TableHead>Description</TableHead>
                <TableHead>Lieu</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {interventions.map((i) => (
                <TableRow key={i.id}>
                  {showUser && <TableCell className="font-medium">{i.full_name}</TableCell>}
                  <TableCell className="max-w-[250px] truncate">{i.problem_description}</TableCell>
                  <TableCell>{i.location}</TableCell>
                  <TableCell>{i.date_of_intervention}</TableCell>
                  <TableCell>
                    <Badge variant={i.is_solved ? "default" : "destructive"} className={i.is_solved ? "bg-success text-success-foreground hover:bg-success/90" : ""}>
                      {i.is_solved ? "Résolu" : "Non résolu"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default InterventionsTable;
